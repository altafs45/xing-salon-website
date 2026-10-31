import { useEffect, useRef, useState, type FocusEvent, type TouchEvent } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ArrowRight, Clock, Landmark, MapPin, Navigation, Pause, Phone, Play } from 'lucide-react';
import { gallery, locations } from '../data/content';
import { onTabKeyDown } from '../lib/a11y';
import { cn } from '../lib/cn';
import { whatsappLink } from '../lib/whatsapp';
import { Button } from './ui/Button';
import { WhatsAppIcon } from './ui/Decor';
import { Eyebrow, Picture, Reveal } from './ui/Primitives';

type Salon = (typeof locations)[number];

/** How long each salon stays on screen. */
const ROTATE_MS = 2000;
const SWIPE_THRESHOLD_PX = 50;
// Phones show body text at 16px; the smaller size starts at tablet width.
const BUTTON_TEXT = 'max-md:!text-sm';

/** One salon's slide: heading, description, address, hours, buttons and its photo grid. */
function SalonPanel({ salon }: { salon: Salon }) {
  const details = [
    { Icon: MapPin, text: salon.address },
    { Icon: Clock, text: `Open daily ${salon.hours.label}` },
    ...(salon.landmark ? [{ Icon: Landmark, text: salon.landmark }] : []),
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-8">
      <div className="lg:col-span-4">
        <h2 className="heading text-balance text-ink">
          <a href={salon.path} className="underline-offset-4 transition-colors hover:text-berry hover:underline">
            {gallery.title(salon.name)}
          </a>
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted">{salon.inside ?? salon.intro}</p>
        <ul className="mt-5 space-y-2.5">
          {details.map(({ Icon, text }) => (
            <li key={text} className="flex items-start gap-3 text-sm leading-relaxed text-ink">
              <Icon aria-hidden className="mt-1 size-4 shrink-0 text-berry" />
              {text}
            </li>
          ))}
        </ul>
        <a href={salon.path} className="group mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-berry underline-offset-4 hover:underline">
          Visit the {salon.name} salon page
          <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
        </a>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            href={whatsappLink(gallery.whatsappText(salon.name), salon.whatsappHref)}
            external
            arrow={false}
            className={cn('w-full sm:w-auto', BUTTON_TEXT)}
          >
            <WhatsAppIcon className="size-4" />
            {gallery.cta}
            <span className="sr-only"> at {salon.name}</span>
          </Button>
          <Button variant="outline" href={salon.directionsUrl} external arrow={false} className={cn('flex-1 sm:flex-none', BUTTON_TEXT)}>
            <Navigation aria-hidden className="size-4" />
            {gallery.directions}
            <span className="sr-only"> to {salon.name}</span>
          </Button>
          <Button variant="outline" href={salon.phoneHref} arrow={false} className={cn('flex-1 sm:flex-none', BUTTON_TEXT)}>
            <Phone aria-hidden className="size-4" />
            {gallery.call}
            <span className="sr-only"> {salon.name}</span>
          </Button>
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-8 lg:gap-4">
        {salon.photos.map((photo) => (
          <li key={photo.src} className="group overflow-hidden rounded-card shadow-soft">
            <Picture
              image={photo}
              className="aspect-photo w-full object-cover transition-transform duration-700 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * "Inside XING": one slide per salon, changing every two seconds. All three slides stay in the page (stacked
 * in one grid cell and cross-faded), so the section never changes height and search engines read every salon.
 */
export function SalonGallery() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [active, setActive] = useState(0);
  // The visitor's choice: off after picking a salon or pressing pause, until they press play.
  const [playing, setPlaying] = useState(true);
  // Short holds that end by themselves.
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touching, setTouching] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [inView, setInView] = useState(false);

  const autoplay = playing && !reduceMotion;
  const running = autoplay && !hovered && !focused && !touching && tabVisible && inView;

  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden);
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const next = () => setActive((i) => (i + 1) % locations.length);
  /** A salon the visitor chose: show it and leave autoplay off until they press play. */
  const choose = (index: number) => {
    setActive((index + locations.length) % locations.length);
    setPlaying(false);
  };

  // Keyboard focus holds the slideshow; a mouse click on a button doesn't.
  const onFocus = (e: FocusEvent<HTMLElement>) => {
    if (e.target.matches(':focus-visible')) setFocused(true);
  };
  const onBlur = (e: FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
  };

  const onTouchStart = (e: TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    setTouching(true);
  };
  const onTouchEnd = (e: TouchEvent) => {
    setTouching(false);
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    // A sideways swipe changes salon; a mostly vertical one is just the page scrolling.
    if (Math.abs(dx) > SWIPE_THRESHOLD_PX && Math.abs(dx) > Math.abs(dy)) choose(active + (dx < 0 ? 1 : -1));
  };

  return (
    <section ref={sectionRef} id="gallery" className="section bg-cream" onFocus={onFocus} onBlur={onBlur}>
      <Reveal className="container-site">
        <Eyebrow>{gallery.eyebrow}</Eyebrow>

        <div className="mt-4 flex items-center gap-3">
          <div
            role="tablist"
            aria-label={gallery.tabsLabel}
            className="no-scrollbar -mx-4 flex min-w-0 flex-1 gap-2 overflow-x-auto px-4 py-1 md:mx-0 md:px-1"
          >
            {locations.map((salon, i) => {
              const selected = i === active;
              return (
                <button
                  key={salon.id}
                  type="button"
                  role="tab"
                  id={`gallery-tab-${salon.id}`}
                  aria-selected={selected}
                  aria-controls={`gallery-panel-${salon.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => choose(i)}
                  onKeyDown={(e) => onTabKeyDown(e, i, locations.length, choose)}
                  className={cn(
                    'relative min-h-11 shrink-0 overflow-hidden rounded-full border px-5 text-sm font-medium transition-colors duration-200',
                    selected ? 'border-berry bg-berry text-cream' : 'border-ink/15 text-ink hover:border-berry hover:text-berry',
                  )}
                >
                  {salon.name}
                  {/* Fills over the time the salon is shown; when it ends, the next salon comes in. */}
                  {selected && (
                    <span
                      key={autoplay ? 'timer' : 'still'}
                      aria-hidden
                      onAnimationEnd={next}
                      style={{ animationDuration: `${ROTATE_MS}ms`, animationPlayState: running ? 'running' : 'paused' }}
                      className={cn('absolute inset-x-0 bottom-0 h-1 origin-left bg-gold', autoplay && 'animate-fill-x')}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {!reduceMotion && (
            <button
              type="button"
              aria-label={playing ? gallery.pause : gallery.play}
              onClick={() => {
                // Pressing play is a clear request, so it also ends a keyboard-focus hold.
                setFocused(false);
                setPlaying(!playing);
              }}
              className="grid size-11 shrink-0 place-items-center rounded-full border border-berry text-berry transition-colors duration-200 hover:bg-berry hover:text-cream"
            >
              {playing ? <Pause aria-hidden className="size-4" /> : <Play aria-hidden className="size-4" />}
            </button>
          )}
        </div>

        {/* Every slide shares one grid cell, so the tallest sets the height and nothing jumps as they change. */}
        <div
          aria-live={running ? 'off' : 'polite'}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onTouchCancel={() => setTouching(false)}
          className="mt-8 grid touch-pan-y"
        >
          {locations.map((salon, i) => {
            const selected = i === active;
            return (
              <div
                key={salon.id}
                role="tabpanel"
                id={`gallery-panel-${salon.id}`}
                aria-labelledby={`gallery-tab-${salon.id}`}
                aria-hidden={!selected}
                // Hidden slides stay in the page but out of the tab order and away from screen readers.
                {...(!selected && { inert: '' })}
                className={cn(
                  'col-start-1 row-start-1 transition-opacity duration-[400ms] ease-in-out motion-reduce:transition-none',
                  selected ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
              >
                <SalonPanel salon={salon} />
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
