import { useEffect, useRef, useState, type TouchEvent } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Play, Volume2, VolumeX, X } from 'lucide-react';
import { reels, type Reel } from '../data/media';
import { services } from '../data/services';
import { useHistoryClose } from '../hooks/useHistoryClose';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { cn } from '../lib/cn';
import { whatsappLink } from '../lib/whatsapp';
import { WhatsAppIcon } from './ui/Decor';
import { Modal } from './ui/Modal';
import { Eyebrow, Reveal } from './ui/Primitives';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const ROUND = 'grid size-11 shrink-0 place-items-center rounded-full';

interface ReelCardProps {
  reel: Reel;
  /** In a row, the row says which card plays. On its own, the card plays while most of it is on screen. */
  playing?: boolean;
  /** "metadata" for the card after the one playing, so it starts at once. */
  preload?: 'none' | 'metadata';
  /** Opens the full-screen viewer. Without it a tap plays or pauses the clip in place. */
  onOpen?: () => void;
}

/**
 * A silent, looping portrait clip over its poster. No video bytes load until it plays (preload="none"). Visitors
 * who prefer reduced motion get the poster and a play button.
 */
export function ReelCard({ reel, playing, preload = 'none', onOpen }: ReelCardProps) {
  const video = useRef<HTMLVideoElement>(null);
  const [running, setRunning] = useState(false);
  const reducedMotion = useMediaQuery(REDUCED_MOTION);

  // On its own: play while at least 60% of it is on screen.
  useEffect(() => {
    const el = video.current;
    if (!el || playing !== undefined) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) el.pause();
        else if (!reducedMotion) el.play().catch(() => {});
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [playing, reducedMotion]);

  // In a row: the row decides. A blocked autoplay just leaves the poster and play button showing.
  useEffect(() => {
    const el = video.current;
    if (!el || playing === undefined) return;
    if (playing && !reducedMotion) el.play().catch(() => {});
    else el.pause();
  }, [playing, reducedMotion]);

  const tap = () => {
    if (onOpen) return onOpen();
    const el = video.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  };

  return (
    <figure className="mx-auto max-w-[18rem] md:max-w-none">
      <button
        type="button"
        onClick={tap}
        aria-label={onOpen ? `Open video: ${reel.caption}` : `${running ? 'Pause' : 'Play'} video: ${reel.caption}`}
        className="group relative block aspect-[9/16] w-full overflow-hidden rounded-card bg-ink shadow-soft"
      >
        {/* The poster as a lazy image: a video's poster downloads with the page, even far below the screen. */}
        <img src={reel.poster} alt="" width={reel.width} height={reel.height} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        <video
          ref={video}
          src={reel.src}
          width={reel.width}
          height={reel.height}
          muted
          playsInline
          loop
          preload={preload}
          onPlay={() => setRunning(true)}
          onPause={() => setRunning(false)}
          className="relative h-full w-full object-cover"
        />
        <span
          aria-hidden
          className={cn(
            'absolute inset-0 flex items-center justify-center bg-ink/20 transition-opacity duration-200 motion-reduce:transition-none',
            running && 'opacity-0',
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

/** "Book this look": a WhatsApp message naming the clip and its service. */
const bookLook = (reel: Reel) => whatsappLink(`Hi Xing, I’d like to book this look: ${reel.caption} (${services[reel.service]?.label ?? 'a salon visit'}).`);

/**
 * Full screen, one clip at a time: swipe up or down (or the arrows) for the next or previous one, tap to turn the
 * sound on or off, swipe down on the first clip, Back or Close to leave.
 */
function ReelViewer({ items, start, open, onClose }: { items: Reel[]; start: number; open: boolean; onClose: () => void }) {
  const [index, setIndex] = useState(start);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const touchY = useRef(0);
  useHistoryClose(open, onClose);
  useEffect(() => {
    if (open) setIndex(start);
  }, [open, start]);
  useEffect(() => setProgress(0), [index]);

  const reel = items[index];
  const go = (step: number) => setIndex((i) => Math.min(items.length - 1, Math.max(0, i + step)));
  const onTouchStart = (e: TouchEvent) => {
    touchY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: TouchEvent) => {
    const dy = e.changedTouches[0].clientY - touchY.current;
    if (dy < -60) go(1);
    else if (dy > 60) {
      if (index === 0) onClose();
      else go(-1);
    }
  };

  return (
    <Modal open={open} onClose={onClose} label="Transformation videos" layout="video">
      <div
        className="relative flex h-full flex-col"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowRight') go(1);
          if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') go(-1);
        }}
      >
        <div className="absolute inset-x-0 top-0 z-10 h-1 bg-cream/20" aria-hidden>
          <div className="h-full bg-cream" style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-3 pt-4">
          <button type="button" onClick={onClose} aria-label="Close videos" className={cn(ROUND, 'bg-ink/50')}>
            <X aria-hidden className="size-6" />
          </button>
          <p aria-live="polite" className="text-sm font-medium tabular-nums">
            {index + 1} / {items.length}
          </p>
          <button type="button" onClick={() => setMuted(!muted)} aria-label={muted ? 'Turn sound on' : 'Turn sound off'} className={cn(ROUND, 'bg-ink/50')}>
            {muted ? <VolumeX aria-hidden className="size-6" /> : <Volume2 aria-hidden className="size-6" />}
          </button>
        </div>

        <video
          key={reel.src}
          src={reel.src}
          poster={reel.poster}
          autoPlay
          muted={muted}
          playsInline
          loop
          onClick={() => setMuted(!muted)}
          onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime / (e.currentTarget.duration || 1))}
          className="min-h-0 w-full flex-1 object-contain"
        />

        <div className="absolute right-3 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-3">
          <button type="button" onClick={() => go(-1)} disabled={index === 0} aria-label="Previous video" className={cn(ROUND, 'bg-ink/50 disabled:opacity-30')}>
            <ChevronUp aria-hidden className="size-6" />
          </button>
          <button type="button" onClick={() => go(1)} disabled={index === items.length - 1} aria-label="Next video" className={cn(ROUND, 'bg-ink/50 disabled:opacity-30')}>
            <ChevronDown aria-hidden className="size-6" />
          </button>
        </div>

        <div className="safe-bottom absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-ink/90 to-transparent p-4 pt-10">
          <p className="font-display text-xl font-medium">{reel.caption}</p>
          <a
            href={bookLook(reel)}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="reel-book"
            className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-5 text-base font-semibold text-white"
          >
            <WhatsAppIcon className="size-5" />
            Book this look
          </a>
        </div>
      </div>
    </Modal>
  );
}

/**
 * A row of clips. Phones: a swipe row of cards 72% of the screen wide, snapping to the centre with the next one
 * peeking, with arrows, a counter and dots. Tablet up: a grid. Only the card most in view plays (at most one), the
 * next one fetches its first frame, and nothing loads before the row nears the screen. A tap opens the viewer.
 */
export function ReelRow({ items }: { items: Reel[] }) {
  const list = useRef<HTMLUListElement>(null);
  const [shown, setShown] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [viewer, setViewer] = useState<number | null>(null);

  // How much of each card is on screen.
  useEffect(() => {
    const cards = [...(list.current?.children ?? [])];
    const ratios = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) ratios.set(entry.target, entry.intersectionRatio);
        setShown(cards.map((card) => ratios.get(card) ?? 0));
      },
      { threshold: [0, 0.3, 0.6, 0.9, 1] },
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [items]);

  // The one to play: the card most in view, if at least 60% of it is.
  const best = shown.reduce((top, ratio, i) => (ratio > (shown[top] ?? 0) ? i : top), 0);
  const playing = (shown[best] ?? 0) >= 0.6 && viewer === null ? best : -1;

  const onScroll = () => {
    const row = list.current;
    if (!row) return;
    const middle = row.scrollLeft + row.clientWidth / 2;
    const cards = [...row.children] as HTMLElement[];
    const nearest = cards.reduce((top, card, i) => (Math.abs(card.offsetLeft + card.offsetWidth / 2 - middle) < Math.abs(cards[top].offsetLeft + cards[top].offsetWidth / 2 - middle) ? i : top), 0);
    setCurrent(nearest);
  };
  const scrollTo = (i: number) => {
    const card = list.current?.children[Math.min(items.length - 1, Math.max(0, i))] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: window.matchMedia(REDUCED_MOTION).matches ? 'instant' : 'smooth', block: 'nearest', inline: 'center' });
  };

  return (
    <div>
      <ul
        ref={list}
        onScroll={onScroll}
        aria-label="Transformation videos"
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-[14vw] pb-2 md:mx-0 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0 lg:grid-cols-5"
      >
        {items.map((reel, i) => (
          <li key={reel.src} className="w-[72vw] max-w-[22rem] shrink-0 snap-center md:w-auto md:max-w-none">
            <ReelCard reel={reel} playing={i === playing} preload={i === playing + 1 && playing >= 0 ? 'metadata' : 'none'} onOpen={() => setViewer(i)} />
          </li>
        ))}
      </ul>
      {items.length > 1 && (
        <div className="mt-4 flex items-center justify-between gap-3 md:hidden">
          <button type="button" onClick={() => scrollTo(current - 1)} disabled={current === 0} aria-label="Previous video" className={cn(ROUND, 'border border-berry/30 bg-white text-berry disabled:opacity-40')}>
            <ChevronLeft aria-hidden className="size-5" />
          </button>
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-medium tabular-nums text-ink">
              {current + 1} / {items.length}
            </p>
            <div aria-hidden className="flex gap-1.5">
              {items.map((reel, i) => (
                <span key={reel.src} className={cn('h-1.5 rounded-full transition-all motion-reduce:transition-none', i === current ? 'w-5 bg-berry' : 'w-1.5 bg-berry/25')} />
              ))}
            </div>
          </div>
          <button type="button" onClick={() => scrollTo(current + 1)} disabled={current === items.length - 1} aria-label="Next video" className={cn(ROUND, 'border border-berry/30 bg-white text-berry disabled:opacity-40')}>
            <ChevronRight aria-hidden className="size-5" />
          </button>
        </div>
      )}
      {viewer !== null && <ReelViewer items={items} start={viewer} open onClose={() => setViewer(null)} />}
    </div>
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
