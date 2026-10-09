import { Link } from 'react-router-dom';
import type { PlayerOverall } from '../../service/PlayerApis';
import { PlayerAvatar } from '../../components/PlayerAvatar';
import {
  getColorByOverallRating,
  getColorByPositionType,
} from '../../common/player-helper';

export function MobilePlayerCard({
  player,
  locale,
}: {
  player: PlayerOverall;
  locale: any;
}) {
  const ratings = [
    {
      label: locale.overall,
      value: player.overallRating,
      ranking: player.overallRanking,
      tips: locale.overallRankingTips,
    },
    {
      label: locale.potential,
      value: player.potential,
      ranking: player.potentialRanking,
      tips: locale.potentialRankingTips,
    },
  ];
  return (
    <Link
      className="player-mobile-card"
      to={`/players-detail?id=${player.playerID}`}
    >
      <div className="player-mobile-heading">
        <PlayerAvatar playerID={player.playerID} name={player.playerName} />
        <div className="player-mobile-name">
          <strong>{player.playerName}</strong>
          <small>ID: {player.playerID}</small>
        </div>
        <span
          className="player-mobile-position"
          style={{ color: getColorByPositionType(player.positionType) }}
        >
          {player.position1}
        </span>
      </div>
      <dl className="player-mobile-stats">
        <div>
          <dt>{locale.age}</dt>
          <dd>{player.age}</dd>
        </div>
        {ratings.map((rating) => (
          <div key={rating.label}>
            <dt>{rating.label}</dt>
            <dd style={{ color: getColorByOverallRating(rating.value) }}>
              {rating.value}
              {rating.ranking && rating.ranking <= 3 ? (
                <small
                  className={`ranking-badge rank-${rating.ranking}`}
                  aria-label={rating.tips
                    .replace('{ranking}', rating.ranking)
                    .replace('{position}', player.position1)}
                >
                  #{rating.ranking}
                </small>
              ) : null}
            </dd>
          </div>
        ))}
        <div>
          <dt>{locale.SkillMovesAndWeakFoot}</dt>
          <dd className="player-mobile-skills">
            {(player.skillMoves || 0) + 1}★ /{' '}
            {player.weakFootAbilityTypeCode || 0}★
          </dd>
        </div>
      </dl>
      <div className="player-mobile-positions">
        {[player.position2, player.position3, player.position4]
          .filter(Boolean)
          .join(' · ')}
      </div>
    </Link>
  );
}
