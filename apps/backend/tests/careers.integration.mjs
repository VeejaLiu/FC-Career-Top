import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
const base = process.env.TEST_API_URL || 'http://localhost:8891';
if (!['localhost', '127.0.0.1'].includes(new URL(base).hostname)) throw new Error('Use a disposable local database');
const password = 'CareerTest!2026',
    suffix = Date.now().toString(36),
    email = `career_${suffix}@example.test`;
async function call(path, { token, key, body, status = 200 } = {}) {
    const response = await fetch(base + path, {
        method: body === undefined ? 'GET' : 'POST',
        headers: {
            'Content-Type': 'application/json',
            'CF-Connecting-IP': `192.0.2.${(Date.now() % 200) + 1}`,
            ...(token ? { token } : {}),
            ...(key ? { 'secret-key': key } : {}),
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    const result = await response.json();
    assert.equal(response.status, status, `${path}: ${JSON.stringify(result)}`);
    return result;
}
await call('/api/v1/user/register', { body: { email, password, confirmPassword: password } });
const {
    data: { token },
} = await call('/api/v1/user/login', { body: { email, password } });
const {
    data: { secretKey: key },
} = await call('/api/v1/user/secret', { token });
const legacy = (await call('/api/v1/careers?gameVersion=27', { token }))[0];
assert.equal(legacy.is_legacy, 1);
assert.equal(legacy.last_upload, null);
const a = await call('/api/v1/careers?gameVersion=27', { token, body: { name: 'Academy A' } });
const b = await call('/api/v1/careers?gameVersion=27', { token, body: { name: 'Academy B' } });
const upload = (id, body, status = 200) =>
    call(`/api/v1/player/bulk?gameVersion=27${id ? `&careerId=${id}` : ''}&scriptVersion=2026.10.17.1`, {
        key,
        body,
        status,
    });
const player = (id, date, ovr, extra = {}) => ({
    playerID: id,
    playerName: `Prospect ${id}`,
    currentDate: date,
    overallrating: ovr,
    potential: 90,
    preferredposition1: 25,
    acceleration: 70,
    finishing: 60,
    skillmoves: 2,
    weakfootabilitytypecode: 3,
    playerStyles: ['Technical'],
    ...extra,
});
await upload(a.id, [player(1, '2026-07-01', 65), player(2, '2026-07-01', 70)]);
await upload(a.id, [player(1, '2026-09-20', 68), player(2, '2026-09-20', 70)]);
await upload(a.id, [
    player(1, '2026-10-17', 71, {
        acceleration: 77,
        finishing: 66,
        preferredposition1: 23,
        playerStyles: ['Technical', 'Rapid'],
    }),
]);
await upload(b.id, [player(1, '2025-01-01', 40)]);
await upload(null, [player(3, '2026-10-17', 80)]);
const list = (id) => call(`/api/v1/player?gameVersion=27&careerId=${id}`, { token });
assert.equal((await list(a.id))[0].overallRating, 71);
assert.equal((await list(b.id))[0].overallRating, 40);
assert.equal(
    (await call('/api/v1/player?gameVersion=27', { token }))[0].playerID,
    3,
    'Old clients stay on the legacy career',
);
const summary = await call(`/api/v1/careers/${a.id}/summary?gameVersion=27&period=month`, { token });
assert.equal(summary.start, '2026-09-17');
assert.equal(summary.players[0].overallChange, 3, 'Baseline is the first observation within the period');
assert.ok(summary.players.find((p) => p.playerID === 2).archived);
assert.equal(
    (await call(`/api/v1/careers/${a.id}/summary?gameVersion=27&period=season`, { token })).players[0].overallChange,
    6,
);
await call(`/api/v1/careers/${a.id}/summary?gameVersion=27&period=bad`, { token, status: 400 });
let detail = await call(`/api/v1/player/detail/1?gameVersion=27&careerId=${a.id}`, { token });
assert.equal(detail.history.length, 3);
assert.equal(detail.history[0].attributes.acceleration, 70);
assert.equal(detail.history[2].attributes.acceleration, 77);
assert.equal(detail.history[2].attributes.finishing, 66);
assert.equal(detail.history[2].attributes.preferredposition1, 23);
assert.notEqual(detail.history[0].attributes.play_styles, detail.history[2].attributes.play_styles);
assert.equal(await call(`/api/v1/player/detail/2?gameVersion=27&careerId=${a.id}`, { token }), null);
assert.equal(
    (await call(`/api/v1/player/detail/2?gameVersion=27&careerId=${a.id}&includeArchived=true`, { token })).history
        .length,
    2,
);
const notifications = await call(`/api/v1/notification?gameVersion=27&careerId=${a.id}`, { token });
assert.ok(notifications.total > 0);
await call('/api/v1/notification/mark-all-read', { token, body: { gameVersion: 27, careerId: b.id } });
assert.equal(
    (await call(`/api/v1/notification/unread-count?gameVersion=27&careerId=${a.id}`, { token })).count,
    notifications.total,
);
const older = await upload(a.id, [player(1, '2026-01-01', 20)], 409);
assert.equal(older.code, 'OLDER_SNAPSHOT');
let state = (await call('/api/v1/careers?gameVersion=27', { token })).find((c) => c.id === a.id);
assert.equal(state.last_game_date, '2026-10-17');
assert.ok(state.last_error);
assert.equal(state.player_count, 1);
assert.equal((await list(a.id))[0].overallRating, 71, 'Rejected dates cannot overwrite current data');
await call(`/api/v1/careers/${a.id}?gameVersion=27`, { token, body: { archived: true } });
assert.equal((await upload(a.id, [player(1, '2026-10-24', 72)], 409)).code, 'CAREER_ARCHIVED');
assert.equal((await list(a.id)).length, 1, 'Archived careers retain data');
await call(`/api/v1/careers/${a.id}?gameVersion=27`, { token, body: { archived: false } });
await call(`/api/v1/careers/${a.id}?gameVersion=27`, { token, body: { name: 'Renamed Academy' } });
await upload(a.id, [player(1, '2026-10-24', 72)]);
state = (await call('/api/v1/careers?gameVersion=27', { token })).find((c) => c.id === a.id);
assert.equal(state.name, 'Renamed Academy');
assert.equal(state.last_error, null);
assert.equal(state.script_version, '2026.10.17.1');
await call(`/api/v1/careers/${a.id}/watch?gameVersion=27`, { token, body: { playerId: 1, watched: true } });
assert.equal((await call(`/api/v1/careers/${a.id}/summary?gameVersion=27`, { token })).players[0].watched, true);
assert.equal((await call(`/api/v1/careers/${b.id}/summary?gameVersion=27`, { token })).players[0].watched, false);
await call(`/api/v1/careers/${a.id}/watch?gameVersion=27`, {
    token,
    body: { playerId: 999, watched: true },
    status: 404,
});
await call(`/api/v1/careers/${a.id}?gameVersion=26`, { token, body: { name: 'Cross version' }, status: 404 });
await call('/api/v1/careers?gameVersion=27', { token, body: { name: ' ' }, status: 400 });
await call('/api/v1/careers?gameVersion=27', { status: 401 });
const otherEmail = `other_career_${suffix}@example.test`;
await call('/api/v1/user/register', { body: { email: otherEmail, password, confirmPassword: password } });
const otherToken = (await call('/api/v1/user/login', { body: { email: otherEmail, password } })).data.token;
for (const path of [
    `/api/v1/careers/${a.id}/summary?gameVersion=27`,
    `/api/v1/player?gameVersion=27&careerId=${a.id}`,
    `/api/v1/notification?gameVersion=27&careerId=${a.id}`,
])
    await call(path, { token: otherToken, status: 404 });
await call(`/api/v1/careers/${a.id}?gameVersion=27`, { token: otherToken, body: { archived: true }, status: 404 });
await call('/api/v1/lua/errors', {
    key,
    body: {
        gameVersion: 27,
        careerId: a.id,
        scriptVersion: '2026.10.17.1',
        editorVersion: 'test',
        stage: 'snapshot.collect',
        message: 'Fixture collection error',
        traceback: 'test',
    },
});
assert.match(
    (await call('/api/v1/careers?gameVersion=27', { token })).find((c) => c.id === a.id).last_error,
    /snapshot.collect/,
);
assert.equal((await call('/api/v1/careers?gameVersion=27', { token })).find((c) => c.id === b.id).last_error, null);
await upload(a.id, [player(1, '2026-10-24', 72)]);
await call('/api/v1/careers?gameVersion=27', { token, body: null, status: 400 });
await call(`/api/v1/careers/${a.id}/watch?gameVersion=27`, { token, body: [], status: 400 });
await upload(b.id, [player(1, '2025-01-08', 38, { playerStyles: null })]);
assert.equal((await call(`/api/v1/careers/${b.id}/summary?gameVersion=27`, { token })).players[0].overallChange, -2);
const unknownStyle = await call(`/api/v1/player/detail/1?gameVersion=27&careerId=${b.id}`, { token });
assert.equal(unknownStyle.history.at(-1).attributes.play_styles, null, 'Missing styles remain unobserved in history');
assert.deepEqual(unknownStyle.thisPlayer.playStylesList, ['Technical'], 'Current last-known styles remain compatible');
await call('/api/v1/user/setting', { token, body: { category: 'default_game_version', value: 27 } });
if (process.env.TEST_SESSION_FILE)
    writeFileSync(
        process.env.TEST_SESSION_FILE,
        JSON.stringify({ email, password, token, key, career: a.id, userId: state.user_id }),
        { mode: 0o600 },
    );
console.log(
    'PASS: legacy compatibility, same-player multi-career isolation, cross-account/version access, date regression, archive/restore/rename, detailed attribute/position/PlayStyle history, departed players, period baselines, watchlists, sync state and notification isolation.',
);
