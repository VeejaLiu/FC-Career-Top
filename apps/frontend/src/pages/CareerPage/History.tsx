import { useCallback, useEffect, useRef, useState } from 'react';
import { LocaleConsumer } from '@douyinfe/semi-ui';
import {
  normalizeLanguage,
  LANGUAGE_LOCAL_STORAGE_KEY,
} from '../../common/language';
import { featureLabel } from '../../constant/player-features';
import { BACKEND_URL } from '../../constant';
import { getToken } from '../../common/common';
import type { Summary, HistoryPoint } from '../../service/CareerApis';
import { useAsyncResource } from '../../hooks/useAsyncResource';
import { PlayerTrendChart } from '../../components/PlayerTrendChart';
import { careerCopy } from './copy';
import { demoHistory } from './demo';
import './career.css';
const attributeLabels: Record<string, string> = Object.fromEntries([
  ['acceleration', 'Acceleration'],
  ['sprintspeed', 'SprintSpeed'],
  ['positioning', 'AttackingPosition'],
  ['finishing', 'Finishing'],
  ['shotpower', 'ShotPower'],
  ['longshots', 'LongShots'],
  ['volleys', 'Volleys'],
  ['penalties', 'Penalties'],
  ['vision', 'Vision'],
  ['crossing', 'Crossing'],
  ['freekickaccuracy', 'FKAccuracy'],
  ['shortpassing', 'ShortPass'],
  ['longpassing', 'LongPass'],
  ['curve', 'Curve'],
  ['agility', 'Agility'],
  ['balance', 'Balance'],
  ['reactions', 'Reactions'],
  ['ballcontrol', 'BallControl'],
  ['dribbling', 'Dribbling'],
  ['composure', 'Composure'],
  ['interceptions', 'Interceptions'],
  ['headingaccuracy', 'HeadingAccuracy'],
  ['defensiveawareness', 'DefensiveAwareness'],
  ['standingtackle', 'StandingTackle'],
  ['slidingtackle', 'SlidingTackle'],
  ['jumping', 'Jumping'],
  ['stamina', 'Stamina'],
  ['strength', 'Strength'],
  ['aggression', 'Aggression'],
  ['gkdiving', 'GKDiving'],
  ['gkhandling', 'GKHandling'],
  ['gkkicking', 'GKKicking'],
  ['gkpositioning', 'GKPositioning'],
  ['gkreflexes', 'GKReflexes'],
]);
const positions = [
  'GK',
  'SW',
  'RWB',
  'RB',
  'RCB',
  'CB',
  'LCB',
  'LB',
  'LWB',
  'RDM',
  'CDM',
  'LDM',
  'RM',
  'RCM',
  'CM',
  'LCM',
  'LM',
  'RAM',
  'CAM',
  'LAM',
  'RF',
  'CF',
  'LF',
  'RW',
  'RS',
  'ST',
  'LS',
  'LW',
];
const diff = (value: number | null) =>
  value == null ? '—' : `${value > 0 ? '+' : ''}${value}`;
const pretty = (value: unknown) => (value == null ? '—' : String(value));
async function loadHistory(careerId: number, gameVersion: number, id: number) {
  const response = await fetch(
    `${BACKEND_URL}/api/v1/player/detail/${id}?gameVersion=${gameVersion}&careerId=${careerId}&includeArchived=true`,
    { headers: { token: getToken() || '' } },
  );
  if (!response.ok) throw new Error('History unavailable');
  const result = await response.json();
  return (result?.history || []) as HistoryPoint[];
}
export function History({
  data,
  demo = false,
  playerHistory,
  playerID,
}: {
  data?: Summary;
  demo?: boolean;
  playerHistory?: HistoryPoint[];
  playerID?: number;
}) {
  const t = careerCopy();
  const [id, setId] = useState(
    playerID ||
      data?.players.find(
        (p) =>
          p.playerID ===
          Number(new URLSearchParams(window.location.search).get('playerId')),
      )?.playerID ||
      data?.players[0]?.playerID ||
      0,
  );
  const [from, setFrom] = useState(''),
    [to, setTo] = useState(''),
    [onlyChanges, setOnlyChanges] = useState(true);
  const careerId = data?.career.id,
    gameVersion = data?.career.game_version;
  const loader = useCallback(
    () =>
      playerHistory
        ? Promise.resolve(playerHistory)
        : demo
          ? Promise.resolve(demoHistory(id))
          : loadHistory(careerId!, gameVersion!, id),
    [careerId, gameVersion, id, demo, playerHistory],
  );
  const {
    data: history,
    loading,
    error,
    reload,
  } = useAsyncResource(loader, !!id);
  const revision = `${careerId}:${data?.career.last_upload}:${data?.career.last_game_date}`;
  const previousRevision = useRef(revision);
  useEffect(() => {
    if (previousRevision.current !== revision) {
      previousRevision.current = revision;
      reload();
    }
  }, [revision, reload]);
  useEffect(() => {
    if (history?.length) {
      setFrom(history[0].inGameDate);
      setTo(history[history.length - 1].inGameDate);
    }
  }, [history]);
  const first = history?.find((h) => h.inGameDate === from),
    last = history?.find((h) => h.inGameDate === to);
  const value = (h: HistoryPoint | undefined, key: string) =>
    key === 'overallrating'
      ? h?.overallRating
      : key === 'potential'
        ? h?.potential
        : h?.attributes?.[key];
  const keys = Array.from(
    new Set([
      'overallrating',
      'potential',
      ...Object.keys(first?.attributes || {}),
      ...Object.keys(last?.attributes || {}),
    ]),
  ).filter(
    (key) =>
      (value(first, key) != null || value(last, key) != null) &&
      (!onlyChanges || value(first, key) !== value(last, key)),
  );
  const render = (key: string, v: unknown) =>
    key.startsWith('preferredposition') && typeof v === 'number'
      ? positions[v] || String(v)
      : key === 'skillmoves' && typeof v === 'number'
        ? `${v + 1} ★`
        : key === 'play_styles' && typeof v === 'string'
          ? JSON.parse(v)
              .map((style: string) =>
                featureLabel(
                  style,
                  normalizeLanguage(
                    localStorage.getItem(LANGUAGE_LOCAL_STORAGE_KEY) ||
                      navigator.language,
                  ),
                ),
              )
              .join(', ') || '—'
          : pretty(v);
  return (
    <section id="career-history" className="career-panel">
      <div className="career-section-heading">
        <h2>{t.history}</h2>
        {data && (
          <label>
            {t.players}{' '}
            <select value={id} onChange={(e) => setId(Number(e.target.value))}>
              {data.players.map((p) => (
                <option key={p.playerID} value={p.playerID}>
                  {p.playerName}
                  {p.archived ? ` · ${t.archivePlayers}` : ''}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      {loading && <p role="status">{t.loading}</p>}
      {error && (
        <p role="alert">
          {t.failed} <button onClick={reload}>{t.refresh}</button>
        </p>
      )}
      {history && history.length > 0 && (
        <>
          <PlayerTrendChart data={history} detailed height={250} />
          <div className="career-controls career-history-controls">
            <label>
              {t.from}
              <select
                value={from}
                onChange={(e) => {
                  const next = e.target.value;
                  setFrom(next);
                  if (next > to) setTo(next);
                }}
              >
                {history.map((h) => (
                  <option key={h.inGameDate}>{h.inGameDate}</option>
                ))}
              </select>
            </label>
            <label>
              {t.to}
              <select
                value={to}
                onChange={(e) => {
                  const next = e.target.value;
                  setTo(next);
                  if (next < from) setFrom(next);
                }}
              >
                {history.map((h) => (
                  <option key={h.inGameDate}>{h.inGameDate}</option>
                ))}
              </select>
            </label>
            <label>
              <input
                type="checkbox"
                checked={onlyChanges}
                onChange={(e) => setOnlyChanges(e.target.checked)}
              />
              {t.onlyChanges}
            </label>
          </div>
          {(!first?.attributes || !last?.attributes) && (
            <p className="career-note">{t.noHistory}</p>
          )}
          <LocaleConsumer componentName="PlayerDetailPage">
            {(locale: any) => (
              <div className="career-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>{t.field}</th>
                      <th>{t.from}</th>
                      <th>{t.to}</th>
                      <th>{t.difference}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keys.length ? (
                      keys.map((key) => {
                        const a = value(first, key),
                          b = value(last, key);
                        const label =
                          key === 'overallrating'
                            ? t.overall
                            : key === 'potential'
                              ? t.pot
                              : locale.Attributes[attributeLabels[key]] ||
                                (key.startsWith('preferredposition')
                                  ? `${t.position} ${key.slice(-1)}`
                                  : (
                                      {
                                        skillmoves: locale.BasicInfo.Skills,
                                        weakfootabilitytypecode:
                                          locale.BasicInfo.WeakFoot,
                                        play_styles: 'PlayStyles',
                                      } as Record<string, string>
                                    )[key]) ||
                                key;
                        return (
                          <tr key={key}>
                            <th>{label}</th>
                            <td>{render(key, a)}</td>
                            <td>{render(key, b)}</td>
                            <td className="career-delta">
                              {!key.startsWith('preferredposition') &&
                              typeof a === 'number' &&
                              typeof b === 'number'
                                ? diff(b - a)
                                : a != null && b != null && a !== b
                                  ? '→'
                                  : '—'}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="career-empty">
                          {history.length < 2 ? t.insufficient : t.noChanges}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </LocaleConsumer>
        </>
      )}
    </section>
  );
}
