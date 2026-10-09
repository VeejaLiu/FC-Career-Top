import { Link } from 'react-router-dom';
import { LocaleConsumer } from '@douyinfe/semi-ui';
import { PlayerApis } from '../../service/PlayerApis';
import { getColorByPositionType } from '../../common/player-helper';
import {
  LoadErrorComponent,
  LoadingComponent,
  NoDataComponent,
} from '../../components/Other';
import { PlayerAvatar } from '../../components/PlayerAvatar';
import { PlayerTrendChart } from '../../components/PlayerTrendChart';
import './PlayerTrendsPage.css';
import { useAsyncResource } from '../../hooks/useAsyncResource';

const positionTypes = ['FOR', 'MID', 'DEF', 'GK'] as const;

export default function PlayerTrendsPage() {
  const {
    data,
    loading: isLoading,
    error,
    reload,
  } = useAsyncResource(PlayerApis.getPlayerTrends);
  if (error) return <LoadErrorComponent onRetry={reload} />;
  if (isLoading) return <LoadingComponent />;
  if (!data?.length) return <NoDataComponent />;
  return (
    <LocaleConsumer componentName="PlayerTrendsPage">
      {(locale: any) => (
        <div className="page-container trends-page">
          {positionTypes.map((position) => {
            const players = data.filter(
              (player) => player.positionType === position,
            );
            if (!players.length) return null;
            return (
              <section key={position} className="trends-group">
                <h2 style={{ color: getColorByPositionType(position) }}>
                  {locale[position]}
                </h2>
                <div className="trends-grid">
                  {players.map((player) => (
                    <article key={player.playerID} className="trend-card">
                      <Link
                        className="trend-player"
                        to={`/players-detail?id=${player.playerID}`}
                      >
                        <PlayerAvatar
                          playerID={player.playerID}
                          name={player.playerName}
                          size={100}
                        />
                        <div>
                          <span
                            style={{ color: getColorByPositionType(position) }}
                          >
                            {player.preferredposition1}
                          </span>
                          <strong>{player.playerName}</strong>
                          <small>ID: {player.playerID}</small>
                        </div>
                      </Link>
                      <PlayerTrendChart data={player.trends} />
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </LocaleConsumer>
  );
}
