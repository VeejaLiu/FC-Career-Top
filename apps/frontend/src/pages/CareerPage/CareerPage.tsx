import { languageOptions } from '../../common/language-options';
import {
  normalizeLanguage,
  LANGUAGE_LOCAL_STORAGE_KEY,
} from '../../common/language';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDefaultGameVersion } from '../../common/common';
import {
  activeCareer,
  careerRequest,
  selectCareer,
  Summary,
  CareerPlayer,
} from '../../service/CareerApis';
import { useAsyncResource } from '../../hooks/useAsyncResource';
import { SyncStatus } from './SyncStatus';
import { careerCopy } from './copy';
import { demoSummary } from './demo';
import { growthCard } from './share';
import { ComparePanel } from './ComparePanel';
import { PlayerIdentity } from './PlayerIdentity';
import { History } from './History';
import './career.css';

const diff = (value: number | null) =>
  value == null ? '—' : `${value > 0 ? '+' : ''}${value}`;
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
    [onlyWatch, setOnlyWatch] = useState(false);
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
    visible = current.filter((p) => !onlyWatch || p.watched);
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
                    <summary title={t.statsHelp}>{t.statsHelp}</summary>
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
                                  <a
                                    className="career-player-name"
                                    href={
                                      demo
                                        ? `/demo?playerId=${p.playerID}#career-history`
                                        : `/players-detail?id=${p.playerID}&view=history`
                                    }
                                  >
                                    <PlayerIdentity player={p} />
                                  </a>
                                  <div
                                    className="career-rating-journey"
                                    title={`${p.baselineDate} → ${p.observedOn}`}
                                  >
                                    <span>
                                      {(field === 'overallChange'
                                        ? p.overallRating
                                        : p.potential) - p[field]!}{' '}
                                      <span aria-hidden="true">→</span>
                                    </span>
                                    <b>
                                      {field === 'overallChange'
                                        ? p.overallRating
                                        : p.potential}
                                    </b>
                                    <strong
                                      className={
                                        p[field]! < 0
                                          ? 'is-negative'
                                          : p[field] === 0
                                            ? 'is-neutral'
                                            : ''
                                      }
                                    >
                                      {diff(p[field])}
                                    </strong>
                                  </div>
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
                <ComparePanel
                  players={players}
                  selected={selected}
                  onSelect={setSelected}
                  onWatch={(player) => void watch(player)}
                  demo={demo}
                />
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
                          href={
                            demo
                              ? `/demo?playerId=${p.playerID}#career-history`
                              : `/players-detail?id=${p.playerID}&view=history`
                          }
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
