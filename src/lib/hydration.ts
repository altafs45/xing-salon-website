// Hydration: the browser's first render of a prerendered page must match the HTML exactly, so React can keep it
// instead of throwing it away. Anything that depends on the time, the salon picked, the window size or ?today=
// renders the snapshot's value while this is true, and its live value right after: App re-renders once every
// Suspense boundary on the page has hydrated (React hydrates their content after the rest). No imports: the data
// files use it too.

let hydrating = false;
const pending = new Set<string>();
const waiting: (() => void)[] = [];

function settle() {
  if (!hydrating || pending.size || !waiting.length) return;
  hydrating = false;
  for (const done of waiting.splice(0)) done();
}

export const startHydration = () => {
  hydrating = true;
};
export const isHydrating = () => hydrating;
/** A boundary (by its useId) whose content hydrates later; released once it has. */
export const holdHydration = (id: string) => {
  if (hydrating) pending.add(id);
};
export const releaseHydration = (id: string) => {
  pending.delete(id);
  settle();
};
/** Calls `done` once, when the whole page has hydrated (at once if it is not hydrating). */
export const whenHydrated = (done: () => void) => {
  if (!hydrating) return;
  waiting.push(done);
  settle();
};

/**
 * When the snapshot was taken, while it is taken and while it is hydrated: scripts/prerender.mjs passes it as
 * ?prerender=<time> and writes it on #root, so both renders count down from the same moment.
 */
export const snapshotTime = (): Date | undefined => {
  if (typeof document === 'undefined') return undefined;
  const stamp = hydrating ? document.getElementById('root')?.dataset.snapshot : new URLSearchParams(window.location.search).get('prerender');
  const time = stamp ? new Date(stamp) : undefined;
  return time && !Number.isNaN(time.getTime()) ? time : undefined;
};

/** How a media query answered when the snapshot was taken: at 1280 × 900, with no reduced-motion preference. */
export function snapshotMatches(query: string) {
  const min = query.match(/min-width:\s*(\d+)px/);
  const max = query.match(/max-width:\s*(\d+)px/);
  if (min) return 1280 >= Number(min[1]);
  if (max) return 1280 <= Number(max[1]);
  return false;
}
