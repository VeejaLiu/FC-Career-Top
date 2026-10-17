export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
export async function api<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`/api/v1/admin${path}`, {
    method: body === undefined ? "GET" : "POST",
    credentials: "same-origin",
    headers: {
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const result = await response
    .json()
    .catch(() => ({ message: "服务暂时不可用，请稍后重试" }));
  if (!response.ok || !result.success) {
    if (response.status === 401 && path !== "/login") {
      window.dispatchEvent(new Event("admin-session-expired"));
    }
    throw new ApiError(result.message || "请求失败", response.status);
  }
  return result.data;
}
export interface Actor {
  id: number;
  username: string;
  role: "owner" | "operator";
}
export interface User {
  id: number;
  username: string;
  email: string;
  is_disabled: number;
  create_time: string;
  update_time: string;
  player_count: number;
}
export interface UserDetail extends User {
  versions: { game_version: number; players: number; latest_upload: string }[];
  settings: {
    default_game_version: number;
    enable_notification: number;
  } | null;
  snapshots: number;
}
export interface Player {
  id: number;
  user_id: number;
  user_email: string;
  game_version: number;
  player_id: number;
  player_name: string;
  overallrating: number;
  potential: number;
  is_archived: number;
  update_time: string;
}
export interface PlayerDetail extends Player {
  age: number;
  nationality: string;
  height: number;
  weight: number;
  history: { in_game_date: string; overallrating: number; potential: number }[];
  historyTotal: number;
}
export interface Audit {
  id: number;
  actor_username: string;
  action: string;
  target_type: "user" | "administrator" | "session" | null;
  target_id: string | null;
  create_time: string;
}
export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
export interface LuaError {
  id: number;
  user_id: number;
  user_username: string;
  game_version: number;
  script_version: string;
  editor_version: string;
  stage: string;
  message: string;
  traceback: string;
  event_id: number | null;
  http_status: number | null;
  career_date: string | null;
  occurrences: number;
  first_seen: string;
  last_seen: string;
}
export interface Overview {
  users: number;
  disabledUsers: number;
  newUsers: number;
  uploadingUsers: number;
  players: number;
  snapshots: number;
  latestUpload: string | null;
  versions: { game_version: number; players: number; users: number }[];
  daily: { date: string; count: number }[];
}
export const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "请求失败";
export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(
    value.includes("T") ? value : value.replace(" ", "T") + "Z",
  );
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("zh-CN", { hour12: false });
}
