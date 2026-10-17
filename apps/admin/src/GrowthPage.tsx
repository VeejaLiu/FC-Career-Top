import { Card, Table } from "@douyinfe/semi-ui";
import { Link } from "react-router-dom";
import { useData, DataState } from "./useData";
import { PageTitle } from "./OverviewPage";
interface Growth {
  funnel: {
    registrations: number;
    activated: number;
    repeatUsers: number;
    averageSeconds: number | null;
  };
  versions: { script_version: string; successes: number; failures: number }[];
  daily: { day: string; successes: number; failures: number; users: number }[];
  trackingSince: string | null;
}
export function GrowthPage() {
  const state = useData<Growth>("/growth"),
    data = state.data;
  const delay = data?.funnel.averageSeconds;
  const average =
    delay == null
      ? "暂无记录"
      : delay < 60
        ? "平均不足 1 分钟"
        : `平均 ${Math.round(delay / 60)} 分钟`;
  return (
    <>
      <PageTitle
        title="接入与上传"
        subtitle="了解新用户是否顺利连上游戏，并持续记录成长。"
        onRefresh={state.reload}
      />
      <DataState {...state} />
      {data && (
        <>
          <div className="stats-grid">
            {[
              ["注册用户", data.funnel.registrations, "最近 30 天"],
              ["首次上传", data.funnel.activated || 0, average],
              [
                "首次上传转化",
                data.funnel.registrations
                  ? `${(((data.funnel.activated || 0) / data.funnel.registrations) * 100).toFixed(1)}%`
                  : "—",
                "同一批注册用户",
              ],
              ["再次记录", data.funnel.repeatUsers || 0, "至少两个游戏日期"],
            ].map(([label, value, note]) => (
              <Card className="stat-card" key={label}>
                <span className="stat-label">{label}</span>
                <strong>{value}</strong>
                <span className="stat-note">{note}</span>
              </Card>
            ))}
          </div>
          <div className="growth-notes">
            <span className="muted">上传事件从本次上线开始记录。</span>
            <details>
              <summary>统计口径</summary>
              <p>
                以最近 30
                天注册用户为同一统计组。再次记录指收到两个不同游戏日期的快照。历史上传不回填；升级前注册用户的首次上传耗时可能偏大。
              </p>
              <p>
                最早观测：{data.trackingSince || "尚无记录"}
                （UTC）。失败率仅统计已认证、已选定生涯的上传请求；网络中断或无效密钥可能不会到达此处。
              </p>
            </details>
            <Link to="/lua-errors">排查脚本错误 →</Link>
          </div>
          <Card title="脚本版本 · 最近 30 天">
            <Table
              rowKey="script_version"
              dataSource={data.versions}
              pagination={false}
              columns={[
                { title: "版本", dataIndex: "script_version" },
                { title: "成功", dataIndex: "successes" },
                { title: "失败", dataIndex: "failures" },
                {
                  title: "失败率",
                  render: (_: unknown, r: Growth["versions"][number]) =>
                    `${((r.failures / (r.successes + r.failures)) * 100).toFixed(1)}%`,
                },
              ]}
            />
          </Card>
          <Card title="每日上传 · UTC">
            <Table
              rowKey="day"
              dataSource={data.daily}
              pagination={{ pageSize: 10 }}
              columns={[
                { title: "日期", dataIndex: "day" },
                { title: "上传用户", dataIndex: "users" },
                { title: "成功", dataIndex: "successes" },
                { title: "失败", dataIndex: "failures" },
              ]}
            />
          </Card>
        </>
      )}
    </>
  );
}
