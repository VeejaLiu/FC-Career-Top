// Isolated migration + authentication + real Admin service-binding tests.
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync, mkdirSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import WebSocket from 'ws';
const backend = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const directory = mkdtempSync(join(tmpdir(), 'fc-admin-isolation-'));
const port = Number(process.env.ADMIN_TEST_PORT || 8899);
const base = `http://localhost:${port}`;
const configFile = join(directory, 'wrangler.json');
const state = join(directory, 'state');
const migrations = join(directory, 'migrations');
mkdirSync(migrations);
for (const name of [
    '0001_initial_schema.sql',
    '0002_unique_account_email.sql',
    '0003_add_player_positions.sql',
    '0004_add_player_profile.sql',
    '0005_admin.sql',
])
    cpSync(join(backend, 'db/d1-migrations', name), join(migrations, name));
const config = JSON.parse(readFileSync(join(backend, 'wrangler.jsonc'), 'utf8'));
config.name = 'fc-career-top-admin-test';
config.main = join(backend, 'src/worker/index.ts');
delete config.routes;
delete config.account_id;
config.vars = {
    SECRET_JWT: 'disposable-admin-test-signing-secret-123456789',
    ALLOWED_ORIGINS: `http://localhost:3003,http://localhost:${port + 1},https://app.fccareer.top`,
    ADMIN_ALLOWED_ORIGINS: `http://localhost:3003,http://localhost:${port + 1}`,
};
config.d1_databases[0].migrations_dir = migrations;
writeFileSync(configFile, JSON.stringify(config), { mode: 0o600 });
const env = { ...process.env, WRANGLER_SEND_METRICS: 'false' };
const password = 'IndependentAdmin!123';
const userPassword = 'CustomerTest!123';
const processes = [];
let output = '';
async function command(args) {
    return new Promise((resolve, reject) => {
        const child = spawn('pnpm', ['exec', 'wrangler', ...args, '--config', configFile, '--persist-to', state], {
            cwd: backend,
            env,
            stdio: ['ignore', 'pipe', 'pipe'],
        });
        let log = '';
        child.stdout.on('data', (v) => {
            log += v;
        });
        child.stderr.on('data', (v) => {
            log += v;
        });
        child.on('error', reject);
        child.on('exit', (code) => (code === 0 ? resolve(log) : reject(new Error(log))));
    });
}
async function query(sql) {
    return JSON.parse(await command(['d1', 'execute', 'fc-career-top', '--local', '--command', sql, '--json']));
}
async function call(path, { cookie, token, key, body, status = 200, origin = 'http://localhost:3003' } = {}) {
    const response = await fetch(base + path, {
        method: body === undefined ? 'GET' : 'POST',
        headers: {
            ...(origin ? { Origin: origin } : {}),
            ...(cookie ? { Cookie: cookie } : {}),
            ...(token ? { token } : {}),
            ...(key ? { 'secret-key': key } : {}),
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    const text = await response.text();
    assert.equal(response.status, status, `${path}: ${text}`);
    const data = text === 'ok' ? text : JSON.parse(text);
    if (response.headers.has('Set-Cookie'))
        return {
            ...data,
            cookie: response.headers.get('Set-Cookie').split(';')[0],
            setCookie: response.headers.get('Set-Cookie'),
        };
    return data;
}
function serve(args) {
    const child = spawn('pnpm', ['exec', 'wrangler', 'dev', ...args], {
        cwd: backend,
        env,
        stdio: ['ignore', 'pipe', 'pipe'],
        detached: true,
    });
    processes.push(child);
    child.stdout.on('data', (v) => {
        output = (output + v).slice(-12000);
    });
    child.stderr.on('data', (v) => {
        output = (output + v).slice(-12000);
    });
    return child;
}
async function ready(url, child) {
    for (let i = 0; i < 100; i++) {
        try {
            if ((await fetch(url)).ok) return;
        } catch {}
        if (child.exitCode !== null) throw new Error(output);
        await new Promise((r) => setTimeout(r, 200));
    }
    throw new Error('Server not ready: ' + output);
}
try {
    await command(['d1', 'migrations', 'apply', 'fc-career-top', '--local']);
    const fixture = join(directory, 'legacy.sql');
    writeFileSync(
        fixture,
        `INSERT INTO user(id,username,email,password,is_admin) VALUES (1,'admin','admin@example.test','${await bcrypt.hash(password, 10)}',1); INSERT INTO user_secret_key(user_id,secret_key) VALUES (1,'legacy-admin-upload-key'); INSERT INTO user_setting(user_id) VALUES (1); INSERT INTO user_activity(user_id) VALUES (1); INSERT INTO admin_audit_log(actor_id,actor_email,action,target_user_id) VALUES (1,'admin@example.test','bootstrap-admin',1);`,
    );
    await command(['d1', 'execute', 'fc-career-top', '--local', '--file', fixture]);
    cpSync(
        join(backend, 'db/d1-migrations/0006_independent_administrators.sql'),
        join(migrations, '0006_independent_administrators.sql'),
    );
    await command(['d1', 'migrations', 'apply', 'fc-career-top', '--local']);
    await query(
        "INSERT INTO player(user_id,game_version,player_id,player_name) VALUES (1,25,999,'Cleanup guard fixture');",
    );
    cpSync(
        join(backend, 'db/d1-migrations/0007_remove_legacy_admin_identities.sql'),
        join(migrations, '0007_remove_legacy_admin_identities.sql'),
    );
    await assert.rejects(command(['d1', 'migrations', 'apply', 'fc-career-top', '--local']), /CHECK|constraint/i);
    const guarded = await query(
        'SELECT count(*) AS count FROM player WHERE user_id=1; SELECT count(*) AS count FROM user_secret_key WHERE user_id=1;',
    );
    assert.equal(guarded[0].results[0].count, 1);
    assert.equal(guarded[1].results[0].count, 1);
    await query("DELETE FROM player WHERE user_id=1 AND player_id=999 AND player_name='Cleanup guard fixture';");
    await command(['d1', 'migrations', 'apply', 'fc-career-top', '--local']);
    const schema = await query(
        "SELECT name FROM pragma_table_info('user') WHERE name='is_admin'; SELECT count(*) AS count FROM user; SELECT count(*) AS count FROM user_secret_key; SELECT count(*) AS count FROM admin_account; SELECT count(*) AS count FROM sqlite_master WHERE name IN ('admin_audit_log','_admin_migration_users'); SELECT actor_username FROM admin_audit_event;",
    );
    assert.equal(schema[0].results.length, 0);
    assert.equal(schema[1].results[0].count, 0);
    assert.equal(schema[2].results[0].count, 0);
    assert.equal(schema[3].results[0].count, 1);
    assert.equal(schema[4].results[0].count, 0);
    assert.equal(schema[5].results[0].actor_username, 'admin');
    for (const name of [
        '0008_google_login.sql',
        '0009_fct_upload_key_prefix.sql',
        '0010_lua_error_reports.sql',
        '0011_careers_and_history.sql',
        '0012_career_index_cutover.sql',
    ])
        cpSync(join(backend, 'db/d1-migrations', name), join(migrations, name));
    await command(['d1', 'migrations', 'apply', 'fc-career-top', '--local']);
    const server = serve(['--config', configFile, '--port', String(port), '--persist-to', state]);
    await ready(base + '/api/health_check', server);
    await call('/api/v1/admin/login', { body: { email: 'admin@example.test', password }, status: 401 });
    await call('/api/v1/admin/login', { body: { username: 'admin', password }, origin: null, status: 403 });
    const first = await call('/api/v1/admin/login', { body: { username: 'ADMIN', password } });
    let cookie = first.cookie;
    assert.equal(first.data.username, 'admin');
    assert.equal(first.data.role, 'owner');
    assert.ok(!('token' in first.data));
    assert.match(first.setCookie, /HttpOnly/);
    assert.match(first.setCookie, /SameSite=Strict/);
    await call('/api/v1/user/info', { cookie, status: 401 });
    await call('/api/v1/user/info', { token: cookie.split('=')[1], status: 401 });
    await call('/api/v1/admin/overview', { status: 401 });
    await call('/api/v1/user/register', {
        body: { email: 'player@example.test', password: userPassword, confirmPassword: userPassword, is_admin: 1 },
    });
    const user = (await call('/api/v1/user/login', { body: { email: 'player@example.test', password: userPassword } }))
        .data;
    let userToken = user.token;
    const userId = user.id;
    await call('/api/v1/admin/users', { token: userToken, status: 401 });
    await call('/api/v1/admin/login', { body: { username: 'player', password: userPassword }, status: 401 });
    assert.equal((await call('/api/v1/admin/users', { cookie })).data.total, 1);
    assert.equal((await call('/api/v1/admin/overview', { cookie })).data.users, 1);
    assert.equal((await call('/api/v1/public/users-count')).count, 1);
    await call('/api/v1/admin/users/1', { cookie, status: 404 });
    const listed = (await call('/api/v1/admin/users', { cookie })).data.items[0];
    for (const field of ['is_admin', 'password', 'token']) assert.ok(!(field in listed));
    await call('/api/v1/admin/users?status=admin', { cookie, status: 400 });
    await call('/api/v1/admin/users?limit=1000', { cookie, status: 400 });
    assert.equal((await call('/api/v1/admin/users?q=%25', { cookie })).data.total, 0);
    const second = await call('/api/v1/admin/login', { body: { username: 'admin', password } });
    await call('/api/v1/admin/me', { cookie });
    await call('/api/v1/user/info', { token: userToken });
    assert.equal((await call('/api/v1/admin/sessions', { cookie })).data.length, 2);
    await call('/api/v1/admin/sessions/revoke-others', { cookie, body: {} });
    await call('/api/v1/admin/me', { cookie: second.cookie, status: 401 });
    await call('/api/v1/user/info', { token: userToken });
    await call('/api/v1/admin/administrators', {
        cookie,
        body: { username: 'operator', password: 'OperatorTest!123', role: 'operator' },
    });
    const operator = (await call('/api/v1/admin/administrators', { cookie })).data.find(
        (a) => a.username === 'operator',
    );
    assert.equal(operator.id, userId, 'Exercise identical numeric IDs in separate account domains');
    const operatorLogin = await call('/api/v1/admin/login', {
        body: { username: 'operator', password: 'OperatorTest!123' },
    });
    await call('/api/v1/admin/administrators', { cookie: operatorLogin.cookie, status: 403 });
    await call('/api/v1/admin/users', { cookie: operatorLogin.cookie });
    await call('/api/v1/admin/administrators/1/status', { cookie, body: { disabled: true }, status: 400 });
    await call('/api/v1/admin/password', {
        cookie,
        body: {
            currentPassword: 'wrong',
            newPassword: 'NextAdminPassword!456',
            confirmPassword: 'NextAdminPassword!456',
        },
        status: 400,
    });
    const secret = (await call('/api/v1/user/secret', { token: userToken })).data.secretKey;
    const diagnostic = {
        gameVersion: 25,
        scriptVersion: '2026.10.13.1',
        editorVersion: 'v25.1.0',
        stage: 'snapshot.collect',
        message: `Missing table, secret=${secret}, token=disposable-token, password="disposable-password"`,
        traceback: `C:\\Users\\private-name\\tracker.lua:12\n${secret.replace('fct-', 'fcd-')}\nhttps://user:pass@example.test/path?token=private-query`,
        careerDate: '2026-10-13',
        eventId: 4,
        // Only the allowlisted diagnostic fields can reach storage.
        userId: 1,
        players: [{ playerName: 'must-not-be-stored' }],
        headers: { token: 'must-not-be-stored' },
    };
    await call('/api/v1/lua/errors', { body: diagnostic, status: 401 });
    await call('/api/v1/lua/errors', { key: 'invalid', body: diagnostic, status: 401 });
    await call('/api/v1/lua/errors', { key: secret, body: { ...diagnostic, gameVersion: 23 }, status: 400 });
    await call('/api/v1/lua/errors', { key: secret, body: { ...diagnostic, stage: '<script>' }, status: 400 });
    await call('/api/v1/lua/errors', { key: secret, body: { ...diagnostic, careerDate: '2026-02-30' }, status: 400 });
    await call('/api/v1/lua/errors', { key: secret, body: null, status: 400 });
    const invalidJSON = await fetch(base + '/api/v1/lua/errors', {
        method: 'POST',
        headers: { 'secret-key': secret, 'Content-Type': 'application/json' },
        body: '{',
    });
    assert.equal(invalidJSON.status, 400);
    const oversized = await fetch(base + '/api/v1/lua/errors', {
        method: 'POST',
        duplex: 'half',
        headers: { 'secret-key': secret, 'Content-Type': 'application/json' },
        body: new ReadableStream({
            start(controller) {
                controller.enqueue(new Uint8Array(17000));
                controller.close();
            },
        }),
    });
    assert.equal(oversized.status, 413, 'Bounded reads without Content-Length');
    await call('/api/v1/lua/errors', { key: secret, body: diagnostic });
    await call('/api/v1/lua/errors', { key: secret.replace('fct-', 'fcd-'), body: diagnostic });
    await call('/api/v1/admin/lua-errors', { status: 401 });
    await call('/api/v1/admin/lua-errors', { token: userToken, status: 401 });
    const errors = (await call('/api/v1/admin/lua-errors?gameVersion=25', { cookie })).data;
    assert.equal(errors.total, 1);
    assert.equal(errors.items[0].occurrences, 2);
    assert.equal(errors.items[0].user_id, userId);
    assert.equal(errors.items[0].event_id, 4);
    for (const sensitive of [
        secret,
        'fcd-' + secret.slice(4),
        'disposable-token',
        'disposable-password',
        'private-name',
        'private-query',
        'user:pass',
        'must-not-be-stored',
    ])
        assert.ok(!JSON.stringify(errors).includes(sensitive));
    assert.equal((await call('/api/v1/admin/lua-errors?q=Missing', { cookie: operatorLogin.cookie })).data.total, 1);
    assert.equal((await call(`/api/v1/admin/lua-errors?userId=${userId}`, { cookie })).data.total, 1);
    assert.equal((await call('/api/v1/admin/lua-errors?gameVersion=26', { cookie })).data.total, 0);
    await call('/api/v1/admin/lua-errors?gameVersion=23', { cookie, status: 400 });
    await call('/api/v1/admin/lua-errors?limit=1000', { cookie, status: 400 });
    await query(`INSERT INTO lua_error_report(user_id,report_day,fingerprint,game_version,script_version,editor_version,stage,message,traceback)
        SELECT user_id,date('now','-40 days'),'expired-fixture',game_version,script_version,editor_version,stage,message,traceback FROM lua_error_report LIMIT 1;`);
    assert.equal((await call('/api/v1/admin/lua-errors', { cookie })).data.total, 1, 'Expired groups hidden');
    await call('/api/v1/lua/errors', { key: secret, body: diagnostic });
    assert.equal(
        (await query("SELECT count(*) AS count FROM lua_error_report WHERE fingerprint='expired-fixture'"))[0]
            .results[0].count,
        0,
    );
    const snapshot = [
        {
            playerID: 1,
            playerName: 'Independent Test Player',
            currentDate: '2026-1-2',
            preferredposition1: 25,
            birthdate: 155000,
            overallrating: 70,
            potential: 90,
            skillmoves: 2,
            weakfootabilitytypecode: 3,
        },
    ];
    await call('/api/v1/player/bulk?gameVersion=25', { key: secret, body: snapshot });
    snapshot[0].currentDate = '2026-1-9';
    snapshot[0].overallrating = 71;
    await call('/api/v1/player/bulk?gameVersion=25', { key: secret, body: snapshot });
    await call('/api/v1/player/bulk?gameVersion=24', { key: secret, body: snapshot });
    await call('/api/v1/player/bulk?gameVersion=25', {
        key: secret,
        body: [{ ...snapshot[0], currentDate: '2025-1-1' }],
        status: 409,
    });
    const growth = (await call('/api/v1/admin/growth', { cookie })).data;
    assert.equal(growth.funnel.activated, 1);
    assert.equal(growth.funnel.repeatUsers, 1);
    assert.equal(growth.versions[0].successes, 3);
    assert.equal(growth.versions[0].failures, 1);
    assert.ok(growth.funnel.averageSeconds >= 0);
    const players = (await call(`/api/v1/admin/players?userId=${userId}&gameVersion=25`, { cookie })).data;
    assert.equal(players.total, 1);
    assert.equal((await call(`/api/v1/admin/players/${players.items[0].id}`, { cookie })).data.historyTotal, 2);
    await call('/api/v1/admin/players?gameVersion=23', { cookie, status: 400 });
    assert.equal((await call(`/api/v1/admin/users/${userId}`, { cookie })).data.snapshots, 3);
    const socket = new WebSocket(base.replace('http', 'ws') + '/ws', userToken);
    await new Promise((resolve, reject) => {
        socket.once('open', resolve);
        socket.once('error', reject);
    });
    const closed = new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('Socket not revoked')), 5000);
        socket.on('message', (m) => {
            if (m.toString() === 'Session changed') {
                clearTimeout(timer);
                socket.terminate();
                resolve();
            }
        });
    });
    await call(`/api/v1/admin/users/${userId}/status`, { cookie, body: { disabled: true } });
    await closed;
    await call('/api/v1/user/info', { token: userToken, status: 401 });
    await call('/api/v1/player/bulk?gameVersion=25', { key: secret, body: snapshot, status: 401 });
    await call('/api/v1/lua/errors', { key: secret, body: diagnostic, status: 401 });
    await call('/api/v1/admin/me', { cookie: operatorLogin.cookie });
    await call(`/api/v1/admin/users/${userId}/status`, { cookie, body: { disabled: false } });
    userToken = (await call('/api/v1/user/login', { body: { email: 'player@example.test', password: userPassword } }))
        .data.token;
    await call(`/api/v1/admin/users/${userId}/revoke-session`, { cookie, body: {} });
    await call('/api/v1/user/info', { token: userToken, status: 401 });
    await call('/api/v1/admin/me', { cookie });
    userToken = (await call('/api/v1/user/login', { body: { email: 'player@example.test', password: userPassword } }))
        .data.token;
    await call(`/api/v1/admin/users/${userId}/rotate-key`, { cookie, body: {} });
    await call('/api/v1/player/bulk?gameVersion=25', { key: secret, body: snapshot, status: 401 });
    const newSecret = (await call('/api/v1/user/secret', { token: userToken })).data.secretKey;
    assert.notEqual(newSecret, secret);
    await call('/api/v1/lua/errors', { key: secret, body: diagnostic, status: 401 });
    await call('/api/v1/lua/errors', { key: newSecret, body: { ...diagnostic, message: 'After key rotation' } });
    await call(`/api/v1/admin/administrators/${operator.id}/status`, { cookie, body: { disabled: true } });
    await call('/api/v1/admin/me', { cookie: operatorLogin.cookie, status: 401 });
    await call('/api/v1/user/info', { token: userToken });
    await call('/api/v1/admin/password', {
        cookie,
        body: {
            currentPassword: password,
            newPassword: 'NextAdminPassword!456',
            confirmPassword: 'NextAdminPassword!456',
        },
    });
    await call('/api/v1/admin/me', { cookie, status: 401 });
    await call('/api/v1/user/info', { token: userToken });
    await call('/api/v1/admin/login', { body: { username: 'admin', password }, status: 401 });
    cookie = (await call('/api/v1/admin/login', { body: { username: 'admin', password: 'NextAdminPassword!456' } }))
        .cookie;
    await call('/api/v1/user/register', {
        body: { email: 'admin@example.test', password: userPassword, confirmPassword: userPassword },
    });
    const customer = (
        await call('/api/v1/user/login', { body: { email: 'admin@example.test', password: userPassword } })
    ).data;
    const rateKey = (await call('/api/v1/user/secret', { token: customer.token })).data.secretKey;
    for (let i = 0; i < 20; i++)
        await call('/api/v1/lua/errors', { key: rateKey, body: { ...diagnostic, message: 'Rate limit fixture' } });
    await call('/api/v1/lua/errors', { key: rateKey, body: diagnostic, status: 429 });
    const changedIp = await fetch(base + '/api/v1/lua/errors', {
        method: 'POST',
        headers: { 'secret-key': rateKey, 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.240' },
        body: JSON.stringify(diagnostic),
    });
    assert.equal(changedIp.status, 429, 'Customer quota survives IP changes');
    await call('/api/v1/admin/users', { token: customer.token, status: 401 });
    await call('/api/v1/admin/me', { cookie });
    const audit = (await call('/api/v1/admin/audit', { cookie })).data.items;
    assert.ok(audit.some((a) => a.action === 'change-admin-password'));
    assert.ok(audit.every((a) => 'actor_username' in a && !('actor_email' in a)));
    assert.ok(!JSON.stringify(audit).includes(newSecret));
    await call('/api/v1/admin/logout', { cookie, body: {} });
    await call('/api/v1/admin/me', { cookie, status: 401 });
    await call('/api/v1/user/info', { token: userToken });
    // Current migrations and management code must preserve the existing customer API.
    await new Promise((resolve, reject) => {
        const child = spawn(process.execPath, [join(backend, 'tests/worker.integration.mjs')], {
            cwd: backend,
            env: { ...env, TEST_API_URL: base },
            stdio: 'inherit',
        });
        child.on('error', reject);
        child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error('Customer regression failed'))));
    });
    // Real Admin Worker -> service binding -> API -> D1; browser-facing same-origin cookies.
    const adminConfig = JSON.parse(readFileSync(join(backend, '../admin/wrangler.jsonc'), 'utf8'));
    adminConfig.name = 'fc-career-top-admin-test-ui';
    adminConfig.main = join(backend, '../admin/worker/index.ts');
    adminConfig.assets.directory = join(backend, '../admin/dist');
    delete adminConfig.routes;
    delete adminConfig.account_id;
    adminConfig.services[0].service = config.name;
    const adminFile = join(directory, 'admin.json');
    writeFileSync(adminFile, JSON.stringify(adminConfig));
    const uiBase = `http://localhost:${port + 1}`;
    const adminServer = serve(['--config', adminFile, '--port', String(port + 1), '--inspector-port', '9240']);
    await ready(uiBase, adminServer);
    const ui = await fetch(uiBase + '/api/v1/admin/login', {
        method: 'POST',
        headers: { Origin: uiBase, 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'NextAdminPassword!456' }),
    });
    assert.equal(ui.status, 200);
    const uiCookie = ui.headers.get('Set-Cookie').split(';')[0];
    assert.ok((await ui.json()).success);
    const uiMe = await fetch(uiBase + '/api/v1/admin/me', { headers: { Cookie: uiCookie } });
    assert.equal(uiMe.status, 200);
    assert.equal((await uiMe.json()).data.username, 'admin');
    const uiErrors = await fetch(uiBase + '/api/v1/admin/lua-errors', { headers: { Cookie: uiCookie } });
    assert.equal(uiErrors.status, 200);
    assert.ok((await uiErrors.json()).data.total >= 1);
    const blocked = await fetch(uiBase + '/api/v1/admin/login', {
        method: 'POST',
        headers: { Origin: 'https://app.fccareer.top', 'Content-Type': 'application/json' },
        body: '{}',
    });
    assert.equal(blocked.status, 403);
    assert.equal((await fetch(uiBase + '/api/v1/user/info')).status, 404);
    console.log(
        'PASS: legacy migrations, independent admin auth/service binding, permissions, Lua diagnostic authentication/redaction/grouping/retention/rate limiting, and customer regression.',
    );
    if (process.argv.includes('--serve')) {
        console.log(`Disposable API ${base}; preview admin: admin / NextAdminPassword!456`);
        await new Promise((resolve) => {
            process.once('SIGINT', resolve);
            process.once('SIGTERM', resolve);
        });
    }
} finally {
    for (const child of processes) {
        try {
            process.kill(-child.pid, 'SIGTERM');
        } catch {}
    }
    await new Promise((r) => setTimeout(r, 300));
    rmSync(directory, { recursive: true, force: true });
}
