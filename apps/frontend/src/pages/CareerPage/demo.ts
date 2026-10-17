import type { Summary, HistoryPoint } from '../../service/CareerApis';
const names = [
  'Alex Reed',
  'Noah Silva',
  'Leo Park',
  'Oscar North',
  'Kai Laurent',
  'Milo Hart',
];
const histories: Record<number, HistoryPoint[]> = {};
export function demoHistory(id: number) {
  return histories[id] || [];
}
export function demoSummary(period: string): Summary {
  const dates = [
    '2026-07-01',
    '2026-09-25',
    '2026-10-02',
    '2026-10-09',
    '2026-10-16',
  ];
  const players = names.map((name, i) => {
    const playerID = 990000 + i,
      base = 65 + i * 3;
    histories[playerID] = dates.map((inGameDate, n) => ({
      inGameDate,
      overallRating: base + n,
      potential: 86 + i + (n > 2 ? 1 : 0),
      attributes: {
        overallrating: base + n,
        potential: 86 + i + (n > 2 ? 1 : 0),
        acceleration: 72 + i + n,
        finishing: 60 + i * 2 + n,
        shortpassing: 68 + i + n,
        dribbling: 70 + i + n,
        standingtackle: 40 + i + n,
        stamina: 65 + i + n,
        preferredposition1: 25 - i * 3,
        skillmoves: 2,
        weakfootabilitytypecode: 3,
        play_styles: n > 2 ? '["Technical"]' : '[]',
      },
    }));
    const first = histories[playerID][period === 'month' ? 1 : 0],
      last = histories[playerID][4];
    return {
      playerID,
      playerName: name,
      overallRating: last.overallRating,
      potential: last.potential,
      age: 18 + i,
      position1: ['ST', 'RW', 'CAM', 'CM', 'CB', 'GK'][i],
      position2: '',
      position3: '',
      position4: '',
      positionType: ['FOR', 'FOR', 'MID', 'MID', 'DEF', 'GK'][i] as
        | 'FOR'
        | 'MID'
        | 'DEF'
        | 'GK',
      archived: i === 5,
      watched: i === 0,
      baselineDate: first.inGameDate,
      observedOn: last.inGameDate,
      overallChange: last.overallRating - first.overallRating,
      potentialChange: last.potential - first.potential,
      attributes: last.attributes!,
    };
  });
  return {
    career: {
      id: 0,
      name: 'Northbridge Academy',
      game_version: 27,
      is_legacy: 0,
      is_archived: 0,
      last_upload: '2026-10-16 12:00:00',
      last_game_date: '2026-10-16',
      player_count: 5,
      script_version: '2026.10.17.1',
      editor_version: 'Demo',
      last_attempt: null,
      last_error: null,
    },
    period,
    start:
      period === 'month'
        ? '2026-09-16'
        : period === 'season'
          ? '2026-07-01'
          : null,
    end: '2026-10-16',
    players,
  };
}
