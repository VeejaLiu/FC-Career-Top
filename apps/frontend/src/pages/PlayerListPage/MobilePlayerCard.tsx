import { Link } from 'react-router-dom';
import type { PlayerOverall } from '../../service/PlayerApis';
import { PlayerAvatar } from '../../components/PlayerAvatar';
import {
  getColorByOverallRating,
  getColorByPosition,
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
  const positions = Array.from(
    new Set(
      [
        player.position1,
        player.position2,
        player.position3,
        player.position4,
        player.position5,
        player.position6,
        player.position7,
      ].filter((position): position is string => Boolean(position)),
    ),
  );

  return (
    <Link
      className="player-mobile-card"
      to={`/players-detail?id=${player.playerID}`}
      title={`${player.playerName} · ID: ${player.playerID}`}
    >
      <div className="player-mobile-portrait">
        <PlayerAvatar playerID={player.playerID} name={player.playerName} />
        <dl className="player-mobile-age">
          <dt>{locale.age}</dt>
          <dd>{player.age}</dd>
        </dl>
      </div>
      <div className="player-mobile-info">
        <strong className="player-mobile-name">{player.playerName}</strong>
        <dl className="player-mobile-ratings">
          {ratings.map((rating) => (
            <div key={rating.label}>
              <dt>{rating.label}</dt>
              <dd>
                <span
                  className="player-mobile-rating-value"
                  style={{
                    backgroundColor: getColorByOverallRating(rating.value),
                    color:
                      rating.value > 70 || rating.value <= 50
                        ? '#fff'
                        : '#252b32',
                  }}
                >
                  {rating.value}
                </span>
                {rating.ranking && rating.ranking <= 3 ? (
                  <small
                    className="player-mobile-ranking"
                    aria-label={rating.tips
                      .replace('{ranking}', rating.ranking)
                      .replace('{position}', player.position1)}
                    title={rating.tips
                      .replace('{ranking}', rating.ranking)
                      .replace('{position}', player.position1)}
                  >
                    #{rating.ranking}
                  </small>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
        <div className="player-mobile-meta">
          <div className="player-mobile-positions">
            {positions.map((position) => (
              <span
                key={position}
                style={{ color: getColorByPosition(position) }}
              >
                {position}
              </span>
            ))}
          </div>
          <div className="player-mobile-skills">
            <span>{locale.SkillMovesAndWeakFoot}</span>
            <b>
              {(player.skillMoves || 0) + 1}★ /{' '}
              {player.weakFootAbilityTypeCode || 0}★
            </b>
          </div>
        </div>
      </div>
    </Link>
  );
}
