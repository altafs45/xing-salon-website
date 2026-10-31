import { useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import { ChevronsLeftRight } from 'lucide-react';
import type { BeforeAfterPair } from '../data/media';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { cn } from '../lib/cn';
import { serviceHref } from '../lib/route';
import { Picture } from './ui/Primitives';

const LABEL = 'pointer-events-none absolute top-3 rounded-full bg-ink/70 px-3 py-1 text-xs font-medium text-cream transition-opacity duration-200';
const PHOTO = 'absolute inset-0 h-full w-full object-cover';

interface BeforeAfterProps {
  pair: BeforeAfterPair;
  /** Display width of the photos, for choosing the right file size. */
  sizes?: string;
}

/**
 * Two photos of the same client with a divider to drag between them: "before" on the left, "after" on the
 * right. Screens narrower than 400px get a Before / After switch instead, as the divider is too fiddly there.
 */
export function BeforeAfter({ pair, sizes = '(min-width: 1024px) 400px, (min-width: 768px) 33vw, 85vw' }: BeforeAfterProps) {
  const [position, setPosition] = useState(50);
  const [showBefore, setShowBefore] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const narrow = useMediaQuery('(max-width: 399px)');

  const moveTo = (clientX: number) => {
    const box = frame.current?.getBoundingClientRect();
    if (box) setPosition(Math.round(Math.min(100, Math.max(0, ((clientX - box.left) / box.width) * 100))));
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => e.currentTarget.setPointerCapture(e.pointerId);
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) moveTo(e.clientX);
  };
  // A tap anywhere on the photo moves the divider there.
  const onClick = (e: MouseEvent) => moveTo(e.clientX);
  const onKeyDown = (e: KeyboardEvent) => {
    const next = { ArrowLeft: position - 5, ArrowRight: position + 5, Home: 0, End: 100 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setPosition(Math.min(100, Math.max(0, next)));
  };

  const ratio = { aspectRatio: `${pair.after.width} / ${pair.after.height}` };

  return (
    <figure>
      {narrow ? (
        <>
          <div className="relative overflow-hidden rounded-card shadow-soft" style={ratio}>
            <Picture image={pair.after} sizes={sizes} className={PHOTO} />
            <Picture
              image={pair.before}
              sizes={sizes}
              className={cn(PHOTO, 'transition-opacity duration-300 motion-reduce:transition-none', !showBefore && 'opacity-0')}
            />
          </div>
          <div className="mt-3 flex gap-2">
            {[true, false].map((before) => (
              <button
                key={String(before)}
                type="button"
                aria-pressed={showBefore === before}
                onClick={() => setShowBefore(before)}
                className={cn(
                  'min-h-11 flex-1 rounded-full border text-xs font-medium transition-colors duration-200',
                  showBefore === before ? 'border-berry bg-berry text-cream' : 'border-ink/15 text-ink',
                )}
              >
                {before ? 'Before' : 'After'}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div
          ref={frame}
          onClick={onClick}
          className="relative cursor-pointer select-none overflow-hidden rounded-card shadow-soft"
          style={ratio}
        >
          <Picture image={pair.after} sizes={sizes} className={PHOTO} />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
            <Picture image={pair.before} sizes={sizes} className={PHOTO} />
          </div>
          <span className={cn(LABEL, 'left-3', position < 22 && 'opacity-0')}>Before</span>
          <span className={cn(LABEL, 'right-3', position > 78 && 'opacity-0')}>After</span>

          {/* Only the divider takes the drag, so swiping the photo still moves the row it sits in; `pan-y`
              leaves vertical page scrolling to the browser even when the finger starts on the divider. */}
          <div
            role="slider"
            tabIndex={0}
            aria-label={`Before and after: ${pair.caption}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={position}
            aria-valuetext={`${position}% before, ${100 - position}% after`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onKeyDown={onKeyDown}
            onClick={(e) => e.stopPropagation()}
            className="group absolute inset-y-0 flex w-11 -translate-x-1/2 cursor-ew-resize touch-pan-y justify-center outline-none"
            style={{ left: `${position}%` }}
          >
            <span className="h-full w-0.5 bg-cream shadow-soft" />
            <span className="absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream text-berry shadow-soft transition-transform duration-200 group-focus-visible:ring-2 group-focus-visible:ring-berry group-focus-visible:ring-offset-2 group-active:scale-110 motion-reduce:transition-none">
              <ChevronsLeftRight aria-hidden className="h-5 w-5" />
            </span>
          </div>
        </div>
      )}
      <figcaption className="mt-3 text-center">
        <span className="block text-xs font-medium text-ink">{pair.caption}</span>
        <a
          href={serviceHref(pair.slug)}
          className="inline-flex min-h-11 items-center text-xs font-medium text-berry underline-offset-4 hover:underline"
        >
          {pair.service}
        </a>
      </figcaption>
    </figure>
  );
}
