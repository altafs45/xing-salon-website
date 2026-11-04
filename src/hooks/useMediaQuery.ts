import { useEffect, useState } from 'react';
import { isHydrating, snapshotMatches } from '../lib/hydration';

export function useMediaQuery(query: string) {
  // While a prerendered page hydrates, the answer the snapshot had; the effect then reads the real one.
  const [matches, setMatches] = useState(() => (isHydrating() ? snapshotMatches(query) : window.matchMedia(query).matches));

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
