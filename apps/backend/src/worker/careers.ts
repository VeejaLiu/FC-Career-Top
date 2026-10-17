import { HttpError } from './http';
import { Row, squad } from './players';

export async function resolveCareer(db: D1Database, userId: number, version: number, value: unknown): Promise<Row> {
    if (value == null || value === '') {
        await db
            .prepare(
                "INSERT OR IGNORE INTO career(user_id,game_version,name,is_legacy) VALUES (?,?,'Default career',1)",
            )
            .bind(userId, version)
            .run();
        return (await db
            .prepare('SELECT * FROM career WHERE user_id=? AND game_version=? AND is_legacy=1')
            .bind(userId, version)
            .first<Row>())!;
    }
    const id = Number(value);
    if (!Number.isSafeInteger(id) || id < 1) throw new HttpError(400, 'Invalid career');
    const career = await db
        .prepare('SELECT * FROM career WHERE user_id=? AND game_version=? AND id=?')
        .bind(userId, version, id)
        .first<Row>();
    if (!career) throw new HttpError(404, 'Career not found');
    return career;
}

export const historyFields = [
    'overallrating',
    'potential',
    'skillmoves',
    'weakfootabilitytypecode',
    'preferredposition1',
    'preferredposition2',
    'preferredposition3',
    'preferredposition4',
    'preferredposition5',
    'preferredposition6',
    'preferredposition7',
    'acceleration',
    'sprintspeed',
    'positioning',
    'finishing',
    'shotpower',
    'longshots',
    'volleys',
    'penalties',
    'vision',
    'crossing',
    'freekickaccuracy',
    'shortpassing',
    'longpassing',
    'curve',
    'agility',
    'balance',
    'reactions',
    'ballcontrol',
    'dribbling',
    'composure',
    'interceptions',
    'headingaccuracy',
    'defensiveawareness',
    'standingtackle',
    'slidingtackle',
    'jumping',
    'stamina',
    'strength',
    'aggression',
    'gkdiving',
    'gkhandling',
    'gkkicking',
    'gkpositioning',
    'gkreflexes',
    'play_styles',
];
export function historyDetails(player: Row) {
    return JSON.stringify(Object.fromEntries(historyFields.map((key) => [key, player[key] ?? null])));
}

export async function careerSummary(db: D1Database, userId: number, career: Row, period: string) {
    if (!['month', 'season', 'all'].includes(period)) throw new HttpError(400, 'Invalid period');
    const end = career.last_game_date as string | null;
    let start = end;
    if (end) {
        const anchor = new Date(end + 'T00:00:00Z');
        if (period === 'month') anchor.setUTCDate(anchor.getUTCDate() - 30);
        if (period === 'season') {
            anchor.setUTCFullYear(anchor.getUTCFullYear() - (anchor.getUTCMonth() < 6 ? 1 : 0));
            anchor.setUTCMonth(6, 1);
        }
        start = period === 'all' ? '0001-01-01' : anchor.toISOString().slice(0, 10);
    }
    const players = (
        await db
            .prepare(
                `SELECT p.*,w.player_id IS NOT NULL AS watched,
      (SELECT max(c.in_game_date) FROM player_status_history c WHERE c.user_id=p.user_id AND c.save_id=p.save_id AND c.player_id=p.player_id AND c.is_deleted=0) AS observed_on,
      h.overallrating AS baseline_overall,h.potential AS baseline_potential,h.in_game_date AS baseline_date
      FROM player p LEFT JOIN player_watch w ON w.user_id=p.user_id AND w.save_id=p.save_id AND w.player_id=p.player_id
      LEFT JOIN player_status_history h ON h.id=(SELECT b.id FROM player_status_history b WHERE b.user_id=p.user_id AND b.save_id=p.save_id AND b.player_id=p.player_id AND b.is_deleted=0 AND b.in_game_date>=? ORDER BY b.in_game_date LIMIT 1)
      WHERE p.user_id=? AND p.save_id=? AND p.is_deleted=0 ORDER BY p.is_archived,p.player_name`,
            )
            .bind(start, userId, career.id)
            .all<Row>()
    ).results;
    const overviews = squad(players);
    return {
        career,
        period,
        start: period === 'all' ? null : start,
        end,
        players: players.map((p, i) => ({
            ...overviews[i],
            archived: Boolean(p.is_archived),
            watched: Boolean(p.watched),
            baselineDate: p.baseline_date,
            observedOn: p.observed_on,
            overallChange:
                p.baseline_date &&
                p.baseline_date < p.observed_on &&
                p.overallrating != null &&
                p.baseline_overall != null
                    ? p.overallrating - p.baseline_overall
                    : null,
            potentialChange:
                p.baseline_date &&
                p.baseline_date < p.observed_on &&
                p.potential != null &&
                p.baseline_potential != null
                    ? p.potential - p.baseline_potential
                    : null,
            attributes: JSON.parse(historyDetails(p)),
        })),
    };
}

export async function careerRoutes(
    request: Request,
    db: D1Database,
    userId: number,
    version: number,
    body: () => Promise<Row>,
): Promise<Response> {
    const url = new URL(request.url),
        path = url.pathname.replace(/\/$/, '');
    const reply = (data: unknown) => Response.json(data, { headers: { 'Cache-Control': 'no-store' } });
    if (path === '/api/v1/careers') {
        if (request.method === 'GET') {
            await resolveCareer(db, userId, version, null);
            return reply(
                (
                    await db
                        .prepare(
                            'SELECT * FROM career WHERE user_id=? AND game_version=? ORDER BY is_archived,is_legacy DESC,id',
                        )
                        .bind(userId, version)
                        .all()
                ).results,
            );
        }
        if (request.method === 'POST') {
            const input = await body();
            if (!input || typeof input !== 'object' || Array.isArray(input))
                throw new HttpError(400, 'JSON object is required');
            const name = careerName(input.name);
            const count = await db
                .prepare('SELECT count(*) AS n FROM career WHERE user_id=?')
                .bind(userId)
                .first<{ n: number }>();
            if (count!.n >= 100) throw new HttpError(400, 'Career limit reached');
            return reply(
                await db
                    .prepare('INSERT INTO career(user_id,game_version,name) VALUES (?,?,?) RETURNING *')
                    .bind(userId, version, name)
                    .first(),
            );
        }
    }
    const match = path.match(/^\/api\/v1\/careers\/(\d+)(?:\/(summary|watch))?$/);
    if (!match) throw new HttpError(404, 'Not found');
    const career = await resolveCareer(db, userId, version, match[1]);
    if (match[2] === 'summary' && request.method === 'GET')
        return reply(await careerSummary(db, userId, career, url.searchParams.get('period') || 'month'));
    if (match[2] === 'watch' && request.method === 'POST') {
        const input = await body();
        if (!input || typeof input !== 'object' || Array.isArray(input))
            throw new HttpError(400, 'JSON object is required');
        if (!Number.isSafeInteger(input.playerId) || typeof input.watched !== 'boolean')
            throw new HttpError(400, 'Invalid watch preference');
        if (
            !(await db
                .prepare('SELECT id FROM player WHERE user_id=? AND save_id=? AND player_id=? AND is_deleted=0')
                .bind(userId, career.id, input.playerId)
                .first())
        )
            throw new HttpError(404, 'Player not found');
        await db
            .prepare(
                input.watched
                    ? 'INSERT OR IGNORE INTO player_watch(user_id,save_id,player_id) VALUES (?,?,?)'
                    : 'DELETE FROM player_watch WHERE user_id=? AND save_id=? AND player_id=?',
            )
            .bind(userId, career.id, input.playerId)
            .run();
        return reply({ success: true });
    }
    if (!match[2] && request.method === 'POST') {
        const input = await body();
        if (!input || typeof input !== 'object' || Array.isArray(input))
            throw new HttpError(400, 'JSON object is required');
        if (input.name !== undefined)
            await db
                .prepare('UPDATE career SET name=? WHERE user_id=? AND id=?')
                .bind(careerName(input.name), userId, career.id)
                .run();
        else if (typeof input.archived === 'boolean')
            await db
                .prepare('UPDATE career SET is_archived=? WHERE user_id=? AND id=?')
                .bind(Number(input.archived), userId, career.id)
                .run();
        else throw new HttpError(400, 'Invalid career update');
        return reply({ success: true });
    }
    throw new HttpError(405, 'Method not allowed');
}
function careerName(value: unknown): string {
    if (typeof value !== 'string' || !value.trim() || value.trim().length > 80)
        throw new HttpError(400, 'Career name must contain 1-80 characters');
    return value.trim();
}
