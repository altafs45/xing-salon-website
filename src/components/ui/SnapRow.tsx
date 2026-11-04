import { Children, useEffect, useRef, useState, type ReactNode, type UIEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAutoSlide } from '../../hooks/useAutoSlide';
import { cn } from '../../lib/cn';

interface SnapRowProps {
  children: ReactNode;
  /** Grid columns from tablet up, e.g. "md:grid-cols-4". Ignored by a `carousel` row. */
  className?: string;
  /** Dot colour for rows that sit on a dark background. */
  tone?: 'light' | 'dark';
  /** Card width while the row swipes. Narrower cards show more of the next one. */
  itemWidth?: string;
  /** Slide to the next card by itself every this many milliseconds (see useAutoSlide for when it holds off). */
  autoPlayMs?: number;
  /** Stay a sliding row on every screen size, with arrows from tablet up, instead of becoming a grid. */
  carousel?: boolean;
  /** Names the row for screen readers when it is a carousel. */
  label?: string;
  /** Phones: the card the swipe row opens on, e.g. the featured one in the middle. */
  startIndex?: number;
}

const ARROW =
  'hidden size-11 place-items-center rounded-full border transition-colors duration-200 md:grid motion-reduce:transition-none';

/**
 * A row of cards that snaps card by card, with dots underneath.
 * Default: swipeable on phones, with the next card peeking in, and a normal grid from tablet up (one or two
 * cards simply stack on phones). `carousel`: a sliding row at every size.
 */
export function SnapRow({ children, className, tone = 'light', itemWidth = 'w-5/6', autoPlayMs, carousel = false, label, startIndex = 0 }: SnapRowProps) {
  const items = Children.toArray(children);
  const [active, setActive] = useState(0);
  const swipes = carousel || items.length > 2;
  const row = useRef<HTMLUListElement>(null);
  useAutoSlide(row, autoPlayMs, { phonesOnly: !carousel, enabled: swipes });

  // Open on the chosen card, without animating there.
  useEffect(() => {
    const el = row.current;
    const card = el?.children[startIndex] as HTMLElement | undefined;
    if (!el || !card || !startIndex || !swipes || el.scrollWidth <= el.clientWidth) return;
    el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.clientWidth) / 2, behavior: 'instant' });
  }, [startIndex, swipes]);

  const onScroll = (e: UIEvent<HTMLUListElement>) => {
    const el = e.currentTarget;
    const max = el.scrollWidth - el.clientWidth;
    if (max > 0) setActive(Math.round((el.scrollLeft / max) * (items.length - 1)));
  };
  const step = (by: number) => {
    const el = row.current;
    if (!el || el.children.length < 2) return;
    const width = (el.children[1] as HTMLElement).offsetLeft - (el.children[0] as HTMLElement).offsetLeft;
    el.scrollBy({ left: by * width, behavior: 'smooth' });
  };
  const dark = tone === 'dark';

  return (
    <div {...(carousel && { role: 'group', 'aria-roledescription': 'carousel', 'aria-label': label })}>
      <ul
        data-swipe={swipes || undefined}
        ref={row}
        onScroll={swipes ? onScroll : undefined}
        className={cn(
          // `relative` keeps screen-reader-only labels inside the cards within the row. Without it they are
          // placed against the page, and those in off-screen cards make the whole page wider than the phone.
          'relative gap-4',
          carousel
            ? 'no-scrollbar flex snap-x snap-mandatory overflow-x-auto'
            : cn(
                'md:grid',
                swipes
                  ? 'no-scrollbar -mx-4 flex snap-x snap-mandatory overflow-x-auto px-4 pb-1 md:mx-0 md:overflow-visible md:px-0 md:pb-0'
                  : 'flex flex-col',
              ),
          !carousel && className,
        )}
      >
        {items.map((item, i) => (
          <li key={i} className={cn(carousel ? `${itemWidth} shrink-0 snap-start` : 'md:w-auto', !carousel && swipes && `${itemWidth} shrink-0 snap-center`)}>
            {item}
          </li>
        ))}
      </ul>
      {swipes && (
        <div className={cn('mt-4 flex items-center justify-center gap-3', !carousel && 'md:hidden')}>
          {carousel && (
            <button
              type="button"
              aria-label="Previous"
              onClick={() => step(-1)}
              className={cn(ARROW, dark ? 'border-cream/40 text-cream hover:bg-cream hover:text-ink' : 'border-berry/30 text-berry hover:bg-berry hover:text-cream')}
            >
              <ChevronLeft aria-hidden className="size-5" />
            </button>
          )}
          <div aria-hidden className="flex justify-center gap-1.5">
            {items.map((_, i) => (
              <span
                key={i}
                className={cn(
                  'h-2 rounded-full transition-all duration-300 motion-reduce:transition-none',
                  dark ? 'bg-cream' : 'bg-berry',
                  i === active ? 'w-6' : 'w-2 opacity-30',
                )}
              />
            ))}
          </div>
          {carousel && (
            <button
              type="button"
              aria-label="Next"
              onClick={() => step(1)}
              className={cn(ARROW, dark ? 'border-cream/40 text-cream hover:bg-cream hover:text-ink' : 'border-berry/30 text-berry hover:bg-berry hover:text-cream')}
            >
              <ChevronRight aria-hidden className="size-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
