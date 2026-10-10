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
    if (![24, 25, 26, 27].includes(n)) throw new Error('Game version must be 24, 25, 26 or 27');
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
        position5: p.preferredposition5 == null ? undefined : positions[Number(p.preferredposition5)],
        position6: p.preferredposition6 == null ? undefined : positions[Number(p.preferredposition6)],
        position7: p.preferredposition7 == null ? undefined : positions[Number(p.preferredposition7)],
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

type ProfileJSON = null | boolean | number | string | ProfileJSON[] | { [key: string]: ProfileJSON };

function profileJSON(value: unknown, depth = 0): ProfileJSON {
    if (depth > 5) throw new Error('Player profile is too deeply nested');
    if (value === null || typeof value === 'boolean') return value;
    if (typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= Number.MAX_SAFE_INTEGER)
        return value;
    if (typeof value === 'string' && value.length <= 4096) return value;
    if (Array.isArray(value) && value.length <= 256) return value.map((item) => profileJSON(item, depth + 1));
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const entries = Object.entries(value);
        if (entries.length > 512) throw new Error('Too many player profile fields');
        return Object.fromEntries(entries.map(([key, entry]) => {
            if (!/^[a-zA-Z0-9_]{1,100}$/.test(key) || ['__proto__', 'constructor', 'prototype'].includes(key))
                throw new Error('Invalid player profile field');
            return [key, profileJSON(entry, depth + 1)];
        }));
    }
    throw new Error('Invalid player profile value');
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
                'player_profile',
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
        value.play_styles = JSON.stringify([...new Set<string>(styles)].sort());
    }
    if (input.profileData != null) {
        const profileInput = input.profileData;
        const record = (value: unknown) => typeof value === 'object' && value !== null && !Array.isArray(value);
        const records = (value: unknown) => Array.isArray(value) && value.every(record);
        const strings = (value: unknown) => Array.isArray(value) && value.every((entry) => typeof entry === 'string');
        if (typeof input.profileData !== 'object' || Array.isArray(input.profileData)
            || input.profileData.schemaVersion !== 1 || input.profileData.gameVersion !== version
            || input.profileData.observedOn !== input.currentDate
            || typeof input.profileData.player !== 'object' || input.profileData.player === null
            || Array.isArray(input.profileData.player)
            || typeof input.profileData.availability !== 'object' || input.profileData.availability === null
            || Array.isArray(input.profileData.availability))
            throw new Error('Invalid player profile identity');
        if (typeof profileInput.liveEditorVersion !== 'string'
            || (profileInput.related != null && (!record(profileInput.related) || !Object.values(profileInput.related).every(records)))
            || (profileInput.seasonStats != null && !records(profileInput.seasonStats))
            || (profileInput.traits != null && !strings(profileInput.traits))
            || (profileInput.unreadableFields != null && !strings(profileInput.unreadableFields)))
            throw new Error('Invalid player profile structure');
        const profile = JSON.stringify(profileJSON(input.profileData));
        if (new TextEncoder().encode(profile).length > 128 * 1024) throw new Error('Player profile exceeds 128 KB');
        value.player_profile = profile;
    }
    const [y, m, d] = inGameDate.split('-').map(Number);
    value.age =
        value.birthdate == null
            ? null
            : Math.floor((new DateUtils(y, m, d).toGregorianDays() - value.birthdate) / 365.25);
    return value;
}
