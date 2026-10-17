import { useState } from "react";
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
import { formatDate, LuaError, Page } from "./api";
import { PageTitle } from "./OverviewPage";
import { DataState, useData } from "./useData";

const stages: Record<string, string> = {
  "initialization.imports": "加载依赖",
  "initialization.setup": "初始化脚本",
  "initialization.register": "注册事件",
  "initialization.date": "读取生涯日期",
  "snapshot.collect": "采集球员",
  "snapshot.encode": "生成上传数据",
  "snapshot.upload": "连接服务器",
  "snapshot.response": "确认上传结果",
  "career.event": "处理生涯事件",
};

export function LuaErrorsPage() {
  const [page, setPage] = useState(1);
  const [version, setVersion] = useState("");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<LuaError>();
  const state = useData<Page<LuaError>>(
    `/lua-errors?${new URLSearchParams({ page: String(page), limit: "20", gameVersion: version, q: search })}`,
  );
  function applySearch() {
    setSearch(query);
    setPage(1);
  }
  return (
    <>
      <PageTitle
        title="脚本错误"
        subtitle="查看最近 30 天 Lua 脚本收到的错误上报，定位兼容性和上传问题。"
        onRefresh={state.reload}
      />
      <Card>
        <div className="table-toolbar">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              applySearch();
            }}
          >
            <Input
              value={query}
              onChange={setQuery}
              placeholder="搜索错误、脚本版本或用户名"
              showClear
            />
            <Button htmlType="submit">搜索</Button>
          </form>
          <Select
            value={version}
            style={{ width: 150 }}
            onChange={(value) => {
              setVersion(String(value));
              setPage(1);
            }}
            optionList={[
              { label: "全部游戏", value: "" },
              ...[24, 25, 26, 27].map((v) => ({
                label: `FC ${v}`,
                value: String(v),
              })),
            ]}
          />
        </div>
        <p className="muted">
          同一用户、同类错误按天合并。次数为收到的上报次数；脚本会抑制短时间内的重复上报。
        </p>
        <DataState {...state} />
        {!state.error && (
          <Table
            dataSource={state.data?.items || []}
            loading={state.loading}
            rowKey="id"
            scroll={{ x: 1050 }}
            empty="还没有脚本错误上报"
            pagination={{
              currentPage: page,
              pageSize: 20,
              total: state.data?.total || 0,
              onPageChange: setPage,
            }}
            columns={[
              {
                title: "最近上报",
                dataIndex: "last_seen",
                width: 180,
                render: formatDate,
              },
              {
                title: "用户",
                render: (_: unknown, row: LuaError) =>
                  `${row.user_username} (#${row.user_id})`,
                width: 160,
              },
              {
                title: "游戏",
                dataIndex: "game_version",
                width: 80,
                render: (v: number) => <Tag color="blue">FC {v}</Tag>,
              },
              {
                title: "阶段",
                dataIndex: "stage",
                width: 150,
                render: (v: string) => stages[v] || v,
              },
              {
                title: "错误",
                dataIndex: "message",
                render: (v: string) => (
                  <div className="lua-error-message">{v}</div>
                ),
              },
              { title: "次数", dataIndex: "occurrences", width: 70 },
              {
                title: "详情",
                width: 90,
                fixed: "right",
                render: (_: unknown, row: LuaError) => (
                  <Button theme="borderless" onClick={() => setSelected(row)}>
                    查看
                  </Button>
                ),
              },
            ]}
          />
        )}
      </Card>
      <SideSheet
        title="脚本错误详情"
        visible={Boolean(selected)}
        onCancel={() => setSelected(undefined)}
        width={680}
      >
        {selected && (
          <>
            <Descriptions
              align="left"
              data={[
                {
                  key: "用户",
                  value: `${selected.user_username} (#${selected.user_id})`,
                },
                {
                  key: "游戏 / 脚本版本",
                  value: `FC ${selected.game_version} / ${selected.script_version}`,
                },
                { key: "Live Editor", value: selected.editor_version },
                {
                  key: "阶段",
                  value: stages[selected.stage] || selected.stage,
                },
                {
                  key: "首次 / 最近上报",
                  value: `${formatDate(selected.first_seen)} / ${formatDate(selected.last_seen)}`,
                },
                { key: "收到上报次数", value: selected.occurrences },
                {
                  key: "事件 / HTTP 状态",
                  value: `${selected.event_id ?? "—"} / ${selected.http_status ?? "—"}`,
                },
                { key: "生涯日期", value: selected.career_date || "—" },
              ]}
            />
            <h3>错误信息</h3>
            <pre className="lua-error-trace">{selected.message}</pre>
            <h3>调用堆栈</h3>
            <pre className="lua-error-trace">
              {selected.traceback || "未提供调用堆栈"}
            </pre>
          </>
        )}
      </SideSheet>
    </>
  );
}
