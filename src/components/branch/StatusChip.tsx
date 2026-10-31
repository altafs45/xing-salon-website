import { Star } from 'lucide-react';
import { ratingLabel, SALON_HOURS, type Salon } from '../../data/branches';
import { useSalonStatus } from '../../hooks/useSalonStatus';
import { cn } from '../../lib/cn';

const CHIP = 'inline-flex min-h-8 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold';

/**
 * "Open now · Closes 9:30 PM" in green, or "Closed · Opens 10:00 AM" in muted red, in salon time (Asia/Kolkata).
 * All three salons keep the same hours, so one status serves them all. Says its state in words, not just colour.
 */
export function StatusChip({ className }: { className?: string }) {
  const { state } = useSalonStatus();
  const open = state === 'open' || state === 'closing';
  return (
    <span className={cn(CHIP, open ? 'bg-mint text-success' : 'bg-berry/10 text-berrydark', className)}>
      <span aria-hidden className="relative flex size-2">
        {open && <span className="absolute inline-flex size-full rounded-full bg-current opacity-75 motion-safe:animate-ping" />}
        <span className="relative inline-flex size-2 rounded-full bg-current" />
      </span>
      {open ? `Open now · Closes ${SALON_HOURS.closesLabel}` : `Closed · Opens ${SALON_HOURS.opensLabel}`}
    </span>
  );
}

/** The open/closed dot alone, with its meaning for screen readers (the header's salon menu). */
export function StatusDot() {
  const { state } = useSalonStatus();
  const open = state === 'open' || state === 'closing';
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted">
      <span aria-hidden className={cn('size-2 rounded-full', open ? 'bg-success' : 'bg-berry/60')} />
      {open ? 'Open now' : 'Closed'}
    </span>
  );
}

/** "4.9 ★ · 1,552 Google reviews" for a salon that has its rating on file. */
export function RatingChip({ salon, className }: { salon: Salon; className?: string }) {
  if (!salon.rating) return null;
  return (
    <span className={cn(CHIP, 'bg-gold/15 font-medium text-ink', className)}>
      <Star aria-hidden className="size-3.5 fill-gold text-gold" />
      {ratingLabel(salon.rating).replace(' ★', '')}
    </span>
  );
}
