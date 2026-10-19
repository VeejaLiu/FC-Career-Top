import type { CareerPlayer } from '../../service/CareerApis';
export function PlayerIdentity({ player }: { player: CareerPlayer }) {
  return (
    <span className="career-player-identity">
      <span
        className={`career-initials position-${player.positionType.toLowerCase()}`}
        aria-hidden="true"
      >
        {player.playerName
          .split(/\s+/)
          .slice(0, 2)
          .map((part) => part[0])
          .join('')}
      </span>
      <span className="career-player-text">
        <strong>{player.playerName}</strong>
        <small>
          <span className="career-position">{player.position1}</span>
        </small>
      </span>
    </span>
  );
}
