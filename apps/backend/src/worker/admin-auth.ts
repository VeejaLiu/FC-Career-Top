import bcrypt from 'bcryptjs';
import { HttpError } from './http';
import { passwordValid } from './auth';

export interface Administrator {
    id: number;
    username: string;
    role: 'owner' | 'operator';
    sessionId: string;
}
interface Account extends Administrator {
    password_hash: string;
}
const sessionSeconds = 8 * 3600;
export const adminJson = (data: unknown, headers: HeadersInit = {}) =>
    Response.json({ success: true, data }, { headers: { 'Cache-Control': 'no-store', ...headers } });
export const adminAudit = (
    db: D1Database,
    actor: Pick<Administrator, 'id' | 'username'>,
    action: string,
    targetType: 'user' | 'administrator' | 'session' | null,
    targetId: string | number | null,
) =>
    db
        .prepare(
            'INSERT INTO admin_audit_event(actor_admin_id,actor_username,action,target_type,target_id) VALUES (?,?,?,?,?)',
        )
        .bind(actor.id, actor.username, action, targetType, targetId === null ? null : String(targetId));
export const usernameValid = (value: unknown): value is string =>
    typeof value === 'string' && /^[a-zA-Z][a-zA-Z0-9_.-]{2,39}$/.test(value);
const cookieName = (request: Request) =>
    new URL(request.url).protocol === 'https:' ? '__Host-fc_admin_session' : 'fc_admin_dev_session';
function cookie(request: Request, value: string, seconds: number) {
    return `${cookieName(request)}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${seconds}${new URL(request.url).protocol === 'https:' ? '; Secure' : ''}`;
}
async function digest(value: string) {
    return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))), (n) =>
        n.toString(16).padStart(2, '0'),
    ).join('');
}
export function requireAdminOrigin(request: Request, origins: string) {
    const origin = request.headers.get('Origin');
    if (
        !origin ||
        !origins
            .split(',')
            .map((v) => v.trim())
            .includes(origin)
    )
        throw new HttpError(403, 'Administrator origin is not allowed');
}
export async function administrator(request: Request, db: D1Database): Promise<Administrator> {
    const name = cookieName(request);
    const token = request.headers
        .get('Cookie')
        ?.split(';')
        .map((v) => v.trim())
        .find((v) => v.startsWith(name + '='))
        ?.slice(name.length + 1);
    if (!token || !/^[a-f0-9]{64}$/.test(token)) throw new HttpError(401, 'Administrator session is not valid');
    const actor = await db
        .prepare(
            `SELECT a.id,a.username,a.role,s.id AS sessionId FROM admin_session s
        JOIN admin_account a ON a.id=s.admin_id WHERE s.token_hash=? AND s.expires_at>? AND a.is_disabled=0`,
        )
        .bind(await digest(token), Math.floor(Date.now() / 1000))
        .first<Administrator>();
    if (!actor) throw new HttpError(401, 'Administrator session is not valid');
    return actor;
}
export async function adminLogin(request: Request, db: D1Database, input: unknown): Promise<Response> {
    const values = input && typeof input === 'object' ? (input as Record<string, unknown>) : {};
    const username = typeof values.username === 'string' ? values.username.trim() : '';
    const valid =
        usernameValid(username) &&
        typeof values.password === 'string' &&
        new TextEncoder().encode(values.password).length <= 72;
    const account = valid
        ? await db
              .prepare(
                  'SELECT id,username,password_hash,role FROM admin_account WHERE username=? COLLATE NOCASE AND is_disabled=0',
              )
              .bind(username)
              .first<Account>()
        : null;
    const matches = await bcrypt.compare(
        typeof values.password === 'string' ? values.password.slice(0, 72) : '',
        account?.password_hash || '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    );
    if (!valid || !account || !matches) throw new HttpError(401, '用户名或密码不正确');
    const token = Array.from(crypto.getRandomValues(new Uint8Array(32)), (n) => n.toString(16).padStart(2, '0')).join(
        '',
    );
    const now = Math.floor(Date.now() / 1000);
    const sessionId = crypto.randomUUID();
    await db.batch([
        db.prepare('DELETE FROM admin_session WHERE expires_at<=?').bind(now),
        db
            .prepare(
                'DELETE FROM admin_session WHERE id IN (SELECT id FROM admin_session WHERE admin_id=? ORDER BY created_at DESC,id DESC LIMIT -1 OFFSET 9)',
            )
            .bind(account.id),
        db
            .prepare(
                'INSERT INTO admin_session(id,admin_id,token_hash,user_agent,expires_at,created_at) VALUES (?,?,?,?,?,?)',
            )
            .bind(
                sessionId,
                account.id,
                await digest(token),
                (request.headers.get('User-Agent') || '').slice(0, 256),
                now + sessionSeconds,
                now,
            ),
        db.prepare('UPDATE admin_account SET last_login_time=CURRENT_TIMESTAMP WHERE id=?').bind(account.id),
        adminAudit(db, account, 'login', 'administrator', account.id),
    ]);
    return adminJson(
        { id: account.id, username: account.username, role: account.role },
        { 'Set-Cookie': cookie(request, token, sessionSeconds) },
    );
}
export async function adminAccountRoute(
    request: Request,
    db: D1Database,
    actor: Administrator,
    readBody: () => Promise<unknown>,
): Promise<Response | null> {
    const path = new URL(request.url).pathname.replace(/\/$/, '');
    if (path === '/api/v1/admin/me' && request.method === 'GET')
        return adminJson({ id: actor.id, username: actor.username, role: actor.role });
    if (path === '/api/v1/admin/logout' && request.method === 'POST') {
        await db.batch([
            db.prepare('DELETE FROM admin_session WHERE id=?').bind(actor.sessionId),
            adminAudit(db, actor, 'logout', 'session', actor.sessionId),
        ]);
        return adminJson(null, { 'Set-Cookie': cookie(request, '', 0) });
    }
    if (path === '/api/v1/admin/password' && request.method === 'POST') {
        const input = (await readBody()) as Record<string, unknown>;
        if (
            !input ||
            !passwordValid(input.newPassword) ||
            typeof input.newPassword !== 'string' ||
            input.newPassword.length < 12 ||
            input.newPassword !== input.confirmPassword
        )
            throw new HttpError(400, '新密码至少 12 位，包含三类字符，并与确认密码一致');
        const account = await db
            .prepare('SELECT password_hash FROM admin_account WHERE id=?')
            .bind(actor.id)
            .first<{ password_hash: string }>();
        if (
            typeof input.currentPassword !== 'string' ||
            new TextEncoder().encode(input.currentPassword).length > 72 ||
            !account ||
            !(await bcrypt.compare(input.currentPassword, account.password_hash))
        )
            throw new HttpError(400, '当前密码不正确');
        await db.batch([
            db
                .prepare('UPDATE admin_account SET password_hash=?,update_time=CURRENT_TIMESTAMP WHERE id=?')
                .bind(await bcrypt.hash(input.newPassword, 10), actor.id),
            db.prepare('DELETE FROM admin_session WHERE admin_id=?').bind(actor.id),
            adminAudit(db, actor, 'change-admin-password', 'administrator', actor.id),
        ]);
        return adminJson(null, { 'Set-Cookie': cookie(request, '', 0) });
    }
    if (path === '/api/v1/admin/sessions' && request.method === 'GET') {
        const items = (
            await db
                .prepare(
                    'SELECT id,user_agent,created_at,expires_at FROM admin_session WHERE admin_id=? AND expires_at>? ORDER BY created_at DESC',
                )
                .bind(actor.id, Math.floor(Date.now() / 1000))
                .all<{ id: string; user_agent: string; created_at: number; expires_at: number }>()
        ).results;
        return adminJson(items.map((s) => ({ ...s, current: s.id === actor.sessionId })));
    }
    if (path === '/api/v1/admin/sessions/revoke-others' && request.method === 'POST') {
        await db.batch([
            db.prepare('DELETE FROM admin_session WHERE admin_id=? AND id<>?').bind(actor.id, actor.sessionId),
            adminAudit(db, actor, 'revoke-admin-sessions', 'administrator', actor.id),
        ]);
        return adminJson(null);
    }
    if (path === '/api/v1/admin/administrators') {
        if (actor.role !== 'owner') throw new HttpError(403, '仅所有者可以管理管理员');
        if (request.method === 'GET')
            return adminJson(
                (
                    await db
                        .prepare(
                            'SELECT id,username,role,is_disabled,last_login_time,create_time FROM admin_account ORDER BY id',
                        )
                        .all()
                ).results,
            );
        if (request.method === 'POST') {
            const input = (await readBody()) as Record<string, unknown>;
            if (
                !input ||
                !usernameValid(input.username) ||
                !passwordValid(input.password) ||
                input.password.length < 12 ||
                !['owner', 'operator'].includes(String(input.role))
            )
                throw new HttpError(400, '管理员资料或密码格式不正确');
            if (
                await db
                    .prepare('SELECT id FROM admin_account WHERE username=? COLLATE NOCASE')
                    .bind(input.username)
                    .first()
            )
                throw new HttpError(409, '用户名已存在');
            await db.batch([
                db
                    .prepare('INSERT INTO admin_account(username,password_hash,role) VALUES (?,?,?)')
                    .bind(input.username, await bcrypt.hash(input.password, 10), String(input.role)),
                db
                    .prepare(
                        "INSERT INTO admin_audit_event(actor_admin_id,actor_username,action,target_type,target_id) SELECT ?,?,'create-administrator','administrator',CAST(id AS TEXT) FROM admin_account WHERE username=? COLLATE NOCASE",
                    )
                    .bind(actor.id, actor.username, input.username),
            ]);
            return adminJson(null);
        }
    }
    const match = path.match(/^\/api\/v1\/admin\/administrators\/(\d+)\/status$/);
    if (match && request.method === 'POST') {
        if (actor.role !== 'owner') throw new HttpError(403, '仅所有者可以管理管理员');
        const id = Number(match[1]);
        const input = (await readBody()) as Record<string, unknown>;
        if (!Number.isSafeInteger(id) || id < 1 || !input || typeof input.disabled !== 'boolean')
            throw new HttpError(400, 'Invalid status');
        const target = await db
            .prepare('SELECT role,is_disabled FROM admin_account WHERE id=?')
            .bind(id)
            .first<{ role: string; is_disabled: number }>();
        if (!target) throw new HttpError(404, '管理员不存在');
        if (id === actor.id) throw new HttpError(400, '不能停用自己的账户');
        if (input.disabled && target.role === 'owner') {
            const count = await db
                .prepare("SELECT count(*) AS count FROM admin_account WHERE role='owner' AND is_disabled=0 AND id<>?")
                .bind(id)
                .first<{ count: number }>();
            if (!count?.count) throw new HttpError(400, '必须保留至少一位启用的所有者');
        }
        await db.batch([
            db
                .prepare('UPDATE admin_account SET is_disabled=?,update_time=CURRENT_TIMESTAMP WHERE id=?')
                .bind(Number(input.disabled), id),
            db.prepare('DELETE FROM admin_session WHERE admin_id=?').bind(id),
            adminAudit(
                db,
                actor,
                input.disabled ? 'disable-administrator' : 'enable-administrator',
                'administrator',
                id,
            ),
        ]);
        return adminJson(null);
    }
    return null;
}
