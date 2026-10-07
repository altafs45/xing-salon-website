import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { ChevronsLeftRight } from 'lucide-react';
import type { Img } from '../data/content';
import { cn } from '../lib/cn';
import { Picture } from './ui/Primitives';

const KEY_STEP = 5;
const clamp = (value: number) => Math.min(100, Math.max(0, value));

interface BeforeAfterProps {
  before: Img;
  after: Img;
  caption: string;
}

/** Before/after comparison. Drag anywhere (mouse or touch) or focus the handle and use the arrow keys. */
export function BeforeAfter({ before, after, caption }: BeforeAfterProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const isPlaceholderPair = before.src === after.src;

  const moveTo = (clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (rect) setPosition(clamp(((clientX - rect.left) / rect.width) * 100));
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    moveTo(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) moveTo(e.clientX);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const next = {
      ArrowLeft: position - KEY_STEP,
      ArrowDown: position - KEY_STEP,
      ArrowRight: position + KEY_STEP,
      ArrowUp: position + KEY_STEP,
      Home: 0,
      End: 100,
    }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setPosition(clamp(next));
  };

  return (
    <figure>
      <div
        ref={frameRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        className="relative aspect-photo cursor-ew-resize lg:aspect-banner touch-pan-y select-none overflow-hidden rounded-card shadow-soft"
      >
        <Picture image={after} className="size-full object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <Picture image={before} className={cn('size-full object-cover', isPlaceholderPair && 'placeholder-before')} />
        </div>

        <span className="absolute bottom-3 left-3 rounded-full bg-ink/60 px-3 py-1 text-xs text-cream">Before</span>
        <span className="absolute bottom-3 right-3 rounded-full bg-ink/60 px-3 py-1 text-xs text-cream">After</span>

        <div
          role="slider"
          tabIndex={0}
          aria-label={`${caption}: before and after comparison`}
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          aria-valuetext={`${Math.round(position)}% before shown`}
          onKeyDown={onKeyDown}
          style={{ left: `${position}%` }}
          className="group absolute inset-y-0 w-0.5 -translate-x-1/2 bg-cream outline-none"
        >
          <span className="absolute left-1/2 top-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-cream text-berry shadow-soft ring-berry ring-offset-2 transition-transform group-focus-visible:ring-2 group-active:scale-110">
            <ChevronsLeftRight aria-hidden className="size-5" />
          </span>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-xs font-medium text-ink">{caption}</figcaption>
    </figure>
  );
}
