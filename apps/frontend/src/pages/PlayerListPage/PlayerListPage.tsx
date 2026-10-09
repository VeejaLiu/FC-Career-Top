import * as React from 'react';
import { useEffect } from 'react';
import {
  Input,
  LocaleConsumer,
  Popover,
  Space,
  Table,
} from '@douyinfe/semi-ui';
import { useNavigate } from 'react-router-dom';
import { PlayerApis, PlayerOverall } from '../../service/PlayerApis.ts';
import {
  getAvatarUrl,
  getColorByOverallRating,
  getColorByPositionType,
  getRankingColor,
} from '../../common/player-helper.ts';
import { LoadingComponent, NoDataComponent } from '../../components/Other.tsx';
import { IconActivity, IconSearch } from '@douyinfe/semi-icons';
import player_avatar_placeholder from '../../assets/image/player_avatar_placeholder.svg';
import { StarIcon } from '../../common/icons.tsx';

const PlayerListColumn = (
  localeData: any,
  navigate: any,
  searchValue: string,
  setSearchValue: React.Dispatch<React.SetStateAction<string>>,
) => [
  {
    title: (
      <Space>
        {localeData.name}
        <Input
          prefix={<IconSearch />}
          placeholder=""
          style={{ width: 150 }}
          onChange={(e: any) => {
            setSearchValue(e);
          }}
          showClear
        />
      </Space>
    ),
    dataIndex: 'playerName',
    render: (text: string, record: PlayerOverall, index: number) => {
      return (
        <div className="flex items-center">
          <div className={'w-12 h-12 mr-2 flex-shrink-0'}>
            <img
              className={'w-12 h-12'}
              src={record.imageUrl}
              alt="player"
              onError={(e) => {
                e.currentTarget.src = player_avatar_placeholder;
              }}
              onLoad={(e) => {
                e.currentTarget.style.display = 'block';
              }}
            />
          </div>
          <div
            className="cursor-pointer hover:underline min-w-0"
            onClick={() => {
              navigate(`/players-detail?id=${record.playerID}`);
            }}
          >
            <div className="text-gray-700  font-bold">{record.playerName}</div>
            <div className={'text-gray-400 text-sm font-mono'}>
              ID: {record.playerID}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    title: localeData.age,
    dataIndex: 'age',
    width: '128px',
    sorter: (a: PlayerOverall, b: PlayerOverall) => a.age - b.age,
    render: (text: string, record: PlayerOverall, index: number) => {
      return <span className="font-bold text-lg font-mono">{record.age}</span>;
    },
  },
  {
    title: localeData.position,
    dataIndex: 'position1',
    defaultSortOrder: 'ascend',
    // Sort by positionType first, GK > DEF > MID > FOR
    // then by position1, in dictionary order
    sorter: (a: PlayerOverall, b: PlayerOverall) => {
      const positionTypeMap = {
        GK: 1,
        DEF: 2,
        MID: 3,
        FOR: 4,
      };
      return (
        positionTypeMap[a.positionType] - positionTypeMap[b.positionType] ||
        a.position1.localeCompare(b.position1)
      );
    },
    width: '128px',
    render: (text: string, record: PlayerOverall) => {
      const color = getColorByPositionType(record.positionType);
      return (
        <div className="h-full w-full">
          <div style={{ color }} className="text-2xl">
            {record.position1}
          </div>
          <div>
            {[record.position2, record.position3, record.position4].map(
              (position, index) => {
                if (position) {
                  return (
                    <span key={index} className="text-sm mr-2 text-gray-400">
                      {position}
                    </span>
                  );
                }
                return null;
              },
            )}
          </div>
        </div>
      );
    },
  },
  {
    title: localeData.SkillMovesAndWeakFoot,
    dataIndex: 'skillMove',
    render: (text: string, record: PlayerOverall, index: number) => {
      const skillMoves = (record?.skillMoves || 0) + 1;
      const weakFoot = record?.weakFootAbilityTypeCode || 0;
      return (
        <div>
          <div
            className={'flex items-center'}
            title={localeData.SkillMovesTooltip}
          >
            <span
              className={`font-bold w-3 text-xl text-right text-yellow-400`}
            >
              {skillMoves}
            </span>
            <StarIcon classname={'text-yellow-400 h-6'} />
            <span className={'text-gray-400 text-sm ml-1'}>
              {localeData.SkillMoves}
            </span>
          </div>
          <div
            className={'flex items-center'}
            title={localeData.WeakFootTooltip}
          >
            <span
              className={`font-bold w-3 text-xl text-right text-yellow-400`}
            >
              {weakFoot}
            </span>
            <StarIcon classname="text-yellow-400 h-6" />
            <span className={'text-gray-400 text-sm ml-1'}>
              {localeData.WeakFoot}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    title: localeData.overall,
    dataIndex: 'overallRating',
    sorter: (a: PlayerOverall, b: PlayerOverall) =>
      a.overallRating - b.overallRating,
    render: (text: string, record: PlayerOverall, index: number) => {
      return (
        <Space vertical={false}>
          <span
            style={{
              color: getColorByOverallRating(record.overallRating),
            }}
            className={'font-mono text-4xl font-bold w-[50px]'}
          >
            {record.overallRating}
          </span>
          <span
            style={{
              width: '50px',
            }}
          >
            {(record.overallRanking || 999) <= 3 && (
              <Popover
                showArrow
                content={
                  <div>
                    {/*'The player ranks {ranking} in overall for his position.',*/}
                    {localeData.overallRankingTips
                      .replace('{ranking}', record.overallRanking || 999)
                      .replace('{position}', record.position1)}
                  </div>
                }
              >
                <div
                  style={{
                    height: '1.5rem',
                    width: '1.5rem',
                    borderRadius: '50%',
                    backgroundImage: getRankingColor(
                      record.overallRanking || 999,
                    ),
                  }}
                ></div>
              </Popover>
            )}
          </span>
        </Space>
      );
    },
  },
  {
    title: localeData.potential,
    dataIndex: 'potential',
    sorter: (a: PlayerOverall, b: PlayerOverall) => a.potential - b.potential,
    render: (text: string, record: PlayerOverall, index: number) => {
      return (
        <div
          style={{
            width: '200px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              color:
                record.potential > record.overallRating
                  ? getColorByOverallRating(record.potential)
                  : 'darkgray',
            }}
            className={'font-mono text-4xl font-bold w-[50px]'}
          >
            {record.potential}
          </span>
          <span
            style={{
              width: '50px',
            }}
          >
            {(record.potentialRanking || 999) <= 3 && (
              <Popover
                showArrow
                content={
                  <div>
                    {/* 'The player ranks {ranking} in potential for his position.' */}
                    {localeData.potentialRankingTips
                      .replace('{ranking}', record.potentialRanking || 999)
                      .replace('{position}', record.position1)}
                  </div>
                }
              >
                <div
                  style={{
                    marginLeft: '15px',
                    height: '1.5rem',
                    width: '1.5rem',
                    borderRadius: '50%',
                    backgroundImage: getRankingColor(
                      record.potentialRanking || 999,
                    ),
                  }}
                ></div>
              </Popover>
            )}
          </span>
          {record.potential === record.overallRating ? (
            <span
              style={{
                marginLeft: '15px',
                color: '#f6ca47',
              }}
            >
              <IconActivity size={'extra-large'} />
            </span>
          ) : null}
        </div>
      );
    },
  },
];

function PlayerListPage(): React.ReactElement {
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState<PlayerOverall[]>([]);
  const [filteredData, setFilteredData] = React.useState<PlayerOverall[]>([]);
  const [searchValue, setSearchValue] = React.useState('');
  const navigate = useNavigate();

  const getPlayerList = async () => {
    const players: PlayerOverall[] = await PlayerApis.getPlayerList();
    players.forEach((player) => {
      player.imageUrl = getAvatarUrl(player.playerID);
    });
    setFilteredData(players);
    setData(players);
    setIsLoading(false);
  };

  useEffect(() => {
    getPlayerList().then();
  }, []);

  useEffect(() => {
    const filtered = data.filter((player) =>
      player.playerName.toLowerCase().includes(searchValue.toLowerCase()),
    );
    setFilteredData(filtered);
  }, [searchValue, data]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {isLoading ? (
        <LoadingComponent />
      ) : data.length === 0 ? (
        <NoDataComponent />
      ) : (
        <LocaleConsumer componentName={'PlayerListTable'}>
          {(localeData: any, localeCode: string, dateFnsLocale: any) => (
            <Table
              sticky={{ top: 0 }}
              style={{
                minWidth: '800px',
                scroll: null,
              }}
              columns={PlayerListColumn(
                localeData,
                navigate,
                searchValue,
                setSearchValue,
              )}
              dataSource={filteredData}
              pagination={false}
              size="small"
            />
          )}
        </LocaleConsumer>
      )}
    </div>
  );
}

export default PlayerListPage;
