import {
  Banner,
  Button,
  Card,
  Descriptions,
  Table,
  Tag,
} from "@douyinfe/semi-ui";
import { IconRefresh } from "@douyinfe/semi-icons";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatDate, Overview } from "./api";
import { DataState, useData } from "./useData";
export function PageTitle({
  title,
  subtitle,
  onRefresh,
}: {
  title: string;
  subtitle: string;
  onRefresh: () => void;
}) {
  return (
    <div className="page-title">
      <div>
        <span className="eyebrow">ADMIN WORKSPACE</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <Button icon={<IconRefresh />} onClick={onRefresh}>
        刷新数据
      </Button>
    </div>
  );
}
export function OverviewPage() {
  const state = useData<Overview>("/overview");
  const data = state.data;
  return (
    <>
      <PageTitle
        title="数据概览"
        subtitle="了解社区规模与球员数据的最新变化。"
        onRefresh={state.reload}
      />
      <DataState {...state} />
      {data && !state.loading && !state.error && (
        <>
          <div className="stats-grid">
            {[
              ["注册用户", data.users, `近 7 天新增 ${data.newUsers} 人`],
              [
                "近 7 天上传用户",
                data.uploadingUsers,
                "按球员数据更新时间统计",
              ],
              ["球员记录", data.players, "包含当前阵容与归档球员"],
              ["成长记录", data.snapshots, "累计保存的球员历史状态"],
            ].map(([label, value, note]) => (
              <Card key={label} className="stat-card">
                <span className="stat-label">{label}</span>
                <strong>{Number(value).toLocaleString()}</strong>
                <span className="stat-note">{note}</span>
              </Card>
            ))}
          </div>
          <div className="overview-grid">
            <Card
              title="新用户趋势"
              headerExtraContent={<Tag>最近 30 天 · UTC</Tag>}
            >
              <div className="chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data.daily}
                    margin={{ top: 15, right: 12, left: -25, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="growth" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="#4f69f5"
                          stopOpacity={0.28}
                        />
                        <stop
                          offset="100%"
                          stopColor="#4f69f5"
                          stopOpacity={0.01}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="#e9edf3"
                    />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(v) => v.slice(5)}
                      minTickGap={35}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip />
                    <Area
                      name="新用户"
                      type="monotone"
                      dataKey="count"
                      stroke="#4f69f5"
                      strokeWidth={3}
                      fill="url(#growth)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card title="各版本数据分布">
              <Table
                dataSource={data.versions}
                rowKey="game_version"
                pagination={false}
                empty="还没有上传球员数据"
                columns={[
                  {
                    title: "游戏",
                    dataIndex: "game_version",
                    render: (v: number) => <Tag color="blue">FC {v}</Tag>,
                  },
                  { title: "用户", dataIndex: "users" },
                  { title: "球员", dataIndex: "players" },
                ]}
              />
              <div className="version-note">支持 FC 24、25、26 和 27</div>
            </Card>
          </div>
          <Banner
            type="info"
            fullMode={false}
            closeIcon={null}
            description={`最近一次球员更新：${formatDate(data.latestUpload)} · 当前停用账户：${data.disabledUsers} 个`}
          />
        </>
      )}
    </>
  );
}
export function SystemPage() {
  const state = useData<{
    database: string;
    serverTime: string;
    runtime: string;
    gameVersions: number[];
  }>("/system");
  return (
    <>
      <PageTitle
        title="系统状态"
        subtitle="查看后端连通性与运行信息。"
        onRefresh={state.reload}
      />
      <DataState {...state} />
      {state.data && !state.loading && !state.error && (
        <div className="system-grid">
          <Card title="服务检查">
            <Descriptions
              align="left"
              data={[
                { key: "数据库", value: <Tag color="green">连接正常</Tag> },
                { key: "后端运行环境", value: state.data.runtime },
                { key: "服务器时间", value: formatDate(state.data.serverTime) },
                {
                  key: "支持的游戏",
                  value: state.data.gameVersions
                    .map((v) => `FC ${v}`)
                    .join(" / "),
                },
              ]}
            />
          </Card>
          <Card title="管理员权限">
            <p>
              管理员由所有者在“管理员管理”中创建。后台账户与普通用户账户独立，不会显示用户密码或上传密钥。
            </p>
            <p>
              停用用户将立即撤销登录，并阻止新的登录和游戏数据上传。恢复账户后，用户需要重新登录。
            </p>
            <p>
              重置上传密钥后，用户需在前台重新复制 Lua
              脚本。账户变更记录可在操作日志中查询。
            </p>
          </Card>
        </div>
      )}
    </>
  );
}
