import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { reels, type Reel } from '../data/media';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { cn } from '../lib/cn';
import { Eyebrow, Reveal } from './ui/Primitives';
import { SnapRow } from './ui/SnapRow';

/**
 * A silent, looping portrait clip. Nothing downloads until it scrolls into view; it then plays while most of
 * it is on screen and pauses when it leaves. Visitors who prefer reduced motion get the poster and a play button.
 */
export function ReelCard({ reel }: { reel: Reel }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) el.pause();
        // A blocked autoplay just leaves the poster and play button showing.
        else if (!reducedMotion) el.play().catch(() => {});
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  };

  return (
    // The width cap matters where one or two clips stack on a phone instead of forming a swipe row.
    <figure className="mx-auto max-w-[18rem] md:max-w-none">
      <button
        type="button"
        onClick={toggle}
        aria-label={`${playing ? 'Pause' : 'Play'} video: ${reel.caption}`}
        className="group relative block aspect-[9/16] w-full overflow-hidden rounded-card bg-ink shadow-soft"
      >
        <video
          ref={video}
          src={reel.src}
          poster={reel.poster}
          width={reel.width}
          height={reel.height}
          muted
          playsInline
          loop
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="h-full w-full object-cover"
        />
        <span
          aria-hidden
          className={cn(
            'absolute inset-0 flex items-center justify-center bg-ink/20 transition-opacity duration-200 motion-reduce:transition-none',
            playing && 'opacity-0',
          )}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream/90 text-berry shadow-soft">
            <Play className="h-6 w-6 translate-x-0.5 fill-current" />
          </span>
        </span>
      </button>
      <figcaption className="mt-3 text-center text-xs font-medium text-ink">{reel.caption}</figcaption>
    </figure>
  );
}

/** A row of clips: swipeable on phones, a grid from tablet up. */
export function ReelRow({ items }: { items: Reel[] }) {
  return (
    <SnapRow itemWidth="w-3/5" className="md:grid-cols-4 md:gap-5 lg:grid-cols-5">
      {items.map((reel) => (
        <ReelCard key={reel.src} reel={reel} />
      ))}
    </SnapRow>
  );
}

const HOME_REELS = reels.items.filter((item) => item.home);

/** The home page's video section. Clips come from data/media.ts; service pages show the rest. */
export function Reels() {
  if (HOME_REELS.length === 0) return null;

  return (
    <section id="videos" data-gallery className="section bg-cream">
      <div className="container-site">
        <Reveal>
          <Eyebrow>{reels.eyebrow}</Eyebrow>
          <h2 className="heading mt-3 text-ink">{reels.title}</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{reels.text}</p>
        </Reveal>
        <div className="mt-8">
          <ReelRow items={HOME_REELS} />
        </div>
      </div>
    </section>
  );
}
