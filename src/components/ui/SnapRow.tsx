import { Children, useState, type ReactNode, type UIEvent } from 'react';
import { cn } from '../../lib/cn';

interface SnapRowProps {
  children: ReactNode;
  /** Grid columns from tablet up, e.g. "md:grid-cols-4". */
  className?: string;
  /** Dot colour for rows that sit on a dark background. */
  tone?: 'light' | 'dark';
}

/**
 * Phones: a swipeable row that snaps card by card, with the next card peeking in and dots underneath.
 * Tablet and up: a normal grid. One or two cards simply stack on phones.
 */
export function SnapRow({ children, className, tone = 'light' }: SnapRowProps) {
  const items = Children.toArray(children);
  const [active, setActive] = useState(0);
  const swipes = items.length > 2;

  const onScroll = (e: UIEvent<HTMLUListElement>) => {
    const el = e.currentTarget;
    const max = el.scrollWidth - el.clientWidth;
    if (max > 0) setActive(Math.round((el.scrollLeft / max) * (items.length - 1)));
  };

  return (
    <>
      <ul
        onScroll={swipes ? onScroll : undefined}
        className={cn(
          'gap-4 md:grid',
          swipes
            ? 'no-scrollbar -mx-4 flex snap-x snap-mandatory overflow-x-auto px-4 pb-1 md:mx-0 md:overflow-visible md:px-0 md:pb-0'
            : 'flex flex-col',
          className,
        )}
      >
        {items.map((item, i) => (
          <li key={i} className={cn('md:w-auto', swipes && 'w-5/6 shrink-0 snap-center')}>
            {item}
          </li>
        ))}
      </ul>
      {swipes && (
        <div aria-hidden className="mt-4 flex justify-center gap-1.5 md:hidden">
          {items.map((_, i) => (
            <span
              key={i}
              className={cn(
                'h-2 rounded-full transition-all duration-300 motion-reduce:transition-none',
                tone === 'dark' ? 'bg-cream' : 'bg-berry',
                i === active ? 'w-6' : 'w-2 opacity-30',
              )}
            />
          ))}
        </div>
      )}
    </>
  );
}
