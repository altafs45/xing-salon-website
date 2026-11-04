import { isPrerender } from './prerender';

const SLIDE_MS = 4000;
const SWIPE_PX = 45;

/**
 * Runs an offer slider (see OfferSlides): it moves on every few seconds, always forwards, and loops without jumping
 * back, because a copy of the first slide sits after the last. Plain DOM, as the build can write the slides into the
 * page as HTML. Returns a function that stops it.
 */
export function startOfferSlider(root: HTMLElement) {
  const track = root.querySelector<HTMLElement>('[data-slider-track]');
  // The snapshot keeps the first slide in place and no copy, as React renders it, or hydration would disagree.
  if (!track || isPrerender) return () => {};
  const slides = [...track.children] as HTMLElement[];
  const count = slides.length;
  const tabs = [...root.querySelectorAll<HTMLElement>('[data-slider-tab]')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const copy = slides[0].cloneNode(true) as HTMLElement;
  copy.setAttribute('aria-hidden', 'true');
  copy.inert = true;
  track.append(copy);

  let index = 0;
  let paused = false;
  let inView = false;
  let focused = false;
  let timer = 0;

  const place = (position: number, animate: boolean) => {
    track.style.transitionDuration = animate ? '' : '0ms';
    track.style.transform = `translateX(-${position * 100}%)`;
    // Lets the jump take effect before the next move starts.
    if (!animate) void track.offsetWidth;
  };
  const go = (next: number) => {
    if (index === count) place((index = 0), false);
    if (next < 0) {
      place(count, false);
      next = count - 1;
    }
    index = next;
    place(index, !reduced);
    if (reduced && index === count) place((index = 0), false);
    const active = index % count;
    slides.forEach((slide, i) => {
      slide.inert = i !== active;
      slide.setAttribute('aria-hidden', String(i !== active));
    });
    tabs.forEach((tab, i) => {
      tab.dataset.active = String(i === active);
      if (i === active) tab.setAttribute('aria-current', 'true');
      else tab.removeAttribute('aria-current');
    });
  };
  const restart = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => {
      if (!paused && !focused && inView && !document.hidden) go(index + 1);
    }, SLIDE_MS);
  };
  const move = (next: number) => {
    go(next);
    restart();
  };

  const onLoop = (e: TransitionEvent) => {
    if (e.target === track && index === count) place((index = 0), false);
  };
  const onClick = (e: MouseEvent) => {
    const el = (e.target as Element).closest<HTMLElement>('[data-slider-tab],[data-slider-step],[data-slider-toggle]');
    if (!el) return;
    if (el.dataset.sliderTab) move(Number(el.dataset.sliderTab));
    else if (el.dataset.sliderStep) move((index % count) + Number(el.dataset.sliderStep));
    else {
      paused = !paused;
      el.setAttribute('aria-label', paused ? 'Play the offers' : 'Pause the offers');
      el.querySelectorAll('svg').forEach((icon, i) => icon.classList.toggle('hidden', (i === 0) === paused));
    }
  };
  // Keyboard users keep the slide they tabbed to; a mouse click on a button doesn't count.
  const onFocus = (e: FocusEvent) => {
    focused = (e.target as Element).matches(':focus-visible');
  };
  const onBlur = () => {
    focused = false;
  };
  let startX = 0;
  const onTouchStart = (e: TouchEvent) => {
    startX = e.touches[0].clientX;
  };
  const onTouchEnd = (e: TouchEvent) => {
    const moved = e.changedTouches[0].clientX - startX;
    if (Math.abs(moved) > SWIPE_PX) move((index % count) + (moved < 0 ? 1 : -1));
  };

  track.addEventListener('transitionend', onLoop);
  root.addEventListener('click', onClick);
  root.addEventListener('focusin', onFocus);
  root.addEventListener('focusout', onBlur);
  track.addEventListener('touchstart', onTouchStart, { passive: true });
  track.addEventListener('touchend', onTouchEnd, { passive: true });

  // The other posters load once the slider is near, so they never pop in mid-slide.
  const watch = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      if (inView) track.querySelectorAll('img').forEach((img) => (img.loading = 'eager'));
    },
    { rootMargin: '200px 0px' },
  );
  watch.observe(root);
  go(0);
  restart();

  return () => {
    window.clearInterval(timer);
    watch.disconnect();
    track.removeEventListener('transitionend', onLoop);
    root.removeEventListener('click', onClick);
    root.removeEventListener('focusin', onFocus);
    root.removeEventListener('focusout', onBlur);
    track.removeEventListener('touchstart', onTouchStart);
    track.removeEventListener('touchend', onTouchEnd);
    copy.remove();
  };
}
