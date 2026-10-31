import { useEffect, useRef } from 'react';

/** Close callbacks of the overlays open right now, the newest last. */
const open: Array<() => void> = [];
/** Steps back this hook took itself (to remove its entries after closing by other means): their popstates are ignored. */
let ownPops = 0;
/** A step back waiting for the next tick; reopening at once (React's dev mode) cancels it and keeps the entry. */
let pendingBack = 0;

// One listener for the whole page, so a step back we took is always accounted for, even after its overlay is gone.
window.addEventListener('popstate', () => {
  if (ownPops > 0) {
    ownPops -= 1;
    return;
  }
  open.at(-1)?.();
});

/**
 * Lets the browser's Back button close an overlay (the nav drawer, the gift form sheet). Opening adds a history
 * entry; Back pops it and calls `onClose`. Closing any other way steps back over the entries again, so Back
 * afterwards goes where the visitor expects.
 *
 * An overlay with levels (the menu's Services › Hair Care) calls `push()` on each step in; Back then calls `onUp`
 * to go up one level until the top, and only then closes. `back()` is the on-screen Back button: the same thing.
 * Call `leaving()` before closing for a link tap that navigates: the entries are then left alone, so stepping back
 * can't undo the link.
 */
export function useHistoryClose(isOpen: boolean, onClose: () => void, onUp?: () => void) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const upRef = useRef(onUp);
  upRef.current = onUp;
  const navigating = useRef(false);
  /** Levels stepped into since opening, each with its own history entry. */
  const depth = useRef(0);
  const api = useRef({
    leaving: () => {
      navigating.current = true;
    },
    push: () => {
      depth.current += 1;
      history.pushState({ ...history.state, xingOverlay: true }, '');
    },
    back: () => history.back(),
  }).current;

  useEffect(() => {
    if (!isOpen) return;
    navigating.current = false;
    depth.current = 0;
    window.clearTimeout(pendingBack);
    // Reuse our entry if we're already on it (React's dev mode runs this twice in a row).
    if (!history.state?.xingOverlay) history.pushState({ ...history.state, xingOverlay: true }, '');
    let popped = false;
    const onBack = () => {
      if (depth.current > 0 && upRef.current) {
        depth.current -= 1;
        upRef.current();
        return;
      }
      popped = true;
      closeRef.current();
    };
    open.push(onBack);
    return () => {
      open.splice(open.indexOf(onBack), 1);
      if (popped || navigating.current) return;
      // Step back over every entry we added, in one go, and only while we're still on one of them.
      const steps = depth.current + 1;
      pendingBack = window.setTimeout(() => {
        if (!history.state?.xingOverlay) return;
        ownPops += 1;
        history.go(-steps);
      });
    };
  }, [isOpen]);

  return api;
}
