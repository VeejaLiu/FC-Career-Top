import { DurableObject } from 'cloudflare:workers';
import bcrypt from 'bcryptjs';
import { passwordValid, signToken, tokenId } from './auth';
import { date, game, normalize, positions, positionType, Row, squad, trend } from './players';
import { playerFields } from './player-fields';

interface Env {
    DB: D1Database;
    BACKEND: DurableObjectNamespace<Backend>;
    SECRET_JWT: string;
    ALLOWED_ORIGINS: string;
}

class HttpError extends Error {
    constructor(
        public status: number,
        message: string,
    ) {
        super(message);
    }
}
const ok = (data?: unknown, message = 'success') => ({
    success: true,
    message,
    ...(data === undefined ? {} : { data }),
});
const json = (value: unknown, status = 200) =>
    Response.json(value, { status, headers: { 'Cache-Control': 'no-store' } });
const emailValue = (value: unknown): string | null => {
    if (typeof value !== 'string') return null;
    const email = value.trim().toLowerCase();
    return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
};
const sqlDate = () => new Date().toISOString().replace('T', ' ').slice(0, 19);
const secretKey = () =>
    `fcd-${Array.from(crypto.getRandomValues(new Uint8Array(32)), (n) => n.toString(16).padStart(2, '0')).join('')}`;
const notificationKinds = [
    'PlayerUpdate.Overall',
    'PlayerUpdate.SkillMove',
    'PlayerUpdate.WeakFoot',
    'PlayerUpdate.PlayStyles',
];
const settingsNames: Record<string, string> = {
    PlayerUpdate_Overall: notificationKinds[0],
    PlayerUpdate_SkillMove: notificationKinds[1],
    PlayerUpdate_WeakFoot: notificationKinds[2],
    PlayerUpdate_PlayStyles: notificationKinds[3],
};

export class Backend extends DurableObject<Env> {
    private queue: Promise<unknown> = Promise.resolve();

    constructor(ctx: DurableObjectState, env: Env) {
        super(ctx, env);
        ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair('ping', 'pong'));
        ctx.storage.sql.exec(
            'CREATE TABLE IF NOT EXISTS auth_rate_limit (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL)',
        );
    }

    private statement(sql: string, ...values: any[]) {
        return this.env.DB.prepare(sql).bind(...values);
    }
    private async first(sql: string, ...values: any[]): Promise<Row | null> {
        return this.statement(sql, ...values).first<Row>();
    }
    private async rows(sql: string, ...values: any[]): Promise<Row[]> {
        return (await this.statement(sql, ...values).all<Row>()).results;
    }
    private async run(sql: string, ...values: any[]) {
        return this.statement(sql, ...values).run();
    }

    private rate(request: Request, action: string, limit: number, seconds: number) {
        const now = Date.now();
        const key = `${action}:${request.headers.get('CF-Connecting-IP') || 'local'}`;
        const previous = this.ctx.storage.sql
            .exec<{ count: number; expires: number }>('SELECT count, expires FROM auth_rate_limit WHERE key = ?', key)
            .toArray()[0];
        if (previous && previous.expires > now && previous.count >= limit)
            throw new HttpError(429, 'Too many attempts. Please try again later.');
        this.ctx.storage.sql.exec('DELETE FROM auth_rate_limit WHERE expires < ?', now);
        this.ctx.storage.sql.exec(
            'INSERT INTO auth_rate_limit(key, count, expires) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET count=excluded.count, expires=excluded.expires',
            key,
            previous && previous.expires > now ? previous.count + 1 : 1,
            previous && previous.expires > now ? previous.expires : now + seconds * 1000,
        );
    }

    private closeSockets(id: number) {
        for (const socket of this.ctx.getWebSockets(String(id))) {
            try {
                socket.send('Session changed');
                socket.close(1000, 'Session changed');
            } catch {
                /* Already closed. */
            }
        }
    }

    private async user(request: Request, socket = false): Promise<Row> {
        const token = socket
            ? request.headers.get('Sec-WebSocket-Protocol')?.split(',')[0].trim()
            : request.headers.get('token');
        if (!token) throw new HttpError(401, 'Missing token');
        const id = await tokenId(token, this.env.SECRET_JWT);
        const user = id
            ? await this.first('SELECT * FROM user WHERE id=? AND is_deleted=0 AND token=?', id, token)
            : null;
        if (!user) throw new HttpError(401, 'Token is not valid');
        return user;
    }

    private async body(request: Request): Promise<any> {
        if (Number(request.headers.get('Content-Length') || 0) > 1024 * 1024)
            throw new HttpError(413, 'Upload exceeds 1 MB');
        const text = await request.text();
        if (new TextEncoder().encode(text).length > 1024 * 1024) throw new HttpError(413, 'Upload exceeds 1 MB');
        try {
            return JSON.parse(text || '{}');
        } catch {
            throw new HttpError(400, 'Invalid JSON');
        }
    }

    private async settings(id: number): Promise<Row> {
        await this.run(
            'INSERT INTO user_setting(user_id, default_game_version, enable_notification, notification_items) VALUES (?,25,1,?) ON CONFLICT(user_id) DO NOTHING',
            id,
            JSON.stringify(notificationKinds),
        );
        return (await this.first('SELECT * FROM user_setting WHERE user_id=? AND is_deleted=0', id))!;
    }

    private settingResponse(setting: Row) {
        const kinds: string[] = JSON.parse(setting.notification_items || '[]');
        return {
            userId: setting.user_id,
            defaultGameVersion: setting.default_game_version,
            enableNotification: Boolean(setting.enable_notification),
            notificationItems: Object.fromEntries(
                Object.entries(settingsNames).map(([name, value]) => [name, kinds.includes(value)]),
            ),
        };
    }

    async fetch(request: Request): Promise<Response> {
        const work = this.queue.catch(() => undefined).then(() => this.handle(request));
        this.queue = work;
        try {
            return await work;
        } catch (error) {
            if (error instanceof HttpError) return json({ success: false, message: error.message }, error.status);
            console.error('Backend request failed', error instanceof Error ? error.message : 'Unknown error');
            return json({ success: false, message: 'Request failed. Please try again.' }, 500);
        }
    }

    private async handle(request: Request): Promise<Response> {
        const url = new URL(request.url);
        const path = url.pathname.replace(/\/$/, '') || '/';
        const method = request.method;
        if (path === '/api/health_check') return new Response('ok');
        if (path === '/api') return new Response('Welcome to FC Career Top!');
        if (path === '/ws' && request.headers.get('Upgrade')?.toLowerCase() === 'websocket') {
            const user = await this.user(request, true);
            this.rate(request, `ws:${user.id}`, 20, 60);
            if (this.ctx.getWebSockets(String(user.id)).length >= 8)
                throw new HttpError(429, 'Too many active connections');
            const pair = new WebSocketPair();
            this.ctx.acceptWebSocket(pair[1], [String(user.id)]);
            pair[1].serializeAttachment({ id: user.id });
            pair[1].send('Protocol accepted');
            return new Response(null, {
                status: 101,
                webSocket: pair[0],
                headers: {
                    'Sec-WebSocket-Protocol': request.headers.get('Sec-WebSocket-Protocol')!.split(',')[0].trim(),
                },
            });
        }
        if (path === '/api/v1/user/register' && method === 'POST') {
            this.rate(request, 'register', 10, 3600);
            const input = await this.body(request);
            const email = emailValue(input.email);
            if (!email) throw new HttpError(400, 'A valid email address is required');
            if (!passwordValid(input.password) || input.password !== input.confirmPassword)
                throw new HttpError(
                    400,
                    'Password must contain 6-72 bytes, three character types, and match its confirmation.',
                );
            if (await this.first('SELECT id FROM user WHERE email=? COLLATE NOCASE', email))
                return json({ success: false, message: 'Email already exists' });
            const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
            let username = '';
            for (let attempt = 0; attempt < 5; attempt++) {
                const suffix = Array.from(
                    crypto.getRandomValues(new Uint8Array(4)),
                    (n) => alphabet[n % alphabet.length],
                ).join('');
                const candidate = email.split('@')[0] + suffix;
                if (!(await this.first('SELECT id FROM user WHERE username=? COLLATE NOCASE', candidate))) {
                    username = candidate;
                    break;
                }
            }
            if (!username) throw new HttpError(503, 'Please try registering again');
            const hash = await bcrypt.hash(input.password, 10);
            const created = await this.env.DB.batch([
                this.statement('INSERT INTO user(username, email, password) VALUES (?,?,?)', username, email, hash),
                this.statement(
                    'INSERT INTO user_secret_key(user_id,secret_key) VALUES ((SELECT id FROM user WHERE username=? COLLATE NOCASE),?)',
                    username,
                    secretKey(),
                ),
                this.statement(
                    'INSERT INTO user_setting(user_id,default_game_version,enable_notification,notification_items) VALUES ((SELECT id FROM user WHERE username=? COLLATE NOCASE),25,1,?)',
                    username,
                    JSON.stringify(notificationKinds),
                ),
            ]);
            const id = created[0].meta.last_row_id;
            return json(ok({ id, username, email }));
        }
        if (path === '/api/v1/user/login' && method === 'POST') {
            this.rate(request, 'login', 30, 600);
            const input = await this.body(request);
            const email = emailValue(input.email);
            const valid =
                Boolean(email) &&
                typeof input.password === 'string' &&
                new TextEncoder().encode(input.password).length <= 72;
            const user = valid
                ? await this.first('SELECT * FROM user WHERE email=? COLLATE NOCASE AND is_deleted=0', email)
                : null;
            const hash = user?.password || '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
            const matches = await bcrypt.compare(
                typeof input.password === 'string' ? input.password.slice(0, 72) : '',
                hash,
            );
            if (!valid || !user || !matches) return json({ success: false, message: 'Email or password not matched' });
            const token = await signToken(user.id, this.env.SECRET_JWT);
            await this.run('UPDATE user SET token=?,update_time=CURRENT_TIMESTAMP WHERE id=?', token, user.id);
            this.closeSockets(user.id);
            return json(ok({ id: user.id, username: user.username, email: user.email, token }));
        }
        if (path.startsWith('/api/v1/public/')) {
            if (path.endsWith('/users-count'))
                return json({
                    count: (await this.first('SELECT count(*) AS count FROM user WHERE is_deleted=0'))!.count,
                });
            if (path.endsWith('/daily-new-users-count')) {
                const days = Number(url.searchParams.get('pastDays') || 90);
                if (!Number.isInteger(days) || days < 1 || days > 90)
                    throw new HttpError(400, 'Past days must be 1-90');
                const result = await this.rows(
                    "SELECT date(create_time) AS date,count(*) AS count FROM user WHERE is_deleted=0 AND create_time>=datetime('now',?) GROUP BY date(create_time)",
                    `-${days} days`,
                );
                return json(
                    Array.from({ length: days }, (_, offset) => {
                        const value = new Date(Date.now() - offset * 86400000).toISOString().slice(0, 10);
                        return { date: value, count: result.find((r) => r.date === value)?.count || 0 };
                    }),
                );
            }
            if (path.endsWith('/verify-email')) throw new HttpError(410, 'Email verification is disabled');
        }
        if (path === '/api/v1/player/bulk' && method === 'POST') {
            const key = request.headers.get('secret-key');
            if (!key || key.length > 128) throw new HttpError(401, 'Invalid secret key');
            const owner = await this.first(
                'SELECT s.user_id FROM user_secret_key s JOIN user u ON u.id=s.user_id WHERE s.secret_key=? AND s.is_deleted=0 AND u.is_deleted=0',
                key,
            );
            if (!owner) throw new HttpError(401, 'Invalid secret key');
            this.rate(request, `upload:${owner.user_id}`, 120, 600);
            const input = await this.body(request);
            const version = game(url.searchParams.get('gameVersion'));
            if (!Array.isArray(input) || input.length < 1 || input.length > 200)
                throw new HttpError(400, 'Upload must contain 1-200 players');
            await this.upload(owner.user_id, version, input);
            return json({ success: true, message: 'Snapshot saved' });
        }

        const user = await this.user(request);
        if (path.startsWith('/api/v1/user/')) {
            if (path.endsWith('/verify-token') && method === 'POST') return json(ok(undefined, 'Token is valid'));
            if (path.endsWith('/info'))
                return json(
                    ok({
                        userID: user.id,
                        username: user.username,
                        email: user.email,
                        isEmailVerified: false,
                        emailLoginEnabled: true,
                        authMode: 'email_password',
                    }),
                );
            if (path.endsWith('/logout') && method === 'POST') {
                await this.run('UPDATE user SET token=NULL,update_time=CURRENT_TIMESTAMP WHERE id=?', user.id);
                this.closeSockets(user.id);
                return json(ok());
            }
            if (path.endsWith('/secret') && method === 'GET') {
                const row = await this.first(
                    'SELECT secret_key FROM user_secret_key WHERE user_id=? AND is_deleted=0',
                    user.id,
                );
                return json(ok({ secretKey: row!.secret_key }));
            }
            if (path.endsWith('/secret/refresh') && method === 'POST') {
                const value = secretKey();
                await this.run(
                    'UPDATE user_secret_key SET secret_key=?,update_time=CURRENT_TIMESTAMP WHERE user_id=?',
                    value,
                    user.id,
                );
                return json(ok({ secretKey: value }));
            }
            if (path.endsWith('/password') && method === 'POST') {
                this.rate(request, `password:${user.id}`, 10, 600);
                const input = await this.body(request);
                if (!passwordValid(input.newPassword) || input.newPassword !== input.confirmNewPassword)
                    throw new HttpError(400, 'New password is invalid or does not match');
                if (
                    typeof input.oldPassword !== 'string' ||
                    new TextEncoder().encode(input.oldPassword).length > 72 ||
                    !(await bcrypt.compare(input.oldPassword, user.password))
                )
                    return json({ success: false, message: 'Old password not matched' });
                await this.run(
                    'UPDATE user SET password=?,token=NULL,update_time=CURRENT_TIMESTAMP WHERE id=?',
                    await bcrypt.hash(input.newPassword, 10),
                    user.id,
                );
                this.closeSockets(user.id);
                return json(ok(undefined, 'Password updated. Please sign in again.'));
            }
            if (path.endsWith('/setting')) {
                const setting = await this.settings(user.id);
                if (method === 'GET') return json(ok(this.settingResponse(setting)));
                if (method === 'POST') {
                    const input = await this.body(request);
                    if (input.category === 'default_game_version')
                        await this.run(
                            'UPDATE user_setting SET default_game_version=? WHERE user_id=?',
                            game(input.value),
                            user.id,
                        );
                    else if (input.category === 'enable_notification' && typeof input.value === 'boolean')
                        await this.run(
                            'UPDATE user_setting SET enable_notification=? WHERE user_id=?',
                            Number(input.value),
                            user.id,
                        );
                    else if (
                        input.category === 'notification_items' &&
                        settingsNames[input.subItem] &&
                        typeof input.value === 'boolean'
                    ) {
                        const list = new Set<string>(JSON.parse(setting.notification_items || '[]'));
                        input.value
                            ? list.add(settingsNames[input.subItem])
                            : list.delete(settingsNames[input.subItem]);
                        await this.run(
                            'UPDATE user_setting SET notification_items=? WHERE user_id=?',
                            JSON.stringify([...list]),
                            user.id,
                        );
                    } else throw new HttpError(400, 'Invalid setting');
                    return json(ok());
                }
            }
            if (path.includes('/email')) throw new HttpError(410, 'Email verification is disabled');
        }

        if (path.startsWith('/api/v1/player')) {
            const version = game(url.searchParams.get('gameVersion'));
            if (method !== 'GET') throw new HttpError(405, 'Method not allowed');
            const players = await this.rows(
                'SELECT * FROM player WHERE user_id=? AND game_version=? AND is_deleted=0 AND is_archived=0',
                user.id,
                version,
            );
            if (path === '/api/v1/player') return json(squad(players));
            if (path.endsWith('/count')) return json(players.length);
            if (path.endsWith('/trends')) {
                const history = await this.rows(
                    'SELECT player_id,in_game_date,overallrating,potential FROM player_status_history WHERE user_id=? AND game_version=? AND is_deleted=0 ORDER BY in_game_date',
                    user.id,
                    version,
                );
                return json(
                    players.map((p) => ({
                        playerID: p.player_id,
                        playerName: p.player_name,
                        preferredposition1: positions[Number(p.preferredposition1)],
                        positionType: positionType(p.preferredposition1),
                        trends: history.filter((r) => r.player_id === p.player_id).map(trend),
                    })),
                );
            }
            if (path.startsWith('/api/v1/player/detail/')) {
                const id = Number(path.split('/').pop());
                if (!Number.isSafeInteger(id) || id < 0) throw new HttpError(400, 'Invalid player ID');
                const player = players.find((p) => p.player_id === id) || (id === 0 ? players[0] : null);
                if (!player) return json(null);
                const history = await this.rows(
                    'SELECT * FROM player_status_history WHERE user_id=? AND game_version=? AND player_id=? AND is_deleted=0 ORDER BY in_game_date',
                    user.id,
                    version,
                    player.player_id,
                );
                return json({
                    thisPlayer: { ...player, playStylesList: JSON.parse(player.play_styles || '[]') },
                    trends: history.map(trend),
                });
            }
        }
        if (path.startsWith('/api/v1/notification')) {
            const input = method === 'POST' ? await this.body(request) : null;
            const version = game(input?.gameVersion ?? url.searchParams.get('gameVersion'));
            if (path.endsWith('/unread-count') && method === 'GET')
                return json({
                    count: (await this.first(
                        'SELECT count(*) AS count FROM user_notification WHERE user_id=? AND game_version=? AND is_deleted=0 AND is_read=0',
                        user.id,
                        version,
                    ))!.count,
                });
            if (path.endsWith('/mark-read') && method === 'POST') {
                const id = Number(input.id);
                if (!Number.isSafeInteger(id) || id < 1) throw new HttpError(400, 'Invalid notification ID');
                await this.run(
                    'UPDATE user_notification SET is_read=1 WHERE id=? AND user_id=? AND game_version=?',
                    id,
                    user.id,
                    version,
                );
                return json(ok());
            }
            if (path.endsWith('/mark-all-read') && method === 'POST') {
                await this.run(
                    'UPDATE user_notification SET is_read=1 WHERE user_id=? AND game_version=? AND is_read=0',
                    user.id,
                    version,
                );
                return json(ok());
            }
            if (path === '/api/v1/notification' && method === 'GET') {
                const page = Number(url.searchParams.get('page') || 1),
                    limit = Number(url.searchParams.get('limit') || 10);
                if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100)
                    throw new HttpError(400, 'Invalid pagination');
                const filter = url.searchParams.get('filter') || 'all';
                if (filter !== 'all' && !notificationKinds.includes(filter)) throw new HttpError(400, 'Invalid filter');
                let where = 'n.user_id=? AND n.game_version=? AND n.is_deleted=0';
                const values: any[] = [user.id, version];
                if (url.searchParams.get('onlyUnread') === 'true') where += ' AND n.is_read=0';
                if (filter !== 'all') {
                    where += ' AND n.message_subtype=?';
                    values.push(filter);
                }
                const total = (await this.first(
                    `SELECT count(*) AS count FROM user_notification n WHERE ${where}`,
                    ...values,
                ))!.count;
                const items = await this.rows(
                    `SELECT n.*,p.player_name,p.preferredposition1 FROM user_notification n LEFT JOIN player p ON p.user_id=n.user_id AND p.game_version=n.game_version AND p.player_id=n.player_id WHERE ${where} ORDER BY n.in_game_date DESC,n.id DESC LIMIT ? OFFSET ?`,
                    ...values,
                    limit,
                    (page - 1) * limit,
                );
                return json({
                    total,
                    items: items.map((n) => ({ ...n, player_position: positions[Number(n.preferredposition1)] })),
                });
            }
        }
        throw new HttpError(404, 'Not found');
    }

    private async upload(userId: number, version: number, input: Row[]) {
        let players: Row[];
        try {
            players = input.map((p) => normalize(p, [...playerFields], userId, version));
        } catch (e) {
            throw new HttpError(400, e instanceof Error ? e.message : 'Invalid snapshot');
        }
        if (
            new Set(players.map((p) => p.player_id)).size !== players.length ||
            new Set(players.map((p) => p.in_game_date)).size !== 1
        )
            throw new HttpError(400, 'Snapshot must contain unique players and a single in-game date');
        const latest = await this.first(
            'SELECT max(in_game_date) AS date FROM player_status_history WHERE user_id=? AND game_version=?',
            userId,
            version,
        );
        if (latest?.date && players[0].in_game_date < latest.date)
            throw new HttpError(409, 'An older snapshot cannot replace newer career data');
        const previous = await this.rows('SELECT * FROM player WHERE user_id=? AND game_version=?', userId, version);
        const previousMap = new Map(previous.map((p) => [p.player_id, p]));
        const setting = await this.settings(userId);
        const enabled: string[] = JSON.parse(setting.notification_items || '[]');
        const notifications: Row[] = [];
        const messages: { type: string; payload: Row }[] = [];
        for (const p of players) {
            const old = previousMap.get(p.player_id);
            if (!old || !setting.enable_notification) continue;
            const common = {
                user_id: userId,
                game_version: version,
                in_game_date: p.in_game_date,
                player_id: p.player_id,
                message_type: 'PlayerUpdate',
            };
            const payload = { playerID: p.player_id, playerName: p.player_name, gameVersion: version };
            const push = (kind: string, values: Row, details: Row) => {
                if (enabled.includes(kind)) {
                    notifications.push({ ...common, message_subtype: kind, ...values });
                    messages.push({ type: kind, payload: { ...payload, ...details } });
                }
            };
            if (Number(old.overallrating) !== Number(p.overallrating) || Number(old.potential) !== Number(p.potential))
                push(
                    notificationKinds[0],
                    {
                        old_overall_rating: old.overallrating,
                        overall_rating: p.overallrating,
                        old_potential: old.potential,
                        potential: p.potential,
                    },
                    {
                        oldOverallrating: old.overallrating,
                        overallrating: p.overallrating,
                        oldPotential: old.potential,
                        potential: p.potential,
                    },
                );
            if (Number(old.skillmoves) !== Number(p.skillmoves))
                push(
                    notificationKinds[1],
                    { old_skillmoves: old.skillmoves, skillmoves: p.skillmoves },
                    { oldSkillMoves: old.skillmoves, skillMoves: p.skillmoves },
                );
            if (Number(old.weakfootabilitytypecode) !== Number(p.weakfootabilitytypecode))
                push(
                    notificationKinds[2],
                    { old_weakfoot: old.weakfootabilitytypecode, weakfoot: p.weakfootabilitytypecode },
                    {
                        oldWeakFootAbilityTypeCode: old.weakfootabilitytypecode,
                        weakFootAbilityTypeCode: p.weakfootabilitytypecode,
                    },
                );
            if (old.play_styles !== p.play_styles)
                push(
                    notificationKinds[3],
                    { old_play_styles: old.play_styles, play_styles: p.play_styles },
                    { oldPlayStyles: old.play_styles, playStyles: p.play_styles },
                );
        }
        const columns = playerFields.filter(
            (name) => !['id', 'is_archived', 'is_deleted', 'create_time', 'update_time'].includes(name),
        );
        const selection = columns.map((name) => `json_extract(value,'$.${name}')`).join(',');
        const updates = columns
            .filter((name) => !['user_id', 'game_version', 'player_id'].includes(name))
            .map((name) => `${name}=excluded.${name}`)
            .join(',');
        const data = JSON.stringify(players);
        const batch = [
            this.statement(
                `INSERT INTO player(${columns.join(',')}) SELECT ${selection} FROM json_each(?) WHERE true ON CONFLICT(user_id,game_version,player_id) DO UPDATE SET ${updates},is_archived=0,is_deleted=0,update_time=CURRENT_TIMESTAMP`,
                data,
            ),
            this.statement(
                "UPDATE player SET is_archived=1,update_time=CURRENT_TIMESTAMP WHERE user_id=? AND game_version=? AND player_id NOT IN (SELECT json_extract(value,'$.player_id') FROM json_each(?))",
                userId,
                version,
                data,
            ),
            this.statement(
                "INSERT INTO player_status_history(user_id,game_version,player_id,in_game_date,overallrating,potential) SELECT json_extract(value,'$.user_id'),json_extract(value,'$.game_version'),json_extract(value,'$.player_id'),json_extract(value,'$.in_game_date'),json_extract(value,'$.overallrating'),json_extract(value,'$.potential') FROM json_each(?) WHERE true ON CONFLICT(user_id,game_version,player_id,in_game_date) DO UPDATE SET overallrating=excluded.overallrating,potential=excluded.potential,update_time=CURRENT_TIMESTAMP",
                data,
            ),
        ];
        if (notifications.length) {
            const names = [
                'user_id',
                'game_version',
                'in_game_date',
                'player_id',
                'message_type',
                'message_subtype',
                'old_overall_rating',
                'overall_rating',
                'old_potential',
                'potential',
                'old_skillmoves',
                'skillmoves',
                'old_weakfoot',
                'weakfoot',
                'old_play_styles',
                'play_styles',
            ];
            batch.push(
                this.statement(
                    `INSERT INTO user_notification(${names.join(',')}) SELECT ${names.map((name) => `json_extract(value,'$.${name}')`).join(',')} FROM json_each(?)`,
                    JSON.stringify(notifications),
                ),
            );
        }
        await this.env.DB.batch(batch);
        for (const socket of this.ctx.getWebSockets(String(userId)))
            for (const message of messages) {
                try {
                    socket.send(JSON.stringify(message));
                } catch {
                    /* Disconnected client; notification is stored in D1. */
                }
            }
    }

    async webSocketMessage(socket: WebSocket, message: string | ArrayBuffer) {
        if (message === 'ping') socket.send('pong');
    }
    async webSocketClose(socket: WebSocket, code: number, reason: string) {
        socket.close([1005, 1006, 1015].includes(code) ? 1000 : code, reason);
    }
    async webSocketError(socket: WebSocket) {
        socket.close(1011, 'Connection error');
    }
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        // Buffer a bounded upload before forwarding it. This also lets the actor
        // reject authentication without leaving the caller's stream unread.
        if (request.body) {
            const reader = request.body.getReader();
            const parts: Uint8Array[] = [];
            let length = 0;
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                length += value.byteLength;
                if (length > 1024 * 1024) {
                    await reader.cancel();
                    return json({ success: false, message: 'Upload exceeds 1 MB' }, 413);
                }
                parts.push(value);
            }
            const bytes = new Uint8Array(length);
            let offset = 0;
            for (const part of parts) {
                bytes.set(part, offset);
                offset += part.byteLength;
            }
            request = new Request(request, { body: bytes });
        }
        const origin = request.headers.get('Origin');
        const allowed = (env.ALLOWED_ORIGINS || '')
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean);
        if (origin && !allowed.includes(origin)) return json({ success: false, message: 'Origin is not allowed' }, 403);
        const headers: Record<string, string> = {
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,token,secret-key',
            Vary: 'Origin',
        };
        if (origin) headers['Access-Control-Allow-Origin'] = origin;
        if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
        const response = await env.BACKEND.getByName('fc-career-top').fetch(request);
        if (response.status === 101) return response;
        const output = new Response(response.body, response);
        for (const [name, value] of Object.entries(headers)) output.headers.set(name, value);
        return output;
    },
} satisfies ExportedHandler<Env>;
