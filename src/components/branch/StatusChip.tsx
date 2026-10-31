import { Star } from 'lucide-react';
import { ratingLabel, type Salon } from '../../data/branches';
import { useSalonStatus } from '../../hooks/useSalonStatus';
import { cn } from '../../lib/cn';
import { isPrerender } from '../../lib/prerender';

const CHIP = 'inline-flex min-h-8 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold';

/**
 * "Open now · Closes 9:30 PM" in green, or "Closed · Opens 10:00 AM" in muted red, in salon time (Asia/Kolkata).
 * Each salon has its own hours. Says its state in words, not just colour.
 */
export function StatusChip({ salon, className }: { salon: Salon; className?: string }) {
  const { state } = useSalonStatus(salon);
  // The snapshot must not freeze whatever the time was at build.
  if (isPrerender) return <span className={cn(CHIP, 'bg-mint text-success', className)}>Open daily {salon.hours.shortLabel}</span>;
  const open = state === 'open' || state === 'closing';
  return (
    <span className={cn(CHIP, open ? 'bg-mint text-success' : 'bg-berry/10 text-berrydark', className)}>
      <span aria-hidden className="relative flex size-2">
        {open && <span className="absolute inline-flex size-full rounded-full bg-current opacity-75 motion-safe:animate-ping" />}
        <span className="relative inline-flex size-2 rounded-full bg-current" />
      </span>
      {open ? `Open now · Closes ${salon.hours.closesLabel}` : `Closed · Opens ${salon.hours.opensLabel}`}
    </span>
  );
}

/** The open/closed dot alone, with its meaning for screen readers (the header's salon menu). */
export function StatusDot({ salon }: { salon: Salon }) {
  const { state } = useSalonStatus(salon);
  if (isPrerender) return <span className="text-xs text-muted">Open daily</span>;
  const open = state === 'open' || state === 'closing';
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted">
      <span aria-hidden className={cn('size-2 rounded-full', open ? 'bg-success' : 'bg-berry/60')} />
      {open ? 'Open now' : 'Closed'}
    </span>
  );
}

/** "4.9 ★ · 490+ Google reviews" for a salon. */
export function RatingChip({ salon, className }: { salon: Salon; className?: string }) {
  return (
    <span className={cn(CHIP, 'bg-gold/15 font-medium text-ink', className)}>
      <Star aria-hidden className="size-3.5 fill-gold text-gold" />
      {ratingLabel(salon.rating).replace(' ★', '')}
    </span>
  );
}
