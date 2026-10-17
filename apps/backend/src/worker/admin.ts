import { generateUploadKey } from '../utils/UploadKey';
import { HttpError } from './http';
import { Administrator, adminAudit, adminAccountRoute } from './admin-auth';

type RecordRow = Record<string, string | number | null>;
const userColumns = 'u.id,u.username,u.email,u.is_disabled,u.create_time,u.update_time';
const response = (data: unknown) =>
    Response.json({ success: true, data }, { headers: { 'Cache-Control': 'no-store' } });
function integer(value: string | null, fallback: number, max = Number.MAX_SAFE_INTEGER) {
    const n = value === null ? fallback : Number(value);
    if (!Number.isSafeInteger(n) || n < 1 || n > max) throw new HttpError(400, 'Invalid pagination or identifier');
    return n;
}
function search(value: string | null) {
    if ((value || '').length > 100) throw new HttpError(400, 'Search is too long');
    return `%${(value || '').trim().replace(/[\\%_]/g, '\\$&')}%`;
}

export async function handleAdmin(
    request: Request,
    db: D1Database,
    actor: Administrator,
    body: () => Promise<unknown>,
    closeSockets: (id: number) => void,
): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, '');
    const sql = (query: string, ...values: (string | number | null)[]) => db.prepare(query).bind(...values);
    const rows = async (query: string, ...values: (string | number | null)[]) =>
        (await sql(query, ...values).all<RecordRow>()).results;
    const first = (query: string, ...values: (string | number | null)[]) => sql(query, ...values).first<RecordRow>();
    const audit = (action: string, target: number | null) => adminAudit(db, actor, action, 'user', target);
    const accountResponse = await adminAccountRoute(request, db, actor, body);
    if (accountResponse) return accountResponse;
    if (path === '/api/v1/admin/overview' && request.method === 'GET') {
        const counts = await first(`SELECT
            (SELECT count(*) FROM user WHERE is_deleted=0) AS users,
            (SELECT count(*) FROM user WHERE is_deleted=0 AND is_disabled=1) AS disabledUsers,
            (SELECT count(*) FROM user WHERE is_deleted=0 AND create_time>=datetime('now','-7 days')) AS newUsers,
            (SELECT count(DISTINCT user_id) FROM player WHERE is_deleted=0 AND update_time>=datetime('now','-7 days')) AS uploadingUsers,
            (SELECT count(*) FROM player WHERE is_deleted=0) AS players,
            (SELECT count(*) FROM player_status_history WHERE is_deleted=0) AS snapshots,
            (SELECT max(update_time) FROM player WHERE is_deleted=0) AS latestUpload`);
        const versions = await rows(
            'SELECT game_version,count(*) AS players,count(DISTINCT user_id) AS users FROM player WHERE is_deleted=0 GROUP BY game_version ORDER BY game_version',
        );
        const registrations = await rows(
            "SELECT date(create_time) AS date,count(*) AS count FROM user WHERE is_deleted=0 AND create_time>=datetime('now','-29 days','start of day') GROUP BY date(create_time)",
        );
        const daily = Array.from({ length: 30 }, (_, i) => {
            const date = new Date(Date.now() - (29 - i) * 86400000).toISOString().slice(0, 10);
            return { date, count: registrations.find((r) => r.date === date)?.count || 0 };
        });
        return response({ ...counts, versions, daily });
    }
    if (path === '/api/v1/admin/growth' && request.method === 'GET') {
        const funnel =
            await first(`WITH cohort AS (SELECT id,create_time FROM user WHERE is_deleted=0 AND create_time>=datetime('now','-30 days')),
          uploads AS (SELECT user_id,min(first_seen) AS first_upload,count(*) AS snapshots,count(DISTINCT in_game_date) AS dates FROM career_upload GROUP BY user_id)
          SELECT count(*) AS registrations,sum(CASE WHEN first_upload IS NOT NULL THEN 1 ELSE 0 END) AS activated,
          sum(CASE WHEN dates>=2 THEN 1 ELSE 0 END) AS repeatUsers,
          avg(CASE WHEN first_upload IS NOT NULL THEN max(0,(julianday(first_upload)-julianday(cohort.create_time))*86400) END) AS averageSeconds
          FROM cohort LEFT JOIN uploads ON uploads.user_id=cohort.id`);
        const versions = await rows(
            "SELECT script_version,sum(successes) AS successes,sum(failures) AS failures FROM career_upload_daily WHERE day>=date('now','-29 days') GROUP BY script_version ORDER BY successes+failures DESC",
        );
        const daily = await rows(
            "SELECT day,sum(successes) AS successes,sum(failures) AS failures,count(DISTINCT user_id) AS users FROM career_upload_daily WHERE day>=date('now','-29 days') GROUP BY day ORDER BY day",
        );
        return response({
            funnel,
            versions,
            daily,
            trackingSince: (await first('SELECT min(first_seen) AS date FROM career_upload'))?.date || null,
        });
    }
    if (path === '/api/v1/admin/system' && request.method === 'GET') {
        await sql('SELECT 1').first();
        return response({
            database: 'ok',
            serverTime: new Date().toISOString(),
            runtime: 'Cloudflare Workers / D1',
            gameVersions: [24, 25, 26, 27],
        });
    }
    const page = integer(url.searchParams.get('page'), 1, 100000);
    const limit = integer(url.searchParams.get('limit'), 20, 100);
    const offset = (page - 1) * limit;
    if (path === '/api/v1/admin/lua-errors' && request.method === 'GET') {
        const values: (string | number)[] = [];
        let condition = "r.report_day >= date('now','-29 days')";
        const version = url.searchParams.get('gameVersion');
        if (version) {
            const n = Number(version);
            if (![24, 25, 26, 27].includes(n)) throw new HttpError(400, 'Invalid game version');
            condition += ' AND r.game_version=?';
            values.push(n);
        }
        const userId = url.searchParams.get('userId');
        if (userId) {
            condition += ' AND r.user_id=?';
            values.push(integer(userId, 1));
        }
        const q = search(url.searchParams.get('q'));
        condition +=
            " AND (r.message LIKE ? ESCAPE '\\' OR r.stage LIKE ? ESCAPE '\\' OR r.script_version LIKE ? ESCAPE '\\' OR u.username LIKE ? ESCAPE '\\')";
        values.push(q, q, q, q);
        const from = `FROM lua_error_report r JOIN user u ON u.id=r.user_id WHERE ${condition}`;
        const total = (await first(`SELECT count(*) AS count ${from}`, ...values))!.count;
        const items = await rows(
            `SELECT r.*,u.username AS user_username ${from} ORDER BY r.last_seen DESC,r.id DESC LIMIT ? OFFSET ?`,
            ...values,
            limit,
            offset,
        );
        return response({ items, total, page, limit });
    }
    if (path === '/api/v1/admin/users' && request.method === 'GET') {
        const q = search(url.searchParams.get('q'));
        const status = url.searchParams.get('status') || 'all';
        if (!['all', 'enabled', 'disabled'].includes(status)) throw new HttpError(400, 'Invalid status');
        const condition = `u.is_deleted=0 AND (u.email LIKE ? ESCAPE '\\' OR u.username LIKE ? ESCAPE '\\')${status === 'disabled' ? ' AND u.is_disabled=1' : status === 'enabled' ? ' AND u.is_disabled=0' : ''}`;
        const total = (await first(`SELECT count(*) AS count FROM user u WHERE ${condition}`, q, q))!.count;
        const items = await rows(
            `SELECT ${userColumns},(SELECT count(*) FROM player p WHERE p.user_id=u.id AND p.is_deleted=0) AS player_count FROM user u WHERE ${condition} ORDER BY u.id DESC LIMIT ? OFFSET ?`,
            q,
            q,
            limit,
            offset,
        );
        return response({ items, total, page, limit });
    }
    const userMatch = path.match(/^\/api\/v1\/admin\/users\/(\d+)(?:\/(status|revoke-session|rotate-key))?$/);
    if (userMatch) {
        const id = integer(userMatch[1], 1);
        const target = await first(`SELECT ${userColumns} FROM user u WHERE u.id=? AND u.is_deleted=0`, id);
        if (!target) throw new HttpError(404, 'User not found');
        if (!userMatch[2] && request.method === 'GET') {
            const versions = await rows(
                'SELECT game_version,count(*) AS players,max(update_time) AS latest_upload FROM player WHERE user_id=? AND is_deleted=0 GROUP BY game_version',
                id,
            );
            const settings = await first(
                'SELECT default_game_version,enable_notification FROM user_setting WHERE user_id=? AND is_deleted=0',
                id,
            );
            const history = await first(
                'SELECT count(*) AS count FROM player_status_history WHERE user_id=? AND is_deleted=0',
                id,
            );
            return response({ ...target, versions, settings, snapshots: history!.count });
        }
        if (request.method !== 'POST' || !userMatch[2]) throw new HttpError(405, 'Method not allowed');
        const action = userMatch[2];
        if (action === 'status') {
            const input = await body();
            if (!input || typeof input !== 'object' || !('disabled' in input) || typeof input.disabled !== 'boolean')
                throw new HttpError(400, 'disabled must be boolean');
            await db.batch([
                sql(
                    'UPDATE user SET is_disabled=?,token=NULL,update_time=CURRENT_TIMESTAMP WHERE id=?',
                    Number(input.disabled),
                    id,
                ),
                audit(input.disabled ? 'disable-user' : 'enable-user', id),
            ]);
            closeSockets(id);
        } else if (action === 'revoke-session') {
            await db.batch([
                sql('UPDATE user SET token=NULL,update_time=CURRENT_TIMESTAMP WHERE id=?', id),
                audit(action, id),
            ]);
            closeSockets(id);
        } else {
            const key = generateUploadKey();
            await db.batch([
                sql(
                    'UPDATE user_secret_key SET secret_key=?,update_time=CURRENT_TIMESTAMP WHERE user_id=? AND is_deleted=0',
                    key,
                    id,
                ),
                audit(action, id),
            ]);
        }
        return response(null);
    }
    if (path === '/api/v1/admin/players' && request.method === 'GET') {
        const q = search(url.searchParams.get('q'));
        const version = url.searchParams.get('gameVersion');
        if (version && !['24', '25', '26', '27'].includes(version)) throw new HttpError(400, 'Invalid game version');
        const userId = url.searchParams.get('userId');
        const values: (string | number)[] = [q, q];
        let condition = `p.is_deleted=0 AND (p.player_name LIKE ? ESCAPE '\\' OR u.email LIKE ? ESCAPE '\\')`;
        if (version) {
            condition += ' AND p.game_version=?';
            values.push(Number(version));
        }
        if (userId) {
            condition += ' AND p.user_id=?';
            values.push(integer(userId, 1));
        }
        const archived = url.searchParams.get('archived') || 'all';
        if (!['all', 'active', 'archived'].includes(archived)) throw new HttpError(400, 'Invalid archive filter');
        if (archived !== 'all') {
            condition += ' AND p.is_archived=?';
            values.push(archived === 'archived' ? 1 : 0);
        }
        const total = (await first(
            `SELECT count(*) AS count FROM player p LEFT JOIN user u ON u.id=p.user_id WHERE ${condition}`,
            ...values,
        ))!.count;
        const items = await rows(
            `SELECT p.id,p.user_id,u.email AS user_email,p.game_version,p.player_id,p.player_name,p.overallrating,p.potential,p.is_archived,p.update_time FROM player p LEFT JOIN user u ON u.id=p.user_id WHERE ${condition} ORDER BY p.id DESC LIMIT ? OFFSET ?`,
            ...values,
            limit,
            offset,
        );
        return response({ items, total, page, limit });
    }
    const playerMatch = path.match(/^\/api\/v1\/admin\/players\/(\d+)$/);
    if (playerMatch && request.method === 'GET') {
        const player = await first(
            'SELECT p.*,u.email AS user_email FROM player p LEFT JOIN user u ON u.id=p.user_id WHERE p.id=? AND p.is_deleted=0',
            integer(playerMatch[1], 1),
        );
        if (!player) throw new HttpError(404, 'Player not found');
        const historyTotal = (await first(
            'SELECT count(*) AS count FROM player_status_history WHERE user_id=? AND game_version=? AND save_id=? AND player_id=? AND is_deleted=0',
            player.user_id,
            player.game_version,
            player.save_id,
            player.player_id,
        ))!.count;
        const history = await rows(
            'SELECT in_game_date,overallrating,potential FROM player_status_history WHERE user_id=? AND game_version=? AND save_id=? AND player_id=? AND is_deleted=0 ORDER BY in_game_date DESC LIMIT 100',
            player.user_id,
            player.game_version,
            player.save_id,
            player.player_id,
        );
        return response({ ...player, history: history.reverse(), historyTotal });
    }
    if (path === '/api/v1/admin/audit' && request.method === 'GET') {
        const total = (await first('SELECT count(*) AS count FROM admin_audit_event'))!.count;
        return response({
            items: await rows('SELECT * FROM admin_audit_event ORDER BY id DESC LIMIT ? OFFSET ?', limit, offset),
            total,
            page,
            limit,
        });
    }
    throw new HttpError(404, 'Admin endpoint not found');
}
