import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Banner,
  Button,
  Card,
  Descriptions,
  Input,
  Modal,
  Select,
  SideSheet,
  Space,
  Table,
  Tag,
  Toast,
} from "@douyinfe/semi-ui";
import { IconSearch } from "@douyinfe/semi-icons";
import { api, errorMessage, formatDate, Page, User, UserDetail } from "./api";
import { PageTitle } from "./OverviewPage";
import { DataState, useData } from "./useData";
interface Action {
  user: User;
  kind: "status" | "revoke-session" | "rotate-key";
  title: string;
  description: string;
}
function UserInfo({ id }: { id: number }) {
  const state = useData<UserDetail>(`/users/${id}`);
  const user = state.data;
  return (
    <>
      <DataState {...state} />
      {user && !state.loading && !state.error && (
        <>
          <Descriptions
            align="left"
            data={[
              { key: "用户 ID", value: user.id },
              { key: "用户名", value: user.username },
              { key: "邮箱", value: user.email },
              { key: "账户状态", value: user.is_disabled ? "已停用" : "正常" },
              { key: "注册时间", value: formatDate(user.create_time) },
              { key: "成长记录", value: user.snapshots },
              {
                key: "默认游戏",
                value: user.settings?.default_game_version
                  ? `FC ${user.settings.default_game_version}`
                  : "—",
              },
              {
                key: "通知",
                value: user.settings?.enable_notification ? "开启" : "关闭",
              },
            ]}
          />
          <h3>游戏数据</h3>
          <Table
            rowKey="game_version"
            dataSource={user.versions}
            pagination={false}
            empty="此用户还没有上传球员"
            columns={[
              {
                title: "游戏",
                dataIndex: "game_version",
                render: (v: number) => `FC ${v}`,
              },
              { title: "球员", dataIndex: "players" },
              {
                title: "最近更新",
                dataIndex: "latest_upload",
                render: formatDate,
              },
            ]}
          />
          <Link className="detail-link" to={`/players?userId=${user.id}`}>
            查看此用户的球员数据 →
          </Link>
        </>
      )}
    </>
  );
}
export function UsersPage() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number>();
  const [action, setAction] = useState<Action>();
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const state = useData<Page<User>>(
    `/users?${new URLSearchParams({ q: search, status, page: String(page), limit: "20" })}`,
  );
  function ask(user: User, kind: Action["kind"]) {
    const actions = {
      status: {
        title: user.is_disabled ? "恢复账户" : "停用账户",
        description: user.is_disabled
          ? "恢复后，此用户可以重新登录和上传游戏数据。"
          : "该用户将立即退出登录，且无法登录或上传游戏数据。已有数据会保留。",
      },
      "revoke-session": {
        title: "强制退出登录",
        description:
          "当前登录会话和实时连接将被撤销。用户可以重新登录，上传密钥不受影响。",
      },
      "rotate-key": {
        title: "重置上传密钥",
        description:
          "旧密钥将立即失效。用户必须在前台重新复制 Lua 脚本，才能继续上传游戏数据。",
      },
    };
    setActionError("");
    setAction({ user, kind, ...actions[kind] });
  }
  async function confirm() {
    if (!action) return;
    setBusy(true);
    setActionError("");
    try {
      await api(
        `/users/${action.user.id}/${action.kind}`,
        action.kind === "status" ? { disabled: !action.user.is_disabled } : {},
      );
      Toast.success("操作已完成");
      setAction(undefined);
      state.reload();
    } catch (error) {
      setActionError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageTitle
        title="用户管理"
        subtitle="查看普通用户与游戏数据，处理常见的账户问题。"
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
              placeholder="搜索邮箱或用户名"
              aria-label="搜索用户"
              showClear
            />
            <Button htmlType="submit" theme="solid">
              搜索
            </Button>
          </form>
          <Select
            value={status}
            aria-label="账户状态"
            onChange={(value) => {
              setStatus(String(value));
              setPage(1);
            }}
            optionList={[
              { label: "全部用户", value: "all" },
              { label: "正常账户", value: "enabled" },
              { label: "停用账户", value: "disabled" },
            ]}
          />
          <span className="total">共 {state.data?.total ?? "—"} 位用户</span>
        </div>
        <DataState {...state} />
        {!state.error && (
          <Table
            loading={state.loading}
            dataSource={state.data?.items || []}
            rowKey="id"
            scroll={{ x: 1050 }}
            empty="没有匹配的用户"
            pagination={{
              currentPage: page,
              pageSize: 20,
              total: state.data?.total || 0,
              onPageChange: setPage,
            }}
            columns={[
              {
                title: "用户",
                dataIndex: "username",
                render: (_: unknown, user: User) => (
                  <div className="user-cell">
                    <Button
                      theme="borderless"
                      onClick={() => setSelected(user.id)}
                    >
                      {user.username}
                    </Button>
                    <small>{user.email}</small>
                  </div>
                ),
              },
              {
                title: "状态",
                dataIndex: "is_disabled",
                render: (v: number) => (
                  <Tag color={v ? "red" : "green"}>{v ? "停用" : "正常"}</Tag>
                ),
              },
              { title: "球员数", dataIndex: "player_count" },
              {
                title: "注册时间",
                dataIndex: "create_time",
                render: formatDate,
              },
              {
                title: "操作",
                width: 325,
                render: (_: unknown, user: User) => (
                  <Space>
                    <Button
                      size="small"
                      type={user.is_disabled ? "primary" : "danger"}
                      onClick={() => ask(user, "status")}
                    >
                      {user.is_disabled ? "恢复" : "停用"}
                    </Button>
                    <Button
                      size="small"
                      onClick={() => ask(user, "revoke-session")}
                    >
                      强制退出
                    </Button>
                    <Button
                      size="small"
                      onClick={() => ask(user, "rotate-key")}
                    >
                      重置密钥
                    </Button>
                  </Space>
                ),
              },
            ]}
          />
        )}
      </Card>
      <SideSheet
        title="用户详情"
        visible={selected !== undefined}
        onCancel={() => setSelected(undefined)}
        width={560}
      >
        {selected !== undefined && <UserInfo key={selected} id={selected} />}
      </SideSheet>
      <Modal
        title={action?.title}
        visible={Boolean(action)}
        onOk={confirm}
        onCancel={() => {
          if (!busy) setAction(undefined);
        }}
        confirmLoading={busy}
        cancelButtonProps={{ disabled: busy }}
        okText="确认操作"
        cancelText="取消"
        closable={!busy}
        maskClosable={!busy}
      >
        <p>
          用户：<strong>{action?.user.email}</strong>
        </p>
        <p>{action?.description}</p>
        {actionError && (
          <Banner
            type="danger"
            description={actionError}
            fullMode={false}
            closeIcon={null}
          />
        )}
      </Modal>
    </>
  );
}
