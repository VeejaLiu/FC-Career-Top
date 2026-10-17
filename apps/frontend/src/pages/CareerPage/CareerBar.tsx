import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Career,
  careerRequest,
  selectedCareer,
  selectCareer,
} from '../../service/CareerApis';
import { getDefaultGameVersion } from '../../common/common';
import { careerCopy } from './copy';
import './career.css';
export function CareerBar() {
  const t = careerCopy();
  const [careers, setCareers] = useState<Career[]>([]),
    [id, setId] = useState(''),
    [error, setError] = useState('');
  useEffect(() => {
    let live = true;
    Promise.all([careerRequest<Career[]>(), getDefaultGameVersion()])
      .then(([list, v]) => {
        if (!live) return;
        const chosen =
          list.find((c) => String(c.id) === selectedCareer(v)) ||
          list.find((c) => c.is_legacy) ||
          list[0];
        selectCareer(v, chosen.id);
        setId(String(chosen.id));
        setCareers(list);
      })
      .catch(() => {
        if (live) setError(t.failed);
      });
    return () => {
      live = false;
    };
  }, []);
  return (
    <div className="career-bar">
      <label>
        {t.career}{' '}
        <select
          aria-label={t.career}
          value={id}
          onChange={async (e) => {
            const nextId = e.target.value;
            setId(nextId);
            selectCareer(await getDefaultGameVersion(), Number(nextId));
            window.location.reload();
          }}
        >
          {careers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
              {c.is_archived ? ` · ${t.archive}` : ''}
            </option>
          ))}
        </select>
      </label>
      <Link to="/career">{t.manage}</Link>
      {error && <span role="alert">{error}</span>}
    </div>
  );
}
