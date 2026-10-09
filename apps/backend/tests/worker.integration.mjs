import assert from 'node:assert/strict';
import WebSocket from 'ws';

const base = process.env.TEST_API_URL || 'http://localhost:8888';
const suffix = Date.now().toString(36);
const username = `test_${suffix}`;
const password = 'WorkerTest!123';

async function call(path, { token, key, body, status = 200, headers = {} } = {}) {
    const response = await fetch(`${base}${path}`, {
        method: body === undefined ? 'GET' : 'POST',
        headers: {
            ...headers,
            ...(token ? { token } : {}),
            ...(key ? { 'secret-key': key } : {}),
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    const text = await response.text();
    assert.equal(response.status, status, `${path}: ${text}`);
    return text === 'ok' ? text : JSON.parse(text);
}

assert.equal(await call('/api/health_check'), 'ok');
await call('/api/v1/user/info', { status: 401 });
const registered = await call('/api/v1/user/register', {
    body: { email: `${username}@example.test`, password, confirmPassword: password },
});
assert.match(registered.data.username, new RegExp(`^${username}[a-z0-9]{4}$`));
assert.equal(
    (
        await call('/api/v1/user/register', {
            body: {
                email: `${username}@example.test`,
                password,
                confirmPassword: password,
            },
        })
    ).success,
    false,
);
assert.equal((await call('/api/v1/user/login', { body: { username: 'mail@example.test', password } })).success, false);
await call('/api/v1/user/register', {
    body: { email: '', password, confirmPassword: password },
    status: 400,
});
assert.equal(
    (
        await call('/api/v1/user/register', {
            body: {
                email: `${username.toUpperCase()}@EXAMPLE.TEST`,
                password,
                confirmPassword: password,
            },
        })
    ).success,
    false,
);
const login = await call('/api/v1/user/login', {
    body: { email: ` ${username.toUpperCase()}@EXAMPLE.TEST `, password },
});
assert.equal(login.success, true);
const token = login.data.token;
assert.equal((await call('/api/v1/user/info', { token })).data.authMode, 'email_password');
await call('/api/v1/user/email/verify', { token, body: {}, status: 410 });
const secret = (await call('/api/v1/user/secret', { token })).data.secretKey;
assert.equal((await call('/api/v1/user/setting', { token })).data.defaultGameVersion, 25);

const socket = new WebSocket(base.replace(/^http/, 'ws') + '/ws', token);
const packets = [];
socket.addEventListener('message', (event) => {
    if (event.data === 'Session changed') socket.close(1000, 'Session changed');
    if (event.data.startsWith('{')) packets.push(JSON.parse(event.data));
});
await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('WebSocket open timeout')), 10000);
    socket.addEventListener(
        'open',
        () => {
            clearTimeout(timeout);
            resolve();
        },
        { once: true },
    );
    socket.addEventListener('error', reject, { once: true });
});
const snapshot = Array.from({ length: 200 }, (_, n) => ({
    playerID: n + 1,
    playerName: n === 0 ? "O'Connor" : `Player ${n}`,
    currentDate: '2026-1-2',
    preferredposition1: 25,
    birthdate: 155000,
    overallrating: 70,
    potential: 90,
    skillmoves: 2,
    weakfootabilitytypecode: 3,
}));
await call('/api/v1/player/bulk?gameVersion=25', { key: secret, body: snapshot });
assert.equal(await call('/api/v1/player/count?gameVersion=25', { token }), 200);
assert.equal((await call('/api/v1/player/?gameVersion=25', { token }))[0].playerName, "O'Connor");
assert.equal((await call('/api/v1/player/trends?gameVersion=25', { token }))[0].trends.length, 1);
snapshot[0].currentDate = '2026-1-9';
snapshot[0].overallrating = 71;
await call('/api/v1/player/bulk?gameVersion=25', { key: secret, body: [snapshot[0]] });
await new Promise((resolve) => setTimeout(resolve, 100));
assert.equal(packets[0]?.type, 'PlayerUpdate.Overall');
assert.equal(packets[0].payload.gameVersion, 25);
assert.equal(await call('/api/v1/player/count?gameVersion=25', { token }), 1);
assert.equal((await call('/api/v1/player/detail/1?gameVersion=25', { token })).trends.length, 2);
assert.equal((await call('/api/v1/notification/unread-count?gameVersion=25', { token })).count, 1);
const list = await call('/api/v1/notification/?gameVersion=25&page=1&limit=10&filter=all&onlyUnread=true', { token });
assert.equal(list.items[0].player_name, "O'Connor");
await call('/api/v1/notification/mark-read', { token, body: { id: list.items[0].id, gameVersion: 25 } });
assert.equal((await call('/api/v1/notification/unread-count?gameVersion=25', { token })).count, 0);
await call('/api/v1/player/bulk?gameVersion=25', {
    key: secret,
    body: [{ ...snapshot[0], currentDate: '2025-1-1' }],
    status: 409,
});
await call('/api/v1/player/bulk?gameVersion=25', { key: 'wrong-key', body: snapshot, status: 401 });

const secondUser = `other_${suffix}`;
await call('/api/v1/user/register', {
    body: { email: `${secondUser}@example.test`, password, confirmPassword: password },
});
const otherToken = (await call('/api/v1/user/login', { body: { email: `${secondUser}@example.test`, password } })).data
    .token;
assert.equal(await call('/api/v1/player/count?gameVersion=25', { token: otherToken }), 0);
assert.equal((await call('/api/v1/notification/unread-count?gameVersion=25', { token: otherToken })).count, 0);
await call('/api/v1/user/info', { token, headers: { Origin: 'https://untrusted.example' }, status: 403 });
const newSecret = (await call('/api/v1/user/secret/refresh', { token, body: {} })).data.secretKey;
assert.notEqual(newSecret, secret);
await call('/api/v1/player/bulk?gameVersion=25', { key: secret, body: [snapshot[0]], status: 401 });
await call('/api/v1/player/bulk?gameVersion=24', { key: newSecret, body: [snapshot[0]] });
assert.equal(await call('/api/v1/player/count?gameVersion=24', { token }), 1);
const nextPassword = 'WorkerNext!456';
await call('/api/v1/user/password', {
    token: otherToken,
    body: { oldPassword: password, newPassword: nextPassword, confirmNewPassword: nextPassword },
});
await call('/api/v1/user/info', { token: otherToken, status: 401 });
assert.equal(
    (await call('/api/v1/user/login', { body: { email: `${secondUser}@example.test`, password } })).success,
    false,
);
assert.equal(
    (await call('/api/v1/user/login', { body: { email: `${secondUser}@example.test`, password: nextPassword } }))
        .success,
    true,
);
const tabSocket = new WebSocket(base.replace(/^http/, 'ws') + '/ws', token);
tabSocket.addEventListener('message', (event) => {
    if (event.data === 'Session changed') tabSocket.close(1000, 'Session changed');
});
await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Second WebSocket open timeout')), 10000);
    tabSocket.addEventListener(
        'open',
        () => {
            clearTimeout(timeout);
            resolve();
        },
        { once: true },
    );
    tabSocket.addEventListener('error', reject, { once: true });
});
assert.equal(socket.readyState, WebSocket.OPEN);
const closed = [socket, tabSocket].map(
    (ws) =>
        new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Logout did not invalidate WebSocket session')), 10000);
            ws.addEventListener('message', (e) => {
                if (e.data === 'Session changed') {
                    clearTimeout(timeout);
                    resolve();
                }
            });
        }),
);
await call('/api/v1/user/logout', { token, body: {} });
await Promise.all(closed);
await call('/api/v1/user/info', { token, status: 401 });
for (const ws of [socket, tabSocket]) ws.terminate();
console.log(
    'PASS: email/password auth without verification, 200-player batched upload, FC24/25 isolation, trends, notifications, WebSocket, key rotation, account isolation, password/session invalidation, multi-tab session invalidation and logout.',
);
