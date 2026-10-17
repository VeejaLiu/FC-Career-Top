import { useState } from "react";
import { Card, Table, Tag } from "@douyinfe/semi-ui";
import { Audit, formatDate, Page } from "./api";
import { PageTitle } from "./OverviewPage";
import { DataState, useData } from "./useData";
const labels: Record<string, string> = {
  "disable-user": "停用账户",
  "enable-user": "恢复账户",
  "revoke-session": "强制退出登录",
  "rotate-key": "重置上传密钥",
  "bootstrap-admin": "初始化管理员",
  "migrate-administrator": "迁移独立管理员账户",
  "create-administrator": "创建管理员",
  "disable-administrator": "停用管理员",
  "enable-administrator": "恢复管理员",
  "change-admin-password": "修改管理员密码",
  "revoke-admin-sessions": "退出其他管理会话",
  login: "管理员登录",
  logout: "管理员退出",
};
export function AuditPage() {
  const [page, setPage] = useState(1);
  const state = useData<Page<Audit>>(`/audit?page=${page}&limit=20`);
  return (
    <>
      <PageTitle
        title="操作日志"
        subtitle="查询管理员操作记录，追踪账户变更。"
        onRefresh={state.reload}
      />
      <Card>
        <DataState {...state} />
        {!state.error && (
          <Table
            dataSource={state.data?.items || []}
            loading={state.loading}
            rowKey="id"
            scroll={{ x: 700 }}
            empty="还没有管理操作记录"
            pagination={{
              currentPage: page,
              pageSize: 20,
              total: state.data?.total || 0,
              onPageChange: setPage,
            }}
            columns={[
              { title: "时间", dataIndex: "create_time", render: formatDate },
              { title: "管理员", dataIndex: "actor_username" },
              {
                title: "操作",
                dataIndex: "action",
                render: (v: string) => (
                  <Tag color={v === "disable-user" ? "red" : "blue"}>
                    {labels[v] || v}
                  </Tag>
                ),
              },
              {
                title: "操作对象",
                render: (_: unknown, row: Audit) =>
                  row.target_id
                    ? `${row.target_type === "user" ? "用户" : row.target_type === "administrator" ? "管理员" : "会话"} ${row.target_id}`
                    : "—",
              },
            ]}
          />
        )}
      </Card>
    </>
  );
}
