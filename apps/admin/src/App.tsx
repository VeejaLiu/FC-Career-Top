import {GrowthPage} from './GrowthPage';
import { useEffect, useState } from "react";
import {
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import {
  Avatar,
  Banner,
  Button,
  Card,
  Input,
  Spin,
  Tag,
  Toast,
} from "@douyinfe/semi-ui";
import {
  IconHome,
  IconUserGroup,
  IconList,
  IconHistory,
  IconSetting,
  IconExit,
} from "@douyinfe/semi-icons";
import { Actor, api, errorMessage, ApiError } from "./api";
import { OverviewPage, SystemPage } from "./OverviewPage";
import { UsersPage } from "./UsersPage";
import { PlayersPage } from "./PlayersPage";
import { AuditPage } from "./AuditPage";
import { LuaErrorsPage } from "./LuaErrorsPage";
import { AdministratorsPage, SecurityPage } from "./AdministratorsPage";
const navigation = [
  {path:"/growth",label:"接入与上传",icon:<IconHistory/>},
  { path: "/", label: "数据概览", icon: <IconHome /> },
  { path: "/users", label: "用户管理", icon: <IconUserGroup /> },
  { path: "/players", label: "球员数据", icon: <IconList /> },
  { path: "/lua-errors", label: "脚本错误", icon: <IconHistory /> },
  { path: "/audit", label: "操作日志", icon: <IconHistory /> },
  { path: "/administrators", label: "管理员管理", icon: <IconUserGroup /> },
  { path: "/security", label: "账户安全", icon: <IconSetting /> },
  { path: "/system", label: "系统状态", icon: <IconSetting /> },
];
function Login({ onLogin }: { onLogin: (actor: Actor) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  async function submit(values: Record<string, unknown>) {
    setBusy(true);
    setError("");
    try {
      const result = await api<Actor>("/login", values);
      onLogin(result);
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="login-page">
      <div className="login-intro">
        <img src="/logo.svg" alt="FC Career Top" />
        <span className="eyebrow">FC CAREER TOP / ADMIN</span>
        <h1>
          每一次成长，
          <br />
          都值得被看见。
        </h1>
        <p>
          在这里了解用户、查看球员数据，
          <br />
          让每一段经理生涯顺畅运行。
        </p>
        <div className="intro-note">EA FC 24 — 27 · 运营管理中心</div>
      </div>
      <div className="login-panel">
        <Card className="login-card">
          <Tag color="blue">管理后台</Tag>
          <h2>欢迎回来</h2>
          <p className="muted">使用已获授权的管理员账户登录</p>
          {error && (
            <Banner
              type="danger"
              description={error}
              closeIcon={null}
              fullMode={false}
            />
          )}
          <form
            className="login-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (!username || !password) {
                setError("请输入用户名和密码");
                return;
              }
              void submit({ username, password });
            }}
          >
            <label htmlFor="admin-username">用户名</label>
            <Input
              id="admin-username"
              value={username}
              onChange={setUsername}
              placeholder="请输入用户名，例如 admin"
              autoComplete="username"
            />
            <label htmlFor="admin-password">密码</label>
            <Input
              id="admin-password"
              value={password}
              onChange={setPassword}
              type="password"
              autoComplete="current-password"
            />
            <Button
              htmlType="submit"
              theme="solid"
              block
              loading={busy}
              size="large"
            >
              登录管理后台
            </Button>
          </form>
          <p className="login-footnote">
            仅限授权管理员。需要权限时请联系项目维护者。
          </p>
        </Card>
      </div>
    </div>
  );
}
export function App() {
  const [actor, setActor] = useState<Actor | null>(null);
  const [checking, setChecking] = useState(true);
  const [checkError, setCheckError] = useState("");
  const [retry, setRetry] = useState(0);
  const location = useLocation();
  useEffect(() => {
    sessionStorage.removeItem("fc-admin-token");
    let alive = true;
    const expired = () => {
      setActor(null);
      setChecking(false);
    };
    window.addEventListener("admin-session-expired", expired);
    {
      setChecking(true);
      setCheckError("");
      api<Actor>("/me")
        .then((user) => {
          if (alive) setActor(user);
        })
        .catch((error) => {
          if (alive && !(error instanceof ApiError && error.status === 401))
            setCheckError(errorMessage(error));
        })
        .finally(() => {
          if (alive) setChecking(false);
        });
    }
    return () => {
      alive = false;
      window.removeEventListener("admin-session-expired", expired);
    };
  }, [retry]);
  async function logout() {
    try {
      await api("/logout", {});
      setActor(null);
    } catch (error) {
      Toast.error(errorMessage(error));
    }
  }
  if (checking)
    return (
      <div className="app-loading">
        <Spin size="large" tip="正在验证管理员权限…" />
      </div>
    );
  if (checkError)
    return (
      <div className="app-loading">
        <Banner type="danger" description={checkError} />
        <Button onClick={() => setRetry((v) => v + 1)}>重试</Button>
      </div>
    );
  if (!actor) return <Login onLogin={setActor} />;
  const current =
    navigation.find((item) => item.path === location.pathname)?.label ||
    "管理后台";
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <img src="/logo.svg" alt="" />
          <div>
            <strong>FC Career Top</strong>
            <small>ADMIN CONSOLE</small>
          </div>
        </div>
        <div className="nav-label">工作空间</div>
        <nav>
          {navigation
            .filter(
              (item) =>
                item.path !== "/administrators" || actor.role === "owner",
            )
            .map((item) => (
              <NavLink key={item.path} to={item.path} end={item.path === "/"}>
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
        </nav>
        <div className="sidebar-bottom">
          <span className="status-dot" /> 生涯数据管理中心
          <small>FC 24 / 25 / 26 / 27</small>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <span>
            工作空间 <span className="breadcrumb">/</span>{" "}
            <strong>{current}</strong>
          </span>
          <div className="account">
            <Tag color="blue">管理员</Tag>
            <Avatar size="small" color="blue">
              {actor.username.slice(0, 1).toUpperCase()}
            </Avatar>
            <span className="account-email">{actor.username}</span>
            <Button icon={<IconExit />} aria-label="退出登录" onClick={logout}>
              退出
            </Button>
          </div>
        </header>
        <main>
          <Routes>
          <Route path="/growth" element={<GrowthPage />} />
            <Route path="/" element={<OverviewPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/lua-errors" element={<LuaErrorsPage />} />
            <Route path="/audit" element={<AuditPage />} />
            <Route
              path="/administrators"
              element={
                actor.role === "owner" ? (
                  <AdministratorsPage currentId={actor.id} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/security"
              element={
                <SecurityPage
                  actor={actor}
                  onSignedOut={() => setActor(null)}
                />
              }
            />
            <Route path="/system" element={<SystemPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer>
          FC Career Top · 管理后台<span>让成长有迹可循</span>
        </footer>
      </div>
    </div>
  );
}
