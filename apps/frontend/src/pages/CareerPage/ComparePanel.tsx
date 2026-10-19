import { useEffect, useRef, useState } from 'react';
import { LocaleConsumer } from '@douyinfe/semi-ui';
import type { CareerPlayer } from '../../service/CareerApis';
import { careerCopy } from './copy';
import { careerUiCopy } from './ui-copy';
import { PlayerIdentity } from './PlayerIdentity';

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
export function ComparePanel({
  players,
  selected,
  onSelect,
  onWatch,
  demo,
}: {
  players: CareerPlayer[];
  selected: number[];
  onSelect: (ids: number[]) => void;
  onWatch: (player: CareerPlayer) => void;
  demo: boolean;
}) {
  const t = careerCopy(),
    ui = careerUiCopy();
  const [editing, setEditing] = useState(selected.length === 0);
  const [search, setSearch] = useState('');
  const [overflow, setOverflow] = useState(false);
  const table = useRef<HTMLDivElement>(null);
  const chosen = selected
    .map((id) => players.find((p) => p.playerID === id))
    .filter((p): p is CareerPlayer => !!p);
  const candidates = players.filter(
    (p) =>
      !p.archived &&
      p.playerName.toLowerCase().includes(search.trim().toLowerCase()),
  );
  useEffect(() => {
    const el = table.current;
    if (!el) return;
    const update = () => setOverflow(el.scrollWidth > el.clientWidth + 1);
    const observer = new ResizeObserver(update);
    observer.observe(el);
    update();
    return () => observer.disconnect();
  }, [chosen.length, editing]);
  function toggle(id: number) {
    const next = selected.includes(id)
      ? selected.filter((value) => value !== id)
      : [...selected, id].slice(0, 3);
    onSelect(next);
    if (next.length === 3) setEditing(false);
  }
  return (
    <section id="career-compare" className="career-panel career-comparison">
      <div className="career-section-heading">
        <h2>
          {t.compareNav}{' '}
          <span className="career-count">{chosen.length} / 3</span>
        </h2>
        {chosen.length > 0 && (
          <button
            className={editing ? 'career-primary' : ''}
            aria-expanded={editing}
            onClick={() => setEditing((value) => !value)}
          >
            {editing ? ui.done : ui.edit}
          </button>
        )}
      </div>
      {editing && (
        <div className="career-picker">
          <input
            type="search"
            className="career-search"
            aria-label={t.search}
            placeholder={t.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="career-player-options">
            {candidates.map((p) => (
              <label
                className={`career-player-option ${selected.includes(p.playerID) ? 'is-selected' : ''}`}
                key={p.playerID}
              >
                <input
                  type="checkbox"
                  aria-label={p.playerName}
                  checked={selected.includes(p.playerID)}
                  disabled={
                    !selected.includes(p.playerID) && selected.length >= 3
                  }
                  onChange={() => toggle(p.playerID)}
                />
                <PlayerIdentity player={p} />
                <span className="career-picker-rating" title={t.overall}>
                  {p.overallRating}
                </span>
              </label>
            ))}
            {!candidates.length && (
              <p className="career-empty">{ui.noMatches}</p>
            )}
          </div>
        </div>
      )}
      {chosen.length > 0 && (
        <>
          {!editing && (
            <div className="career-selected-players">
              {chosen.map((p) => (
                <div className="career-selected-player" key={p.playerID}>
                  <a
                    href={
                      demo
                        ? `/demo?playerId=${p.playerID}#career-history`
                        : `/players-detail?id=${p.playerID}&view=history`
                    }
                  >
                    <PlayerIdentity player={p} />
                  </a>
                  <div className="career-selected-actions">
                    <button
                      className="career-star"
                      aria-label={`${t.watch} ${p.playerName}`}
                      aria-pressed={p.watched}
                      onClick={() => onWatch(p)}
                    >
                      {p.watched ? '★' : '☆'}
                    </button>
                    <button
                      className="career-remove"
                      aria-label={`${ui.remove} ${p.playerName}`}
                      onClick={() => {
                        onSelect(selected.filter((id) => id !== p.playerID));
                        if (chosen.length === 1) setEditing(true);
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {overflow && <p className="career-swipe">{ui.swipe}</p>}
          <LocaleConsumer componentName="PlayerDetailPage">
            {(locale: any) => {
              const rows: {
                label: string;
                value: (p: CareerPlayer) => number | null;
                delta?: boolean;
              }[] = [
                { label: t.overall, value: (p) => p.overallRating },
                { label: t.pot, value: (p) => p.potential },
                { label: t.change, value: (p) => p.overallChange, delta: true },
                ...attributes.map(([key, label]) => ({
                  label: locale.Attributes[label],
                  value: (p: CareerPlayer) =>
                    typeof p.attributes[key] === 'number'
                      ? (p.attributes[key] as number)
                      : null,
                })),
              ];
              return (
                <div
                  className="career-table-wrap"
                  ref={table}
                  role="region"
                  aria-label={t.compare}
                  tabIndex={0}
                >
                  <table className="career-comparison-table">
                    <thead>
                      <tr>
                        <th scope="col">{t.attributes}</th>
                        {chosen.map((p) => (
                          <th scope="col" key={p.playerID} title={p.playerName}>
                            {p.playerName}
                            <small>{p.position1}</small>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => {
                        const values = chosen.map(row.value);
                        const recorded = values.filter(
                          (v): v is number => v != null,
                        );
                        const best =
                          recorded.length > 1 && new Set(recorded).size > 1
                            ? Math.max(...recorded)
                            : null;
                        return (
                          <tr key={row.label}>
                            <th scope="row">{row.label}</th>
                            {values.map((value, i) => (
                              <td
                                key={chosen[i].playerID}
                                className={
                                  value != null && value === best
                                    ? 'career-best'
                                    : ''
                                }
                                title={
                                  value == null ? t.notRecorded : undefined
                                }
                              >
                                {value == null
                                  ? '—'
                                  : `${row.delta && value > 0 ? '+' : ''}${value}`}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            }}
          </LocaleConsumer>
          <p className="career-missing-note">{ui.missing}</p>
        </>
      )}
    </section>
  );
}
