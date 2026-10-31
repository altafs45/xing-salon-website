import { useEffect, useState } from 'react';

/** Returns the id of the section currently crossing the middle of the viewport. */
export function useScrollSpy(ids: readonly string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: '-40% 0px -55% 0px' },
    );
    // The page's sections load after the header, so keep looking until every one has been found.
    const missing = new Set(ids);
    const watch = () => {
      missing.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        observer.observe(el);
        missing.delete(id);
      });
      if (missing.size === 0) added.disconnect();
    };
    const added = new MutationObserver(watch);
    added.observe(document.body, { childList: true, subtree: true });
    watch();
    return () => {
      observer.disconnect();
      added.disconnect();
    };
  }, [ids]);

  return active;
}
