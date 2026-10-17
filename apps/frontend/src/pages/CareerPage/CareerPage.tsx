import { languageOptions } from '../../common/language-options';
import { featureLabel } from '../../constant/player-features';
import {
  normalizeLanguage,
  LANGUAGE_LOCAL_STORAGE_KEY,
} from '../../common/language';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LocaleConsumer } from '@douyinfe/semi-ui';
import { BACKEND_URL } from '../../constant';
import { getDefaultGameVersion, getToken } from '../../common/common';
import {
  activeCareer,
  careerRequest,
  selectCareer,
  Summary,
  HistoryPoint,
  CareerPlayer,
} from '../../service/CareerApis';
import { useAsyncResource } from '../../hooks/useAsyncResource';
import { PlayerTrendChart } from '../../components/PlayerTrendChart';
import { SyncStatus } from './SyncStatus';
import { careerCopy } from './copy';
import { demoSummary, demoHistory } from './demo';
import { growthCard } from './share';
import './career.css';

const attributes = [
  ['acceleration', 'Acceleration'],
  ['sprintspeed', 'SprintSpeed'],
  ['finishing', 'Finishing'],
  ['shortpassing', 'ShortPass'],
  ['dribbling', 'Dribbling'],
  ['standingtackle', 'StandingTackle'],
  ['stamina', 'Stamina'],
  ['gkreflexes', 'GKReflexes'],
] as const;
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
  value == null ? '—' : `${value >= 0 ? '+' : ''}${value}`;
const pretty = (value: unknown) => (value == null ? '—' : String(value));
async function loadHistory(data: Summary, id: number) {
  const response = await fetch(
    `${BACKEND_URL}/api/v1/player/detail/${id}?gameVersion=${data.career.game_version}&careerId=${data.career.id}&includeArchived=true`,
    { headers: { token: getToken() || '' } },
  );
  if (!response.ok) throw new Error('History unavailable');
  const result = await response.json();
  return (result?.history || []) as HistoryPoint[];
}
function History({ data, demo }: { data: Summary; demo: boolean }) {
  const t = careerCopy();
  const [id, setId] = useState(
    data.players.find(
      (p) =>
        p.playerID ===
        Number(new URLSearchParams(window.location.search).get('playerId')),
    )?.playerID ||
      data.players[0]?.playerID ||
      0,
  );
  const [from, setFrom] = useState(''),
    [to, setTo] = useState(''),
    [onlyChanges, setOnlyChanges] = useState(true);
  const loader = useCallback(
    () => (demo ? Promise.resolve(demoHistory(id)) : loadHistory(data, id)),
    [
      data.career.id,
      data.career.last_upload,
      data.career.last_game_date,
      id,
      demo,
    ],
  );
  const {
    data: history,
    loading,
    error,
    reload,
  } = useAsyncResource(loader, !!id);
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

type Pane = 'overview' | 'compare' | 'history' | 'share';
function paneFromHash(): Pane {
  const hash = window.location.hash;
  return hash === '#career-history'
    ? 'history'
    : hash === '#career-compare'
      ? 'compare'
      : hash === '#career-share'
        ? 'share'
        : 'overview';
}
export default function CareerPage({ demo = false }: { demo?: boolean }) {
  const t = careerCopy();
  const [pane, setPane] = useState<Pane>(paneFromHash),
    [period, setPeriod] = useState('month'),
    [selected, setSelected] = useState<number[]>([]),
    [onlyWatch, setOnlyWatch] = useState(false),
    [search, setSearch] = useState('');
  const [form, setForm] = useState<'create' | 'rename' | null>(null),
    [name, setName] = useState(''),
    [actionError, setActionError] = useState(''),
    [busy, setBusy] = useState(false),
    [card, setCard] = useState(''),
    [sharePlayer, setSharePlayer] = useState('');
  const [demoWatches, setDemoWatches] = useState<number[]>(() => {
    try {
      return JSON.parse(sessionStorage.getItem('fct-demo-watch') || '[990000]');
    } catch {
      return [990000];
    }
  });
  const loader = useCallback(
    async () =>
      demo
        ? demoSummary(period)
        : careerRequest<Summary>(
            `/${(await activeCareer()).id}/summary?period=${period}`,
          ),
    [demo, period],
  );
  const { data, loading, error, reload } = useAsyncResource(loader, true, true);
  useEffect(() => {
    const change = () => setPane(paneFromHash());
    window.addEventListener('hashchange', change);
    return () => window.removeEventListener('hashchange', change);
  }, []);
  useEffect(() => {
    if (demo) return;
    const timer = setInterval(() => {
      if (!document.hidden) reload();
    }, 30000);
    return () => clearInterval(timer);
  }, [demo, reload]);
  const choosePane = (next: Pane) => {
    setPane(next);
    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}${window.location.search}#career-${next}`,
    );
  };
  async function changeCareer(kind: 'create' | 'rename' | 'archive') {
    if (!data || busy) return;
    setBusy(true);
    setActionError('');
    try {
      if (kind === 'create') {
        const result = await careerRequest<Summary['career']>('', { name });
        selectCareer(await getDefaultGameVersion(), result.id);
        window.location.assign('/get-started');
      } else {
        await careerRequest(
          `/${data.career.id}`,
          kind === 'rename' ? { name } : { archived: !data.career.is_archived },
        );
        window.location.reload();
      }
    } catch (e) {
      setActionError(e instanceof Error ? e.message : t.failed);
      setBusy(false);
    }
  }
  async function watch(player: CareerPlayer) {
    try {
      if (demo) {
        const next = demoWatches.includes(player.playerID)
          ? demoWatches.filter((id) => id !== player.playerID)
          : [...demoWatches, player.playerID];
        setDemoWatches(next);
        sessionStorage.setItem('fct-demo-watch', JSON.stringify(next));
      } else {
        await careerRequest(`/${data!.career.id}/watch`, {
          playerId: player.playerID,
          watched: !player.watched,
        });
        reload();
      }
    } catch {
      setActionError(t.failed);
    }
  }
  const players =
    data?.players.map((p) =>
      demo ? { ...p, watched: demoWatches.includes(p.playerID) } : p,
    ) || [];
  const current = players.filter((p) => !p.archived),
    visible = current.filter((p) => !onlyWatch || p.watched),
    candidates = current.filter((p) =>
      p.playerName.toLowerCase().includes(search.trim().toLowerCase()),
    ),
    comparisons = players.filter((p) => selected.includes(p.playerID));
  const periodLabel =
    period === 'month' ? t.month : period === 'season' ? t.season : t.all;
  const ranking = (field: 'overallChange' | 'potentialChange') =>
    visible
      .filter((p) => p[field] != null)
      .sort((a, b) => (b[field] ?? 0) - (a[field] ?? 0))
      .slice(0, 5);
  useEffect(() => {
    if (pane !== 'share' || !data || loading) return;
    try {
      setCard(growthCard(data, periodLabel, Number(sharePlayer) || undefined));
    } catch {
      setActionError(t.failed);
    }
  }, [pane, data, loading, sharePlayer, periodLabel, t.failed]);
  const periodControl = (
    <select
      aria-label={t.change}
      value={period}
      onChange={(e) => {
        setSharePlayer('');
        setCard('');
        setPeriod(e.target.value);
      }}
    >
      <option value="month">{t.month}</option>
      <option value="season">{t.season}</option>
      <option value="all">{t.all}</option>
    </select>
  );
  return (
    <div className="page-container career-page">
      {demo && (
        <div className="career-demo-banner">
          <span>{t.demoNotice}</span>
          <div className="career-controls">
            <select
              aria-label="Language"
              value={normalizeLanguage(
                localStorage.getItem(LANGUAGE_LOCAL_STORAGE_KEY) ||
                  navigator.language,
              )}
              onChange={(e) => {
                localStorage.setItem(
                  LANGUAGE_LOCAL_STORAGE_KEY,
                  e.target.value,
                );
                window.location.reload();
              }}
            >
              {languageOptions.map((l) => (
                <option key={l.key} value={l.key}>
                  {l.label}
                </option>
              ))}
            </select>
            <a href="/">{t.exit} →</a>
          </div>
        </div>
      )}
      <div className="career-section-heading career-page-heading">
        <div>
          <span className="career-eyebrow">FC CAREER TOP</span>
          <h1>{t.title}</h1>
        </div>
        <div className="career-controls">
          <button onClick={reload}>{t.refresh}</button>
          {!demo && (
            <button
              className="career-primary"
              onClick={() => {
                setForm('create');
                setName('');
              }}
            >
              {t.create}
            </button>
          )}
        </div>
      </div>
      {error && <p role="alert">{t.failed}</p>}
      {loading && !data && <p role="status">{t.loading}</p>}
      {actionError && <p role="alert">{actionError}</p>}
      {data && (
        <>
          <SyncStatus career={data.career} demo={demo} />
          {!demo && (
            <details className="career-manage">
              <summary>{t.manage}</summary>
              <div className="career-controls">
                <Link to="/get-started">{t.setup}</Link>
                <button
                  disabled={busy}
                  onClick={() => {
                    setForm('rename');
                    setName(data.career.name);
                  }}
                >
                  {t.rename}
                </button>
                <button
                  disabled={busy}
                  onClick={() => void changeCareer('archive')}
                >
                  {data.career.is_archived ? t.restore : t.archive}
                </button>
              </div>
              <p className="career-note">{t.caution}</p>
            </details>
          )}
          {form && (
            <form
              className="career-panel career-controls"
              onSubmit={(e) => {
                e.preventDefault();
                void changeCareer(form);
              }}
            >
              <label>
                {t.name}
                <input
                  autoFocus
                  required
                  maxLength={80}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <button
                className="career-primary"
                disabled={busy || !name.trim()}
                type="submit"
              >
                {t.save}
              </button>
              <button type="button" onClick={() => setForm(null)}>
                {t.cancel}
              </button>
            </form>
          )}
          {!!players.length && (
            <>
              <nav className="career-tabs" aria-label={t.title}>
                {(
                  [
                    ['overview', t.overview],
                    ['compare', t.compareNav],
                    ['history', t.historyNav],
                    ['share', t.shareNav],
                  ] as [Pane, string][]
                ).map(([key, label]) => (
                  <button
                    key={key}
                    aria-pressed={pane === key}
                    onClick={() => choosePane(key)}
                  >
                    {label}
                  </button>
                ))}
              </nav>
              {(pane === 'overview' ||
                pane === 'compare' ||
                pane === 'share') && (
                <div className="career-section-heading career-period">
                  <div className="career-controls">
                    {periodControl}
                    {pane === 'overview' && (
                      <label>
                        <input
                          type="checkbox"
                          checked={onlyWatch}
                          onChange={(e) => setOnlyWatch(e.target.checked)}
                        />
                        {t.watchOnly}
                      </label>
                    )}
                  </div>
                  <details className="career-help">
                    <summary>{t.statsHelp}</summary>
                    <p>{t.baseline}</p>
                  </details>
                </div>
              )}
              {pane === 'overview' && (
                <>
                  <div className="career-grid">
                    {(['overallChange', 'potentialChange'] as const).map(
                      (field) => (
                        <section className="career-panel" key={field}>
                          <h2>
                            {field === 'overallChange' ? t.growth : t.potential}
                          </h2>
                          {ranking(field).length ? (
                            <ol className="career-ranking">
                              {ranking(field).map((p) => (
                                <li key={p.playerID}>
                                  <span>
                                    <a
                                      className="career-player-name"
                                      href={`${demo ? '/demo' : '/career'}?playerId=${p.playerID}#career-history`}
                                    >
                                      {p.playerName}
                                    </a>
                                    <small>
                                      {p.position1} ·{' '}
                                      {p.baselineDate?.slice(0, 4) ===
                                      p.observedOn.slice(0, 4)
                                        ? p.baselineDate?.slice(5)
                                        : p.baselineDate}{' '}
                                      →{' '}
                                      {p.baselineDate?.slice(0, 4) ===
                                      p.observedOn.slice(0, 4)
                                        ? p.observedOn.slice(5)
                                        : p.observedOn}
                                    </small>
                                  </span>
                                  <strong
                                    style={{
                                      color:
                                        p[field]! < 0
                                          ? 'var(--semi-color-danger)'
                                          : 'var(--semi-color-success)',
                                    }}
                                  >
                                    {diff(p[field])}
                                  </strong>
                                </li>
                              ))}
                            </ol>
                          ) : (
                            <p className="career-empty">
                              {onlyWatch ? t.watchEmpty : t.insufficient}
                            </p>
                          )}
                        </section>
                      ),
                    )}
                  </div>
                  <p className="career-note career-range">
                    {data.start || t.all} → {data.end}
                  </p>
                </>
              )}
              {pane === 'compare' && (
                <section id="career-compare" className="career-panel">
                  <div className="career-section-heading">
                    <h2>{t.compare}</h2>
                    <span className="career-count">{selected.length} / 3</span>
                  </div>
                  <input
                    className="career-search"
                    type="search"
                    aria-label={t.search}
                    placeholder={t.search}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <div className="career-player-options">
                    {candidates.map((p) => (
                      <div className="career-player-option" key={p.playerID}>
                        <label title={p.playerName}>
                          <input
                            type="checkbox"
                            checked={selected.includes(p.playerID)}
                            disabled={
                              !selected.includes(p.playerID) &&
                              selected.length >= 3
                            }
                            onChange={() =>
                              setSelected((ids) =>
                                ids.includes(p.playerID)
                                  ? ids.filter((id) => id !== p.playerID)
                                  : [...ids, p.playerID],
                              )
                            }
                          />
                          <span>{p.playerName}</span>
                        </label>
                        <button
                          type="button"
                          className="career-star"
                          aria-label={`${t.watch} ${p.playerName}`}
                          aria-pressed={p.watched}
                          onClick={() => void watch(p)}
                        >
                          {p.watched ? '★' : '☆'}
                        </button>
                      </div>
                    ))}
                  </div>
                  {comparisons.length > 0 && (
                    <LocaleConsumer componentName="PlayerDetailPage">
                      {(locale: any) => (
                        <div className="career-table-wrap">
                          <table>
                            <thead>
                              <tr>
                                <th>{t.attributes}</th>
                                {comparisons.map((p) => (
                                  <th key={p.playerID}>{p.playerName}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                [
                                  t.overall,
                                  (p: CareerPlayer) => p.overallRating,
                                ],
                                [t.pot, (p: CareerPlayer) => p.potential],
                                [
                                  t.change,
                                  (p: CareerPlayer) => diff(p.overallChange),
                                ],
                                ...attributes.map(([key, label]) => [
                                  locale.Attributes[label],
                                  (p: CareerPlayer) =>
                                    pretty(p.attributes[key]),
                                ]),
                              ].map(([label, value], i) => (
                                <tr key={i}>
                                  <th>{String(label)}</th>
                                  {comparisons.map((p) => (
                                    <td key={p.playerID}>
                                      {(
                                        value as (
                                          p: CareerPlayer,
                                        ) => string | number
                                      )(p)}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </LocaleConsumer>
                  )}
                </section>
              )}
              {pane === 'history' && <History data={data} demo={demo} />}
              {pane === 'history' && players.some((p) => p.archived) && (
                <details className="career-panel">
                  <summary>{t.archivePlayers}</summary>
                  <div className="career-controls">
                    {players
                      .filter((p) => p.archived)
                      .map((p) => (
                        <a
                          key={p.playerID}
                          href={`${demo ? '/demo' : '/career'}?playerId=${p.playerID}#career-history`}
                        >
                          {p.playerName}
                        </a>
                      ))}
                  </div>
                </details>
              )}
              {pane === 'share' && (
                <section className="career-panel career-share-panel">
                  <div className="career-section-heading">
                    <label>
                      {t.cardScope}
                      <select
                        value={sharePlayer}
                        onChange={(e) => setSharePlayer(e.target.value)}
                      >
                        <option value="">{t.wholeSquad}</option>
                        {current
                          .filter((p) => p.overallChange != null)
                          .map((p) => (
                            <option key={p.playerID} value={p.playerID}>
                              {p.playerName}
                            </option>
                          ))}
                      </select>
                    </label>
                    {card && (
                      <a
                        className="career-download career-primary"
                        href={card}
                        download="fc-career-growth.png"
                      >
                        {t.download}
                      </a>
                    )}
                  </div>
                  {card ? (
                    <div className="career-share">
                      <img src={card} alt={t.preview} />
                    </div>
                  ) : (
                    <p className="career-empty">{t.insufficient}</p>
                  )}
                  <details className="career-help">
                    <summary>{t.shareHelp}</summary>
                    <p>{t.shareHint}</p>
                  </details>
                </section>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
