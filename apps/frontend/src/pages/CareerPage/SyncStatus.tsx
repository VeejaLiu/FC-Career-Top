import {
  normalizeLanguage,
  LANGUAGE_LOCAL_STORAGE_KEY,
} from '../../common/language';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { activeCareer, Career } from '../../service/CareerApis';
import { careerCopy } from './copy';
import './career.css';
export function SyncStatus({
  career,
  demo = false,
}: {
  career?: Career;
  demo?: boolean;
}) {
  const t = careerCopy(),
    navigate = useNavigate(),
    waiting = useRef<boolean | null>(null);
  const [data, setData] = useState(career),
    [error, setError] = useState(false);
  useEffect(() => {
    if (career) {
      setData(career);
      return;
    }
    let live = true;
    const load = () => {
      if (document.hidden) return;
      activeCareer()
        .then((c) => {
          if (live) {
            if (waiting.current === true && c.last_upload) navigate('/players');
            waiting.current = !c.last_upload;
            setData(c);
            setError(false);
          }
        })
        .catch(() => {
          if (live) setError(true);
        });
    };
    load();
    const timer = setInterval(load, 5000);
    window.addEventListener('fct-snapshot-saved', load);
    return () => {
      live = false;
      clearInterval(timer);
      window.removeEventListener('fct-snapshot-saved', load);
    };
  }, [career, navigate]);
  const language = normalizeLanguage(
    localStorage.getItem(LANGUAGE_LOCAL_STORAGE_KEY) || navigator.language,
  );
  const problem = data?.last_error;
  const hint =
    problem && /older snapshot|earlier save/i.test(problem)
      ? t.olderHint
      : problem && /archived/i.test(problem)
        ? t.archivedHint
        : t.failedHint;
  const last = data?.last_upload
    ? new Date(data.last_upload.replace(' ', 'T') + 'Z')
    : null;
  return (
    <section
      className={`career-sync ${problem ? 'has-error' : ''}`}
      aria-live="polite"
    >
      <div className="career-section-heading">
        <div className="career-sync-title">
          <span className="career-status-dot" />
          <h2>
            {problem
              ? t.error
              : data?.is_archived
                ? t.archive
                : data?.last_upload
                  ? t.connected
                  : t.waiting}
          </h2>
        </div>
        <strong className="career-sync-name" title={data?.name}>
          {data?.name}
        </strong>
      </div>
      {error && <p role="alert">{t.failed}</p>}
      {data?.last_upload && (
        <dl className="career-metrics">
          <div>
            <dt>{t.date}</dt>
            <dd>{data.last_game_date || '—'}</dd>
          </div>
          <div>
            <dt>{t.players}</dt>
            <dd>{data.player_count}</dd>
          </div>
          <div>
            <dt>{t.last}</dt>
            <dd title={last!.toLocaleString(language)}>
              {last!.toLocaleString(language, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                ...(last!.getFullYear() !== new Date().getFullYear()
                  ? { year: 'numeric' }
                  : {}),
              })}
            </dd>
          </div>
        </dl>
      )}
      {!data?.last_upload && <p className="career-note">{t.pending}</p>}
      {problem && <p role="alert">{hint}</p>}
      <div className="career-section-heading career-sync-footer">
        <details className="career-help">
          <summary>{t.connectionHelp}</summary>
          <p>{t.stale}</p>
          <p>{t.setupHelp}</p>
          <p>
            {t.script}: {data?.script_version || t.notRecorded}
          </p>
          {problem && <small>{problem}</small>}
        </details>
        {demo ? (
          <a href="#career-compare">{t.current} →</a>
        ) : data?.last_upload ? (
          <Link to="/players">{t.current} →</Link>
        ) : career ? (
          <Link className="career-setup-link" to="/get-started">
            {t.setup} →
          </Link>
        ) : null}
      </div>
      {!demo && data?.last_upload && data.script_version !== '2026.10.17.1' && (
        <Link className="career-script-update" to="/get-started">
          {t.newer} →
        </Link>
      )}
    </section>
  );
}
