import { useCallback } from 'react';
import { LocaleConsumer, Progress } from '@douyinfe/semi-ui';
import { useSearchParams } from 'react-router-dom';
import { PlayerApis } from '../../service/PlayerApis';
import {
  LoadErrorComponent,
  LoadingComponent,
  NoDataComponent,
} from '../../components/Other';
import { PlayerTrendChart } from '../../components/PlayerTrendChart';
import PlayerPickerComponent from './PlayerPickerComponent';
import BasicInfoComponent from './BasicInfoComponent';
import PlayerProfileComponent from './PlayerProfileComponent';
import { getColorByOverallRating } from '../../common/player-helper';
import './PlayerDetailPage.css';
import { useAsyncResource } from '../../hooks/useAsyncResource';

const attributeGroups = [
  {
    title: 'Goalkeeping',
    goalkeeper: true,
    attributes: [
      ['GKDiving', 'gkdiving'],
      ['GKHandling', 'gkhandling'],
      ['GKKicking', 'gkkicking'],
      ['GKReflexes', 'gkreflexes'],
      ['GKPositioning', 'gkpositioning'],
    ],
  },
  {
    title: 'Pace',
    attributes: [
      ['Acceleration', 'acceleration'],
      ['SprintSpeed', 'sprintspeed'],
    ],
  },
  {
    title: 'Shooting',
    attributes: [
      ['AttackingPosition', 'positioning'],
      ['Finishing', 'finishing'],
      ['ShotPower', 'shotpower'],
      ['LongShots', 'longshots'],
      ['Volleys', 'volleys'],
      ['Penalties', 'penalties'],
    ],
  },
  {
    title: 'Passing',
    attributes: [
      ['Vision', 'vision'],
      ['Crossing', 'crossing'],
      ['FKAccuracy', 'freekickaccuracy'],
      ['ShortPass', 'shortpassing'],
      ['LongPass', 'longpassing'],
      ['Curve', 'curve'],
    ],
  },
  {
    title: 'Dribbling',
    attributes: [
      ['Agility', 'agility'],
      ['Balance', 'balance'],
      ['Reactions', 'reactions'],
      ['BallControl', 'ballcontrol'],
      ['Dribbling', 'dribbling'],
      ['Composure', 'composure'],
    ],
  },
  {
    title: 'Defending',
    attributes: [
      ['Interceptions', 'interceptions'],
      ['HeadingAccuracy', 'headingaccuracy'],
      ['DefensiveAwareness', 'defensiveawareness'],
      ['StandingTackle', 'standingtackle'],
      ['SlidingTackle', 'slidingtackle'],
    ],
  },
  {
    title: 'Physical',
    attributes: [
      ['Jumping', 'jumping'],
      ['Stamina', 'stamina'],
      ['Strength', 'strength'],
      ['Aggression', 'aggression'],
    ],
  },
] as const;

export default function PlayerDetailPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const parsedID = Number(searchParams.get('id'));
  const playerID =
    Number.isSafeInteger(parsedID) && parsedID > 0 ? parsedID : 0;
  const loadDetail = useCallback(
    () => PlayerApis.getPlayerDetail({ playerID }),
    [playerID],
  );
  const {
    data: detail,
    loading,
    error,
    reload,
  } = useAsyncResource(loadDetail, Boolean(playerID));
  const selectPlayer = useCallback(
    (id: number) =>
      setSearchParams((previous) => {
        const next = new URLSearchParams(previous);
        next.set('id', String(id));
        return next;
      }),
    [setSearchParams],
  );

  return (
    <div className="detail-page-root">
      <PlayerPickerComponent playerID={playerID} setPlayerID={selectPlayer} />
      {error ? (
        <LoadErrorComponent onRetry={reload} />
      ) : loading ? (
        <LoadingComponent />
      ) : !detail?.thisPlayer ? (
        <NoDataComponent />
      ) : (
        <LocaleConsumer componentName="PlayerDetailPage">
          {(locale: any) => (
            <div className="page-container player-detail-content">
              <div className="player-detail-layout">
                <BasicInfoComponent
                  playerInfo={detail.thisPlayer}
                  localeData={locale}
                />
                <div className="player-attributes">
                  {attributeGroups.map((group) => {
                    const values = group.attributes
                      .map(([, field]) => detail.thisPlayer[field])
                      .filter(
                        (value) =>
                          typeof value === 'number' && Number.isFinite(value),
                      );
                    const average = values.length
                      ? values.reduce((sum, value) => sum + value, 0) /
                        values.length
                      : null;
                    return (
                      <section className="attribute-section" key={group.title}>
                        <h2>{locale.Attributes[group.title]}</h2>
                        {average != null && (
                          <>
                            <div className="attribute-average">
                              {locale.Profile.AverageAttribute}:{' '}
                              {average.toFixed(1)}
                            </div>
                            <Progress percent={average} style={{ height: 8 }} />
                          </>
                        )}
                        {group.attributes.map(([label, field]) => (
                          <div className="player-stat" key={field}>
                            <span>{locale.Attributes[label]}</span>
                            <span
                              className="attribute-value"
                              style={{
                                backgroundColor:
                                  detail.thisPlayer[field] == null
                                    ? '#777'
                                    : getColorByOverallRating(
                                        detail.thisPlayer[field],
                                      ),
                              }}
                            >
                              {detail.thisPlayer[field] ?? '—'}
                            </span>
                          </div>
                        ))}
                      </section>
                    );
                  })}
                </div>
              </div>
              <PlayerProfileComponent
                player={detail.thisPlayer}
                profile={detail.thisPlayer.playerProfile}
                locale={locale.Profile}
              />
              <div className="player-detail-chart">
                <PlayerTrendChart
                  key={playerID}
                  data={detail.trends}
                  detailed
                  height={300}
                />
              </div>
            </div>
          )}
        </LocaleConsumer>
      )}
    </div>
  );
}
