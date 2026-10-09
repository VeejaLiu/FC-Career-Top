import type { PlayerOverall } from '../service/PlayerApis';

const positionOrder = { GK: 1, DEF: 2, MID: 3, FOR: 4 };
export function comparePlayerPosition(a: PlayerOverall, b: PlayerOverall) {
  return (
    positionOrder[a.positionType] - positionOrder[b.positionType] ||
    a.position1.localeCompare(b.position1) ||
    a.playerName.localeCompare(b.playerName)
  );
}
