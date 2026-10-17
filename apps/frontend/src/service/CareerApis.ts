import { BACKEND_URL } from '../constant';
import { getDefaultGameVersion, getToken } from '../common/common';
import type { PlayerOverall, PlayerTrend } from './PlayerApis';

export interface Career {
  id: number;
  name: string;
  game_version: number;
  is_legacy: number;
  is_archived: number;
  last_upload: string | null;
  last_game_date: string | null;
  player_count: number;
  script_version: string | null;
  editor_version: string | null;
  last_attempt: string | null;
  last_error: string | null;
}
export interface CareerPlayer extends PlayerOverall {
  archived: boolean;
  watched: boolean;
  baselineDate: string | null;
  observedOn: string;
  overallChange: number | null;
  potentialChange: number | null;
  attributes: Record<string, number | string | null>;
}
export interface Summary {
  career: Career;
  period: string;
  start: string | null;
  end: string | null;
  players: CareerPlayer[];
}
export interface HistoryPoint extends PlayerTrend {
  attributes: Record<string, number | string | null> | null;
}
export function selectedCareer(version: number) {
  return localStorage.getItem(`fct-career-${version}`);
}
export function careerQuery(version: number) {
  const id = selectedCareer(version);
  return id ? `&careerId=${encodeURIComponent(id)}` : '';
}
export function selectCareer(version: number, id: number) {
  localStorage.setItem(`fct-career-${version}`, String(id));
}
export async function careerRequest<T>(path = '', body?: unknown): Promise<T> {
  const version = await getDefaultGameVersion();
  const response = await fetch(
    `${BACKEND_URL}/api/v1/careers${path}${path.includes('?') ? '&' : '?'}gameVersion=${version}`,
    {
      method: body === undefined ? 'GET' : 'POST',
      headers: { token: getToken() || '', 'Content-Type': 'application/json' },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    },
  );
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Please try again');
  return result;
}
export async function activeCareer(): Promise<Career> {
  const version = await getDefaultGameVersion();
  const list = await careerRequest<Career[]>();
  const current =
    list.find((c) => String(c.id) === selectedCareer(version)) ||
    list.find((c) => c.is_legacy) ||
    list[0];
  selectCareer(version, current.id);
  return current;
}
