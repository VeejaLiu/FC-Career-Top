import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Button,
  Card,
  Descriptions,
  Input,
  Select,
  SideSheet,
  Table,
  Tag,
} from "@douyinfe/semi-ui";
import { IconSearch } from "@douyinfe/semi-icons";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatDate, Page, Player, PlayerDetail } from "./api";
import { PageTitle } from "./OverviewPage";
import { DataState, useData } from "./useData";
function PlayerInfo({ id }: { id: number }) {
  const state = useData<PlayerDetail>(`/players/${id}`);
  const player = state.data;
  return (
    <>
      <DataState {...state} />
      {player && !state.loading && !state.error && (
        <>
          <Descriptions
            align="left"
            data={[
              { key: "球员", value: player.player_name },
              {
                key: "游戏 / 球员 ID",
                value: `FC ${player.game_version} / ${player.player_id}`,
              },
              { key: "所属用户", value: player.user_email },
              {
                key: "能力 / 潜力",
                value: `${player.overallrating} / ${player.potential}`,
              },
              { key: "年龄", value: player.age ?? "—" },
              {
                key: "身高 / 体重",
                value: `${player.height ?? "—"} cm / ${player.weight ?? "—"} kg`,
              },
              { key: "最近更新", value: formatDate(player.update_time) },
            ]}
          />
          <h3>成长趋势</h3>
          <p className="muted">
            共 {player.historyTotal} 条记录，显示最近 100 条。
          </p>
          {player.history.length > 0 && (
            <div className="chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={player.history}
                  margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="4 4" />
                  <XAxis dataKey="in_game_date" minTickGap={50} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    name="能力值"
                    dataKey="overallrating"
                    stroke="#4f69f5"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    name="潜力"
                    dataKey="potential"
                    stroke="#29a888"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <Table
            dataSource={player.history.slice().reverse()}
            rowKey="in_game_date"
            pagination={{ pageSize: 10 }}
            empty="没有历史记录"
            columns={[
              { title: "游戏日期", dataIndex: "in_game_date" },
              { title: "能力", dataIndex: "overallrating" },
              { title: "潜力", dataIndex: "potential" },
            ]}
          />
        </>
      )}
    </>
  );
}
export function PlayersPage() {
  const [params, setParams] = useSearchParams();
  const userId = params.get("userId") || "";
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [version, setVersion] = useState("");
  const [archived, setArchived] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number>();
  const state = useData<Page<Player>>(
    `/players?${new URLSearchParams({ q: search, gameVersion: version, archived, userId, page: String(page), limit: "20" })}`,
  );
  return (
    <>
      <PageTitle
        title="球员数据"
        subtitle="按游戏版本与用户查询球员，查看历史成长记录。"
        onRefresh={state.reload}
      />
      <Card>
        <div className="table-toolbar">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSearch(query);
              setPage(1);
            }}
          >
            <Input
              prefix={<IconSearch />}
              value={query}
              onChange={setQuery}
              placeholder="搜索球员姓名或用户邮箱"
              aria-label="搜索球员"
              showClear
            />
            <Button htmlType="submit" theme="solid">
              搜索
            </Button>
          </form>
          <Select
            value={version}
            aria-label="游戏版本"
            onChange={(value) => {
              setVersion(String(value));
              setPage(1);
            }}
            optionList={[
              { label: "全部版本", value: "" },
              ...[24, 25, 26, 27].map((v) => ({
                label: `FC ${v}`,
                value: String(v),
              })),
            ]}
          />
          <Select
            value={archived}
            aria-label="阵容状态"
            onChange={(value) => {
              setArchived(String(value));
              setPage(1);
            }}
            optionList={[
              { label: "全部球员", value: "all" },
              { label: "当前阵容", value: "active" },
              { label: "归档球员", value: "archived" },
            ]}
          />
          <span className="total">共 {state.data?.total ?? "—"} 条记录</span>
        </div>
        {userId && (
          <div className="filter-note">
            <Tag color="blue">用户 ID：{userId}</Tag>
            <Button
              theme="borderless"
              onClick={() => {
                setParams({});
                setPage(1);
              }}
            >
              清除用户筛选
            </Button>
          </div>
        )}
        <DataState {...state} />
        {!state.error && (
          <Table
            dataSource={state.data?.items || []}
            loading={state.loading}
            rowKey="id"
            scroll={{ x: 950 }}
            empty="没有匹配的球员数据"
            pagination={{
              currentPage: page,
              pageSize: 20,
              total: state.data?.total || 0,
              onPageChange: setPage,
            }}
            columns={[
              {
                title: "球员",
                dataIndex: "player_name",
                render: (_: unknown, player: Player) => (
                  <Button
                    theme="borderless"
                    onClick={() => setSelected(player.id)}
                  >
                    {player.player_name || `球员 ${player.player_id}`}
                  </Button>
                ),
              },
              {
                title: "游戏",
                dataIndex: "game_version",
                render: (v: number) => <Tag color="blue">FC {v}</Tag>,
              },
              { title: "所属用户", dataIndex: "user_email" },
              { title: "能力", dataIndex: "overallrating" },
              { title: "潜力", dataIndex: "potential" },
              {
                title: "状态",
                dataIndex: "is_archived",
                render: (v: number) => (
                  <Tag color={v ? "grey" : "green"}>
                    {v ? "归档" : "当前阵容"}
                  </Tag>
                ),
              },
              {
                title: "最近更新",
                dataIndex: "update_time",
                render: formatDate,
              },
            ]}
          />
        )}
      </Card>
      <SideSheet
        title="球员详情"
        visible={selected !== undefined}
        onCancel={() => setSelected(undefined)}
        width={650}
      >
        {selected !== undefined && <PlayerInfo key={selected} id={selected} />}
      </SideSheet>
    </>
  );
}
