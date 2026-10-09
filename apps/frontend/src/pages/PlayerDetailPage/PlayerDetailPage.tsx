import * as React from 'react';
import { useEffect, useState } from 'react';
import { Col, LocaleConsumer, Progress, Row, Space } from '@douyinfe/semi-ui';
import { PlayerApis, PlayerDetail } from '../../service/PlayerApis.ts';
import './PlayerDetailPage.css';
import {
  Area,
  AreaChart,
  Brush,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useSearchParams } from 'react-router-dom';
import {
  CustomTooltip,
  formatDate,
} from '../PlayerTrendsPage/PlayerTrendsPage.tsx';
import { LoadingComponent, NoDataComponent } from '../../components/Other.tsx';
import PlayerPickerComponent from './PlayerPickerComponent';
import BasicInfoComponent from './BasicInfoComponent.tsx';
import { getColorByOverallRating } from '../../common/player-helper.ts';

function PlayerDetailPage(): React.ReactElement {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const id = searchParams.get('id');

  const [playerDetail, setPlayerDetail] = useState<PlayerDetail>();
  const [playerID, setPlayerID] = useState<number>(id ? +id : 0);

  const getPlayerDetail = async () => {
    setIsLoading(true);
    const data = await PlayerApis.getPlayerDetail({ playerID: playerID });
    if (data) {
      setPlayerDetail(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getPlayerDetail().then();
  }, [playerID]);

  const AttributeSectionCol = ({
    title,
    attributes,
    values,
  }: {
    title: string;
    attributes: { label: string }[];
    values: number[];
  }) => {
    const average =
      values.reduce((sum, value) => sum + (value || 0), 0) / values.length;

    return (
      <Col span={8}>
        <div className="col-content">
          <span className={'title'}>{title}</span>
          <Progress percent={average} style={{ height: '8px' }} />
          {attributes.map((attr, index) => (
            <div className="stat m-0.5" key={index}>
              <span className="">{attr.label}</span>
              <span
                className={`text-center w-7 p-0.25 text-white rounded-sm font-mono`}
                style={{
                  backgroundColor: getColorByOverallRating(values[index]),
                }}
              >
                {values[index]}
              </span>
            </div>
          ))}
        </div>
      </Col>
    );
  };

  return playerDetail ? (
    <LocaleConsumer componentName={'PlayerDetailPage'}>
      {(localeData: any, localeCode: string, dateFnsLocale: any) => (
        <div className={'detail-page-root'}>
          {/* Player picker ---- start */}
          <PlayerPickerComponent
            playerID={playerID}
            setPlayerID={setPlayerID}
          />
          {/* Player picker ---- end */}

          {isLoading ? (
            <LoadingComponent />
          ) : playerDetail?.thisPlayer == null ? (
            <NoDataComponent />
          ) : (
            // Detail info
            <div
              style={{
                backgroundColor: '#f4f5f5',
                padding: '20px',
                flexGrow: '1',
              }}
            >
              <div style={{ display: 'flex' }}>
                {/* Basic info*/}
                <BasicInfoComponent
                  playerInfo={playerDetail?.thisPlayer}
                  localeData={localeData}
                ></BasicInfoComponent>

                {/* Details */}
                <div className="grid" style={{ width: '100%' }}>
                  {playerDetail?.thisPlayer?.preferredposition1 == 0 && (
                    <Row>
                      <AttributeSectionCol
                        title={localeData.Attributes.Goalkeeping}
                        attributes={[
                          { label: localeData.Attributes.GKDiving },
                          { label: localeData.Attributes.GKHandling },
                          { label: localeData.Attributes.GKKicking },
                          { label: localeData.Attributes.GKReflexes },
                          { label: localeData.Attributes.GKPositioning },
                        ]}
                        values={[
                          playerDetail?.thisPlayer?.gkdiving,
                          playerDetail?.thisPlayer?.gkhandling,
                          playerDetail?.thisPlayer?.gkkicking,
                          playerDetail?.thisPlayer?.gkreflexes,
                          playerDetail?.thisPlayer?.gkpositioning,
                        ]}
                      />
                    </Row>
                  )}
                  <Row style={{ alignItems: 'stretch' }}>
                    <AttributeSectionCol
                      title={localeData.Attributes.Pace}
                      attributes={[
                        { label: localeData.Attributes.Acceleration },
                        { label: localeData.Attributes.SprintSpeed },
                      ]}
                      values={[
                        playerDetail?.thisPlayer?.acceleration,
                        playerDetail?.thisPlayer?.sprintspeed,
                      ]}
                    />

                    <AttributeSectionCol
                      title={localeData.Attributes.Shooting}
                      attributes={[
                        { label: localeData.Attributes.AttackingPosition },
                        { label: localeData.Attributes.Finishing },
                        { label: localeData.Attributes.ShotPower },
                        { label: localeData.Attributes.LongShots },
                        { label: localeData.Attributes.Volleys },
                        { label: localeData.Attributes.Penalties },
                      ]}
                      values={[
                        playerDetail?.thisPlayer?.positioning,
                        playerDetail?.thisPlayer?.finishing,
                        playerDetail?.thisPlayer?.shotpower,
                        playerDetail?.thisPlayer?.longshots,
                        playerDetail?.thisPlayer?.volleys,
                        playerDetail?.thisPlayer?.penalties,
                      ]}
                    />

                    <AttributeSectionCol
                      title={localeData.Attributes.Passing}
                      attributes={[
                        { label: localeData.Attributes.Vision },
                        { label: localeData.Attributes.Crossing },
                        { label: localeData.Attributes.FKAccuracy },
                        { label: localeData.Attributes.ShortPass },
                        { label: localeData.Attributes.LongPass },
                        { label: localeData.Attributes.Curve },
                      ]}
                      values={[
                        playerDetail?.thisPlayer?.vision,
                        playerDetail?.thisPlayer?.crossing,
                        playerDetail?.thisPlayer?.freekickaccuracy,
                        playerDetail?.thisPlayer?.shortpassing,
                        playerDetail?.thisPlayer?.longpassing,
                        playerDetail?.thisPlayer?.curve,
                      ]}
                    />
                  </Row>
                  <Row style={{ alignItems: 'stretch' }}>
                    <AttributeSectionCol
                      title={localeData.Attributes.Dribbling}
                      attributes={[
                        { label: localeData.Attributes.Agility },
                        { label: localeData.Attributes.Balance },
                        { label: localeData.Attributes.Reactions },
                        { label: localeData.Attributes.BallControl },
                        { label: localeData.Attributes.Dribbling },
                        { label: localeData.Attributes.Composure },
                      ]}
                      values={[
                        playerDetail?.thisPlayer?.agility,
                        playerDetail?.thisPlayer?.balance,
                        playerDetail?.thisPlayer?.reactions,
                        playerDetail?.thisPlayer?.ballcontrol,
                        playerDetail?.thisPlayer?.dribbling,
                        playerDetail?.thisPlayer?.composure,
                      ]}
                    />
                    <AttributeSectionCol
                      title={localeData.Attributes.Defending}
                      attributes={[
                        { label: localeData.Attributes.Interceptions },
                        { label: localeData.Attributes.HeadingAccuracy },
                        { label: localeData.Attributes.DefensiveAwareness },
                        { label: localeData.Attributes.StandingTackle },
                        { label: localeData.Attributes.SlidingTackle },
                      ]}
                      values={[
                        playerDetail?.thisPlayer?.interceptions,
                        playerDetail?.thisPlayer?.headingaccuracy,
                        playerDetail?.thisPlayer?.defensiveawareness,
                        playerDetail?.thisPlayer?.standingtackle,
                        playerDetail?.thisPlayer?.slidingtackle,
                      ]}
                    />
                    <AttributeSectionCol
                      title={localeData.Attributes.Physical}
                      attributes={[
                        { label: localeData.Attributes.Jumping },
                        { label: localeData.Attributes.Stamina },
                        { label: localeData.Attributes.Strength },
                        { label: localeData.Attributes.Aggression },
                      ]}
                      values={[
                        playerDetail?.thisPlayer?.jumping,
                        playerDetail?.thisPlayer?.stamina,
                        playerDetail?.thisPlayer?.strength,
                        playerDetail?.thisPlayer?.aggression,
                      ]}
                    />
                  </Row>
                </div>
              </div>

              {/* Trends */}
              <Space
                style={{
                  width: '100%',
                  height: '400px',
                  padding: '10px',
                  backgroundColor: '#f4f5f5',
                  borderRadius: '2px',
                }}
              >
                <ResponsiveContainer>
                  <AreaChart
                    height={400}
                    data={playerDetail?.trends}
                    margin={{
                      left: -20,
                      right: 12,
                    }}
                  >
                    {/* 网格 */}
                    <CartesianGrid vertical />
                    {/* X轴 */}
                    <XAxis
                      dataKey="inGameDate"
                      type={'category'}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      style={{ fontSize: '0.8rem' }}
                      tickFormatter={formatDate}
                    ></XAxis>
                    {/* Y轴 */}
                    <YAxis
                      domain={[40, 100]}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    ></YAxis>
                    {/* 提示 */}
                    <Tooltip content={<CustomTooltip />} />
                    {/* 数据 */}
                    <Area
                      dataKey="potential"
                      type="linear"
                      fill="#125427"
                      stroke="#125427"
                      fillOpacity={0.4}
                    />
                    <Area
                      dataKey="overallRating"
                      type="linear"
                      fill="#5d7e2f"
                      stroke="none"
                      fillOpacity={0.8}
                    />
                    <Brush
                      dataKey="inGameDate"
                      height={30}
                      stroke="#82ca9d"
                      tickFormatter={formatDate}
                      style={{ fontSize: '0.5rem' }}
                      startIndex={Math.max(playerDetail.trends.length - 52, 0)}
                      endIndex={playerDetail.trends.length - 1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Space>
            </div>
          )}
        </div>
      )}
    </LocaleConsumer>
  ) : (
    <NoDataComponent />
  );
}

export default PlayerDetailPage;
