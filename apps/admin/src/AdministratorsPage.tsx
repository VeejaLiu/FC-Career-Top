import { useState } from "react";
import {
  Banner,
  Button,
  Card,
  Descriptions,
  Input,
  Modal,
  Select,
  Table,
  Tag,
  Toast,
} from "@douyinfe/semi-ui";
import { Actor, api, errorMessage, formatDate } from "./api";
import { PageTitle } from "./OverviewPage";
import { DataState, useData } from "./useData";
interface AdminAccount {
  id: number;
  username: string;
  role: "owner" | "operator";
  is_disabled: number;
  last_login_time: string | null;
  create_time: string;
}
interface AdminSession {
  id: string;
  user_agent: string;
  created_at: number;
  expires_at: number;
  current: boolean;
}
export function AdministratorsPage({ currentId }: { currentId: number }) {
  const state = useData<AdminAccount[]>("/administrators");
  const [create, setCreate] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("operator");
  const [target, setTarget] = useState<AdminAccount>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit() {
    setBusy(true);
    setError("");
    try {
      if (target)
        await api(`/administrators/${target.id}/status`, {
          disabled: !target.is_disabled,
        });
      else await api("/administrators", { username, password, role });
      setCreate(false);
      setTarget(undefined);
      setPassword("");
      state.reload();
      Toast.success("操作已完成");
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageTitle
        title="管理员管理"
        subtitle="管理后台专用账户，与普通用户账户完全独立。"
        onRefresh={state.reload}
      />
      <Card>
        <div className="table-toolbar">
          <Tag color="blue">仅所有者可管理</Tag>
          <Button
            theme="solid"
            onClick={() => {
              setCreate(true);
              setError("");
              setUsername("");
              setPassword("");
              setRole("operator");
            }}
          >
            新增管理员
          </Button>
        </div>
        <DataState {...state} />
        {!state.error && (
          <Table
            loading={state.loading}
            rowKey="id"
            dataSource={state.data || []}
            pagination={false}
            scroll={{ x: 800 }}
            columns={[
              { title: "用户名", dataIndex: "username" },
              {
                title: "权限",
                dataIndex: "role",
                render: (v: string) => (
                  <Tag color="blue">
                    {v === "owner" ? "所有者" : "运营管理员"}
                  </Tag>
                ),
              },
              {
                title: "状态",
                dataIndex: "is_disabled",
                render: (v: number) => (
                  <Tag color={v ? "red" : "green"}>{v ? "停用" : "正常"}</Tag>
                ),
              },
              {
                title: "最近登录",
                dataIndex: "last_login_time",
                render: formatDate,
              },
              {
                title: "创建时间",
                dataIndex: "create_time",
                render: formatDate,
              },
              {
                title: "操作",
                render: (_: unknown, row: AdminAccount) =>
                  row.id === currentId ? (
                    <span className="muted">当前账户</span>
                  ) : (
                    <Button
                      type={row.is_disabled ? "primary" : "danger"}
                      onClick={() => {
                        setTarget(row);
                        setError("");
                      }}
                    >
                      {row.is_disabled ? "恢复" : "停用"}
                    </Button>
                  ),
              },
            ]}
          />
        )}
      </Card>
      <Modal
        visible={create || Boolean(target)}
        title={
          target
            ? target.is_disabled
              ? "恢复管理员"
              : "停用管理员"
            : "新增管理员"
        }
        onOk={submit}
        confirmLoading={busy}
        okText="确认"
        cancelText="取消"
        cancelButtonProps={{ disabled: busy }}
        closable={!busy}
        maskClosable={!busy}
        onCancel={() => {
          if (!busy) {
            setCreate(false);
            setTarget(undefined);
            setPassword("");
          }
        }}
      >
        {target ? (
          <p>
            {target.is_disabled ? "恢复" : "停用"}{" "}
            <strong>{target.username}</strong>{" "}
            的后台访问权限。此操作会撤销该账户现有管理会话。
          </p>
        ) : (
          <div className="login-form">
            <label>用户名</label>
            <Input
              aria-label="新管理员用户名"
              value={username}
              onChange={setUsername}
              placeholder="3–40 位字母、数字、下划线或短横线"
            />
            <label>初始密码</label>
            <Input
              aria-label="新管理员密码"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={setPassword}
              placeholder="至少 12 位，包含三类字符"
            />
            <label>权限</label>
            <Select
              value={role}
              onChange={(v) => setRole(String(v))}
              optionList={[
                { label: "运营管理员：管理用户与数据", value: "operator" },
                { label: "所有者：同时可管理管理员", value: "owner" },
              ]}
            />
          </div>
        )}
        {error && (
          <Banner
            type="danger"
            description={error}
            closeIcon={null}
            fullMode={false}
          />
        )}
      </Modal>
    </>
  );
}
export function SecurityPage({
  actor,
  onSignedOut,
}: {
  actor: Actor;
  onSignedOut: () => void;
}) {
  const state = useData<AdminSession[]>("/sessions");
  const [password, setPassword] = useState(false);
  const [revoke, setRevoke] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit() {
    setBusy(true);
    setError("");
    try {
      if (password) {
        await api("/password", {
          currentPassword: current,
          newPassword: next,
          confirmPassword: confirm,
        });
        setPassword(false);
        setCurrent("");
        setNext("");
        setConfirm("");
        onSignedOut();
        Toast.success("密码已修改，请重新登录");
      } else {
        await api("/sessions/revoke-others", {});
        setRevoke(false);
        state.reload();
        Toast.success("其他会话已退出");
      }
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageTitle
        title="账户安全"
        subtitle="管理自己的登录密码与后台会话。"
        onRefresh={state.reload}
      />
      <Card title="我的账户">
        <Descriptions
          align="left"
          data={[
            { key: "用户名", value: actor.username },
            {
              key: "权限",
              value: actor.role === "owner" ? "所有者" : "运营管理员",
            },
          ]}
        />
        <Button
          onClick={() => {
            setPassword(true);
            setError("");
          }}
        >
          修改密码
        </Button>
      </Card>
      <Card
        title="登录会话"
        style={{ marginTop: 24 }}
        headerExtraContent={
          <Button
            onClick={() => {
              setRevoke(true);
              setError("");
            }}
          >
            退出其他设备
          </Button>
        }
      >
        <DataState {...state} />
        {!state.error && (
          <Table
            loading={state.loading}
            dataSource={state.data || []}
            rowKey="id"
            pagination={false}
            scroll={{ x: 700 }}
            columns={[
              {
                title: "会话",
                render: (_: unknown, row: AdminSession) => (
                  <Tag color={row.current ? "green" : "grey"}>
                    {row.current ? "当前设备" : "其他设备"}
                  </Tag>
                ),
              },
              { title: "浏览器", dataIndex: "user_agent", width: 300 },
              {
                title: "登录时间",
                dataIndex: "created_at",
                render: (v: number) =>
                  formatDate(new Date(v * 1000).toISOString()),
              },
              {
                title: "有效期至",
                dataIndex: "expires_at",
                render: (v: number) =>
                  formatDate(new Date(v * 1000).toISOString()),
              },
            ]}
          />
        )}
      </Card>
      <Modal
        visible={password || revoke}
        title={password ? "修改密码" : "退出其他设备"}
        onOk={submit}
        confirmLoading={busy}
        okText="确认"
        cancelText="取消"
        cancelButtonProps={{ disabled: busy }}
        closable={!busy}
        maskClosable={!busy}
        onCancel={() => {
          if (!busy) {
            setPassword(false);
            setRevoke(false);
            setCurrent("");
            setNext("");
            setConfirm("");
          }
        }}
      >
        {password ? (
          <div className="login-form">
            <p className="muted">修改后所有后台会话都会失效，需要重新登录。</p>
            <label>当前密码</label>
            <Input
              type="password"
              aria-label="当前密码"
              autoComplete="current-password"
              value={current}
              onChange={setCurrent}
            />
            <label>新密码</label>
            <Input
              type="password"
              aria-label="新密码"
              autoComplete="new-password"
              value={next}
              onChange={setNext}
            />
            <label>确认新密码</label>
            <Input
              type="password"
              aria-label="确认新密码"
              autoComplete="new-password"
              value={confirm}
              onChange={setConfirm}
            />
          </div>
        ) : (
          <p>撤销其他设备的后台登录会话，保留当前会话。</p>
        )}
        {error && (
          <Banner
            type="danger"
            description={error}
            closeIcon={null}
            fullMode={false}
          />
        )}
      </Modal>
    </>
  );
}
