import { site } from '../../data/content';
import type { GiftTheme } from '../../data/giftMembership';
import { cn } from '../../lib/cn';

interface GiftCardPreviewProps {
  theme: GiftTheme;
  /** The occasion printed on the card ("Birthday"). */
  label: string;
  recipient?: string;
  message?: string;
  sender?: string;
  /** Announce changes to screen readers (the form's live preview). */
  live?: boolean;
  className?: string;
}

/**
 * The gift card as the recipient will see it, drawn in CSS: the occasion's colours, the logo, their name, the
 * message and the sender. Credit-card proportions, with a foil sweep that stops for reduced motion.
 */
export function GiftCardPreview({ theme, label, recipient, message, sender, live = false, className }: GiftCardPreviewProps) {
  const dark = theme.text === 'light';
  return (
    <figure
      aria-live={live ? 'polite' : undefined}
      aria-label={`Gift card preview: ${label}, for ${recipient || 'someone special'}${message ? `, message: ${message}` : ''}, from ${sender || 'you'}`}
      className={cn(
        'relative isolate flex aspect-[1.586/1] w-full flex-col justify-between overflow-hidden rounded-2xl p-5 shadow-lift sm:p-6',
        dark ? 'text-cream' : 'text-ink',
        className,
      )}
      style={{ backgroundImage: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
    >
      <span aria-hidden className={cn('pointer-events-none absolute inset-2 -z-10 rounded-xl border', dark ? 'border-gold/50' : 'border-golddeep/40')} />
      <span aria-hidden className="foil-sheen -z-10" />
      <div aria-hidden className="flex items-start justify-between gap-3">
        <img
          src={dark ? site.logo.lightSrc : site.logo.src}
          srcSet={dark ? site.logo.lightSrcSet : site.logo.srcSet}
          alt=""
          width={site.logo.width}
          height={site.logo.height}
          loading="lazy"
          decoding="async"
          className="h-8 w-auto sm:h-9"
        />
        <p className={cn('min-w-0 truncate font-display text-xl italic', dark ? 'text-gold' : 'text-golddeep')}>{label}</p>
      </div>
      <div aria-hidden className="min-w-0">
        <p className={cn('text-xs uppercase tracking-[0.2em]', dark ? 'text-cream/75' : 'text-ink/70')}>For</p>
        <p className="truncate font-display text-2xl font-medium leading-tight sm:text-3xl">{recipient || 'Someone special'}</p>
        {message && <p className={cn('mt-1 line-clamp-2 break-words text-sm leading-snug', dark ? 'text-cream/90' : 'text-ink/85')}>“{message}”</p>}
      </div>
      <p aria-hidden className={cn('truncate text-sm', dark ? 'text-cream/85' : 'text-ink/80')}>
        From {sender || 'You'}
      </p>
    </figure>
  );
}
