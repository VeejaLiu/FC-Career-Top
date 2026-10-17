import { useCallback, useEffect, useState } from 'react';

// Supply a stable loader (an API method or useCallback). Results from old
// requests are ignored after navigation, a retry, or a dependency change.
export function useAsyncResource<T>(
  loader: () => Promise<T>,
  enabled = true,
  keepPrevious = false,
) {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const reload = useCallback(() => setAttempt((value) => value + 1), []);

  useEffect(() => {
    let active = true;
    if (!keepPrevious) setData(undefined);
    setError(false);
    setLoading(enabled);
    if (!enabled) return;
    loader()
      .then((result) => {
        if (active) setData(result);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [loader, enabled, attempt, keepPrevious]);

  useEffect(() => {
    window.addEventListener('fct-snapshot-saved', reload);
    return () => window.removeEventListener('fct-snapshot-saved', reload);
  }, [reload]);

  return { data, loading, error, reload };
}
