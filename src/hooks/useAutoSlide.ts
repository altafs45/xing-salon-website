import { useEffect, type RefObject } from 'react';

const PHONES = '(max-width: 767px)';
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
/** Anything the visitor does to the row with a finger, wheel or key ends the auto-slide for good. */
const TAKE_OVER = ['touchstart', 'wheel', 'keydown'] as const;

/**
 * Slides a horizontal scroll-snap row to its next card every `ms`, wrapping back to the first after the last.
 * It runs only while the row is on screen and the tab is visible, waits while a mouse is over the row or
 * something inside it has focus, stops for good once the visitor swipes or scrolls it, and never runs for
 * visitors who prefer reduced motion. `phonesOnly` is for rows that turn into a grid on larger screens.
 */
export function useAutoSlide(row: RefObject<HTMLElement>, ms: number | undefined, { phonesOnly = true, enabled = true } = {}) {
  useEffect(() => {
    const el = row.current;
    if (!el || !ms || !enabled) return;
    if (window.matchMedia(REDUCED_MOTION).matches || (phonesOnly && !window.matchMedia(PHONES).matches)) return;

    let timer = 0;
    let onScreen = false;
    let held = false;

    const next = () => {
      const cards = [...el.children] as HTMLElement[];
      if (cards.length < 2) return;
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4;
      // One card further on, measured from the cards themselves so it works with any width and gap.
      const step = cards[1].offsetLeft - cards[0].offsetLeft;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step, behavior: 'smooth' });
    };
    const sync = () => {
      window.clearInterval(timer);
      if (onScreen && !held) timer = window.setInterval(() => !document.hidden && next(), ms);
    };
    const hold = () => {
      held = true;
      sync();
    };
    const release = () => {
      held = false;
      sync();
    };
    const visible = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0.5 },
    );
    const stop = () => {
      window.clearInterval(timer);
      visible.disconnect();
      TAKE_OVER.forEach((type) => el.removeEventListener(type, stop));
      el.removeEventListener('mouseenter', hold);
      el.removeEventListener('mouseleave', release);
      el.removeEventListener('focusin', hold);
      el.removeEventListener('focusout', release);
    };

    visible.observe(el);
    TAKE_OVER.forEach((type) => el.addEventListener(type, stop, { passive: true }));
    el.addEventListener('mouseenter', hold);
    el.addEventListener('mouseleave', release);
    el.addEventListener('focusin', hold);
    el.addEventListener('focusout', release);
    return stop;
  }, [row, ms, phonesOnly, enabled]);
}
