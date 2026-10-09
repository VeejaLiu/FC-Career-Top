import { useEffect, useState } from 'react';

export const MOBILE_QUERY = '(max-width: 767px)';

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  );
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    if (media.addEventListener) media.addEventListener('change', update);
    else media.addListener(update);
    return () => {
      if (media.removeEventListener)
        media.removeEventListener('change', update);
      else media.removeListener(update);
    };
  }, [query]);
  return matches;
}
