import { Suspense, useEffect, useId, useState, type ReactNode } from 'react';
import { holdHydration, releaseHydration } from '../../lib/hydration';
import { isPrerender } from '../../lib/prerender';

/** Rendered last inside the boundary: its effect runs once the boundary's content has hydrated. */
function Hydrated({ id }: { id: string }) {
  useEffect(() => releaseHydration(id), [id]);
  return null;
}

/**
 * A Suspense boundary that survives the prerender. Hydration looks for React's <!--$--> … <!--/$--> markers
 * around each boundary's content; the snapshot is taken from the DOM, which has none, so it marks where they go
 * and scripts/prerender.mjs writes them in. React hydrates the content after the rest of the page, so the page
 * stays on the snapshot's values until it has (src/lib/hydration.ts). Use it for any boundary on screen when the
 * page loads.
 */
export function Boundary({ fallback, children }: { fallback: ReactNode; children: ReactNode }) {
  const id = useId();
  useState(() => holdHydration(id));
  return (
    <Suspense fallback={fallback}>
      {isPrerender && <template hidden data-boundary="start" />}
      {children}
      <Hydrated id={id} />
      {isPrerender && <template hidden data-boundary="end" />}
    </Suspense>
  );
}
