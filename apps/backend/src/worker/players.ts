import { DateUtils } from '../utils/Date';

export type Row = Record<string, any>;
export const positions = [
    'GK',
    'SW',
    'RWB',
    'RB',
    'RCB',
    'CB',
    'LCB',
    'LB',
    'LWB',
    'RDM',
    'CDM',
    'LDM',
    'RM',
    'RCM',
    'CM',
    'LCM',
    'LM',
    'RAM',
    'CAM',
    'LAM',
    'RF',
    'CF',
    'LF',
    'RW',
    'RS',
    'ST',
    'LS',
    'LW',
];
export function positionType(value: unknown) {
    const n = Number(value);
    return n === 0 ? 'GK' : n < 9 ? 'DEF' : n < 20 ? 'MID' : 'FOR';
}
export function game(value: unknown): number {
    const n = Number(value);
    if (n !== 24 && n !== 25) throw new Error('Game version must be 24 or 25');
    return n;
}
export function date(value: unknown): string {
    if (typeof value !== 'string' || !/^\d{4}-\d{1,2}-\d{1,2}$/.test(value)) throw new Error('Invalid in-game date');
    const [y, m, d] = value.split('-').map(Number);
    const parsed = new Date(Date.UTC(y, m - 1, d));
    if (parsed.getUTCFullYear() !== y || parsed.getUTCMonth() !== m - 1 || parsed.getUTCDate() !== d)
        throw new Error('Invalid in-game date');
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export function squad(rows: Row[]) {
    const result = rows.map((p) => ({
        playerID: p.player_id,
        playerName: p.player_name,
        overallRating: p.overallrating,
        potential: p.potential,
        age: p.age,
        positionType: positionType(p.preferredposition1),
        position1: positions[Number(p.preferredposition1)],
        position2: positions[Number(p.preferredposition2)],
        position3: positions[Number(p.preferredposition3)],
        position4: positions[Number(p.preferredposition4)],
        skillMoves: p.skillmoves,
        weakFootAbilityTypeCode: p.weakfootabilitytypecode,
        overallRanking: 0,
        potentialRanking: 0,
    }));
    for (const p of result) {
        const peers = result.filter((v) => v.position1 === p.position1);
        p.overallRanking = 1 + peers.filter((v) => v.overallRating > p.overallRating).length;
        p.potentialRanking = 1 + peers.filter((v) => v.potential > p.potential).length;
    }
    return result;
}

export function trend(row: Row) {
    return { inGameDate: row.in_game_date, overallRating: row.overallrating, potential: row.potential };
}

export function normalize(input: Row, fields: string[], userId: number, version: number): Row {
    const id = Number(input.playerID);
    if (!Number.isSafeInteger(id) || id <= 0 || typeof input.playerName !== 'string' || input.playerName.length > 256)
        throw new Error('Invalid player identity');
    const inGameDate = date(input.currentDate);
    const value: Row = {
        user_id: userId,
        game_version: version,
        player_id: id,
        player_name: input.playerName,
        in_game_date: inGameDate,
    };
    for (const name of fields) {
        if (
            [
                'id',
                'user_id',
                'game_version',
                'player_id',
                'player_name',
                'age',
                'is_deleted',
                'is_archived',
                'create_time',
                'update_time',
                'play_styles',
            ].includes(name)
        )
            continue;
        const raw = input[name];
        if (raw == null || raw === '') value[name] = null;
        else {
            const n = Number(raw);
            if (!Number.isFinite(n) || !Number.isSafeInteger(n)) throw new Error(`Invalid player attribute: ${name}`);
            value[name] = n;
        }
    }
    if (input.playerStyles != null) {
        const styles = typeof input.playerStyles === 'string' ? JSON.parse(input.playerStyles) : input.playerStyles;
        if (
            !Array.isArray(styles) ||
            styles.length > 100 ||
            styles.some((v) => typeof v !== 'string' || v.length > 100)
        )
            throw new Error('Invalid PlayStyles');
        value.play_styles = JSON.stringify(styles);
    } else value.play_styles = '[]';
    const [y, m, d] = inGameDate.split('-').map(Number);
    value.age =
        value.birthdate == null
            ? null
            : Math.floor((new DateUtils(y, m, d).toGregorianDays() - value.birthdate) / 365.25);
    return value;
}
