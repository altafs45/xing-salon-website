import { lazy, type ComponentType } from 'react';
import { isHydrating } from './hydration';

/** True while scripts/prerender.mjs is taking this page's snapshot. */
export const isPrerender = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('prerender');

/** True when this page arrived as prerendered HTML (not the dev skeleton): what is on screen must not animate in again. */
export const wasPrerendered = typeof document !== 'undefined' && !!document.getElementById('root')?.hasChildNodes() && !document.querySelector('#root > [data-skeleton]');

/** True while the snapshot is taken, and while it is hydrated: render what the snapshot shows (see hydration.ts). */
export const isSnapshotRender = () => isPrerender || isHydrating();

/**
 * React.lazy with a `preload()`. Once preloaded it renders at once, with no Suspense fallback, so the app can take
 * over from the prerendered HTML without a blank frame. (The thenable is synchronous because lazy() only skips
 * suspending if the module is there as soon as it asks.)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function readyLazy<T extends ComponentType<any>>(load: () => Promise<{ default: T }>) {
  let loaded: { default: T } | undefined;
  const Component = lazy(() => (loaded ? { then: (done: (module: { default: T }) => void) => done(loaded!) } : load()) as Promise<{ default: T }>);
  return Object.assign(Component, {
    preload: async () => {
      loaded ??= await load();
    },
  });
}
