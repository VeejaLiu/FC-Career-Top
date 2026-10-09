import * as React from 'react';
import { useEffect } from 'react';
import { Area, AreaChart, Brush, Tooltip, XAxis, YAxis } from 'recharts';
import { PlayerApis, PlayerTrendData } from '../../service/PlayerApis.ts';
import { Popover, Space } from '@douyinfe/semi-ui';
import './PlayerTrendsPage.css';
import {
  getAvatarUrl,
  getColorByOverallRating,
  getColorByPositionType,
} from '../../common/player-helper.ts';
import { LoadingComponent, NoDataComponent } from '../../components/Other.tsx';
import { useNavigate } from 'react-router-dom';
import player_avatar_placeholder from '../../assets/image/player_avatar_placeholder.svg';

export function formatDate(inputDate: string) {
  const [, month, day] = inputDate.split('-').map(Number);

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const monthName = monthNames[month - 1];

  return `${monthName} ${day}`;

  // const suffix =
  //   day % 10 === 1 && day !== 11
  //     ? 'st'
  //     : day % 10 === 2 && day !== 12
  //       ? 'nd'
  //       : day % 10 === 3 && day !== 13
  //         ? 'rd'
  //         : 'th';
  //
  // return `${monthName} ${day}${suffix}`;
}

export const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: any;
  label?: string;
}> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const { overallRating, potential } = payload[0].payload; // 获取数据
    return (
      <div
        style={{
          backgroundColor: 'white',
          border: '1px solid gray',
          padding: '5px',
          fontSize: '0.8rem',
        }}
      >
        <p
          style={{
            borderBottom: '1px solid gray',
            marginBottom: '5px',
            fontWeight: 'bold',
          }}
        >
          {payload[0].payload.inGameDate}
        </p>
        <p style={{ color: getColorByOverallRating(overallRating) }}>
          <b>Ovr: </b>
          {overallRating}
        </p>
        <p style={{ color: getColorByOverallRating(potential) }}>
          <b>Pot: </b>
          {potential}
        </p>
      </div>
    );
  }
};

function PlayerTrendsPage(): React.ReactElement {
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState<PlayerTrendData[]>([]);
  const navigate = useNavigate();

  const fetchPlayerTrends = async () => {
    const res: PlayerTrendData[] = await PlayerApis.getPlayerTrends();
    setData(res);
  };

  useEffect(() => {
    fetchPlayerTrends().then(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="w-full px-2 h-full">
      {isLoading ? (
        <LoadingComponent />
      ) : data.length === 0 ? (
        <NoDataComponent />
      ) : (
        [
          {
            position: 'FOR',
            text: 'Forwards',
            color: getColorByPositionType('FOR'),
          },
          {
            position: 'MID',
            text: 'Midfielders',
            color: getColorByPositionType('MID'),
          },
          {
            position: 'DEF',
            text: 'Defenders',
            color: getColorByPositionType('DEF'),
          },
          {
            position: 'GK',
            text: 'Goalkeepers',
            color: getColorByPositionType('GK'),
          },
        ].map((item) => {
          const thisPositionPlayers = data.filter(
            (player) => player.positionType === item.position,
          );
          if (thisPositionPlayers.length === 0) {
            return null;
          }
          return (
            <div className="p-2">
              <div className="text-xl font-bold" style={{ color: item.color }}>
                {item.text}
              </div>
              <Space className={'mt-2'} wrap align={'start'}>
                {thisPositionPlayers.map((player) => {
                  return (
                    <Space
                      className={''}
                      key={player.playerID}
                      style={{
                        borderRadius: '3px',
                        backgroundColor: '#f4f5f5',
                        padding: '10px',
                      }}
                    >
                      <Space
                        vertical
                        style={{
                          background:
                            'linear-gradient(45deg, #e3c96b, #f3e89b)',
                          borderRadius: '8px',
                          width: '120px',
                          height: '190px',
                          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                          overflow: 'hidden',
                        }}
                      >
                        <span
                          style={{
                            color: getColorByPositionType(player.positionType),
                          }}
                        >
                          <h4>{player.preferredposition1}</h4>
                        </span>
                        <div
                          style={{
                            width: 100,
                            height: 100,
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            navigate(`/players-detail?id=${player.playerID}`);
                          }}
                        >
                          <img
                            style={{ width: 100, height: 100 }}
                            src={getAvatarUrl(player.playerID)}
                            alt="player"
                            onError={(e) => {
                              e.currentTarget.src = player_avatar_placeholder;
                            }}
                          />
                        </div>
                        <Popover
                          showArrow
                          content={
                            <article>
                              <h3>{player.playerName}</h3>
                              Player ID: {player.playerID}
                            </article>
                          }
                          position={'right'}
                        >
                          <a
                            className="text-container"
                            onClick={() => {
                              navigate(`/players-detail?id=${player.playerID}`);
                            }}
                          >
                            {player.playerName}
                          </a>
                        </Popover>
                      </Space>

                      <AreaChart
                        width={300}
                        height={190}
                        data={player.trends}
                        margin={{ right: 30, left: -20, bottom: -0 }}
                      >
                        {/*<CartesianGrid vertical={false} />*/}
                        <XAxis
                          dataKey="inGameDate"
                          type={'category'}
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          style={{ fontSize: '0.8rem' }}
                          tickFormatter={formatDate} // Add this line to format the dates
                        ></XAxis>
                        <YAxis
                          domain={[50, 100]}
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          style={{ fontSize: '0.8rem' }}
                        ></YAxis>
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="linear"
                          dataKey="potential"
                          fill="#125427"
                          stroke="#125427"
                          fillOpacity={0.4}
                        ></Area>
                        <Area
                          type="linear"
                          dataKey="overallRating"
                          fill="#5d7e2f"
                          stroke="none"
                          fillOpacity={0.8}
                        ></Area>
                        <Brush
                          dataKey="inGameDate"
                          height={20}
                          stroke="#82ca9d"
                          tickFormatter={formatDate}
                          style={{ fontSize: '0.5rem' }}
                          startIndex={Math.max(player.trends.length - 52, 0)}
                          endIndex={player.trends.length - 1}
                        />
                      </AreaChart>
                    </Space>
                  );
                })}
              </Space>
            </div>
          );
        })
      )}
    </div>
  );
}

export default PlayerTrendsPage;
