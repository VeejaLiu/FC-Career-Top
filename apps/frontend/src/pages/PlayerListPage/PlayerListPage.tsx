import * as React from 'react';
import {
  Input,
  LocaleConsumer,
  Popover,
  Select,
  Space,
  Table,
} from '@douyinfe/semi-ui';
import { useNavigate } from 'react-router-dom';
import { PlayerApis, PlayerOverall } from '../../service/PlayerApis.ts';
import {
  getColorByOverallRating,
  getColorByPositionType,
  getRankingColor,
} from '../../common/player-helper.ts';
import {
  LoadErrorComponent,
  LoadingComponent,
  NoDataComponent,
} from '../../components/Other.tsx';
import { IconActivity, IconSearch } from '@douyinfe/semi-icons';
import { PlayerAvatar } from '../../components/PlayerAvatar';
import { MobilePlayerCard } from './MobilePlayerCard';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { comparePlayerPosition } from '../../common/player-sort';
import './PlayerListPage.css';
import { useAsyncResource } from '../../hooks/useAsyncResource';
import { StarIcon } from '../../common/icons.tsx';

const PlayerListColumn = (
  localeData: any,
  navigate: ReturnType<typeof useNavigate>,
) => [
  {
    title: localeData.name,
    dataIndex: 'playerName',
    render: (text: string, record: PlayerOverall, index: number) => {
      return (
        <div className="flex items-center">
          <div className="mr-2">
            <PlayerAvatar playerID={record.playerID} name={record.playerName} />
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
    sorter: comparePlayerPosition,
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
            minWidth: '120px',
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

type SortField =
  | 'position'
  | 'playerName'
  | 'age'
  | 'overallRating'
  | 'potential';

function PlayerListPage(): React.ReactElement {
  const {
    data: players,
    loading: isLoading,
    error,
    reload,
  } = useAsyncResource(PlayerApis.getPlayerList);
  const data = React.useMemo(() => players || [], [players]);
  const [searchValue, setSearchValue] = React.useState('');
  const [sortField, setSortField] = React.useState<SortField>('position');
  const isCompact = useMediaQuery('(max-width: 1023px)');
  const navigate = useNavigate();

  const filteredData = React.useMemo(
    () =>
      data
        .filter((player) =>
          player.playerName
            .toLowerCase()
            .includes(searchValue.toLowerCase().trim()),
        )
        .sort((a, b) => {
          if (sortField === 'position') return comparePlayerPosition(a, b);
          if (sortField === 'playerName')
            return a.playerName.localeCompare(b.playerName);
          if (sortField === 'age') return a.age - b.age;
          return b[sortField] - a[sortField] || comparePlayerPosition(a, b);
        }),
    [data, searchValue, sortField],
  );

  return error ? (
    <LoadErrorComponent onRetry={reload} />
  ) : isLoading ? (
    <LoadingComponent />
  ) : data.length === 0 ? (
    <NoDataComponent />
  ) : (
    <LocaleConsumer componentName="PlayerListTable">
      {(locale: any) => (
        <section className="page-container player-list-page">
          <div className="player-list-toolbar">
            <Input
              aria-label={locale.name}
              prefix={<IconSearch />}
              placeholder={locale.name}
              value={searchValue}
              onChange={setSearchValue}
              showClear
            />
            {isCompact && (
              <Select
                aria-label={locale.position}
                value={sortField}
                onChange={(value) => setSortField(value as SortField)}
                optionList={[
                  { value: 'position', label: locale.position },
                  { value: 'playerName', label: locale.name },
                  { value: 'age', label: locale.age },
                  { value: 'overallRating', label: locale.overall },
                  { value: 'potential', label: locale.potential },
                ]}
              />
            )}
          </div>
          {isCompact ? (
            <div className="player-mobile-list">
              {filteredData.map((player) => (
                <MobilePlayerCard
                  key={player.playerID}
                  player={player}
                  locale={locale}
                />
              ))}
              {filteredData.length === 0 && (
                <p className="player-search-empty" role="status">
                  0 / {data.length}
                </p>
              )}
            </div>
          ) : (
            <Table
              sticky={{ top: 0 }}
              columns={PlayerListColumn(locale, navigate)}
              dataSource={filteredData}
              rowKey="playerID"
              pagination={false}
              size="small"
              scroll={{ x: 980 }}
            />
          )}
        </section>
      )}
    </LocaleConsumer>
  );
}

export default PlayerListPage;
