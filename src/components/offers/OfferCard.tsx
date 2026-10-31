import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { ArrowRight, Check, MapPin } from 'lucide-react';
import type { Salon } from '../../data/branches';
import { formatPrice, SHOW_PRICES, type SalonOffer } from '../../data/offers';
import { OFFER_CARD_SIZES } from '../../data/offerSizes';
import { track } from '../../lib/analytics';
import { cn } from '../../lib/cn';
import { isOfferToday, useChosenSalon, validAt, type OfferPlacement } from '../../lib/offers';
import { Picture } from '../ui/Primitives';
import { useOfferSheets } from './OfferSheets';

// Each card is counted once per page view.
const viewed = new Set<string>();

interface OfferCardProps {
  offer: SalonOffer;
  placement: OfferPlacement;
  /** `full` on /offers; `compact` on the home page and salon pages. */
  variant?: 'full' | 'compact';
  /** A salon's own page: the card is for that salon only. */
  salon?: Salon;
  /** The heading shown on the card; defaults to the offer's title. */
  heading?: string;
  headingLevel?: 'h2' | 'h3';
  /** Photo beside the text from desktop up (the wider cards on /offers). */
  wide?: boolean;
  /** The page's first offer photo: loaded first. */
  priority?: boolean;
  highlighted?: boolean;
  className?: string;
}

/**
 * An offer: photo with the deal as a badge, its tag, what it is and what you get, and Claim / Details. Tapping the
 * card opens the details sheet. The same card, and so the same wording, on /offers, the home page and salon pages.
 */
export function OfferCard({ offer, placement, variant = 'full', salon, heading, headingLevel: Heading = 'h3', wide = false, priority = false, highlighted = false, className }: OfferCardProps) {
  const sheets = useOfferSheets();
  const chosen = useChosenSalon();
  const where = salon ?? chosen;
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);
  const [today, setToday] = useState(false);
  const compact = variant === 'compact';
  const tag = today ? 'Today' : offer.tag;

  // "Today" is worked out in the browser, in salon time.
  useEffect(() => setToday(isOfferToday(offer)), [offer]);

  // Half the card on screen: shimmer the badge once and count the view.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return setSeen(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setSeen(true);
        const key = `${placement}:${offer.id}`;
        if (!viewed.has(key)) {
          viewed.add(key);
          track('offer_view', { offer_id: offer.id, placement, branch: where?.id ?? 'none' });
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [offer.id, placement, where?.id]);

  const openDetails = () => sheets.openDetails(offer.id, placement, salon?.id);
  // A tap anywhere on the card opens the details, except on its own buttons and links.
  const onCardClick = (e: MouseEvent) => {
    if ((e.target as Element).closest('a, button')) return;
    openDetails();
  };

  return (
    <article
      ref={ref}
      data-offer-card={offer.id}
      data-seen={seen || undefined}
      onClick={onCardClick}
      className={cn(
        'group/offer svc-card relative flex h-full cursor-pointer flex-col overflow-hidden transition duration-200',
        'active:scale-[0.98] lg:hover:-translate-y-1 lg:hover:shadow-lift motion-reduce:transition-none motion-reduce:active:scale-100 motion-reduce:lg:hover:translate-y-0',
        wide && 'lg:flex-row',
        highlighted && 'ring-4 ring-gold ring-offset-2 ring-offset-cream',
        className,
      )}
    >
      <div className={cn('relative shrink-0 overflow-hidden bg-blush', compact ? 'aspect-[16/10]' : 'aspect-[4/3]', wide && 'lg:aspect-auto lg:w-[46%]')}>
        <Picture image={offer.image} eager={priority} priority={priority} sizes={OFFER_CARD_SIZES} className="absolute inset-0 size-full object-cover" />
        <span className={cn('offer-badge absolute left-3 top-3 max-w-[calc(100%-1.5rem)] whitespace-nowrap', compact ? 'text-[0.8125rem]' : 'text-base sm:text-lg', wide && 'lg:text-sm')}>
          <span className="relative z-10">{offer.badge}</span>
          <span aria-hidden className="offer-badge-shine" />
        </span>
        {tag && (
          <span
            className={cn(
              'absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-soft',
              tag === 'Today' ? 'bg-success text-white' : 'bg-cream text-berrydark',
            )}
          >
            {tag === 'Today' && <span aria-hidden className="size-2 rounded-full bg-white motion-safe:animate-pulse" />}
            {tag}
          </span>
        )}
      </div>

      <div className={cn('flex flex-1 flex-col', compact ? 'p-4' : 'p-5 sm:p-6')}>
        <Heading id={`${placement}-${offer.id}-title`} className={cn('font-display font-medium leading-tight text-ink', compact ? 'text-xl' : 'text-2xl')}>
          {heading ?? offer.title}
        </Heading>
        <p className={cn('mt-1.5 text-muted', compact ? 'text-sm leading-snug' : 'text-base leading-relaxed')}>{offer.sub}</p>

        {!compact && offer.options && (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Choose from">
            {offer.options.map((option) => (
              <li key={option.name} className="rounded-full bg-blush px-2.5 py-1 text-xs text-ink">
                {option.name} <span className="font-semibold text-berry">· {option.saving}</span>
              </li>
            ))}
          </ul>
        )}

        {!compact && (
          <ul className="mt-4 space-y-1.5">
            {offer.includes.slice(0, 3).map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-ink">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
                {item}
              </li>
            ))}
          </ul>
        )}

        {SHOW_PRICES && offer.prices?.length === 1 && (
          <p className="mt-3 flex items-baseline gap-2 text-sm">
            <span className="font-semibold text-berry">Now {formatPrice(offer.prices[0].now)}</span>
            <s className="text-xs text-muted">Was {formatPrice(offer.prices[0].was)}</s>
          </p>
        )}

        <p className={cn('flex items-center gap-1.5 text-xs font-medium text-success', compact ? 'mt-3' : 'mt-4')}>
          <MapPin aria-hidden className="size-3.5" />
          {validAt(offer, where)}
        </p>

        <div className={cn('mt-auto flex items-center gap-3', compact ? 'pt-4' : 'pt-5')}>
          <button
            type="button"
            onClick={() => sheets.openClaim(offer.id, placement, salon?.id)}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-berry px-5 text-sm font-semibold text-cream transition-colors hover:bg-berrydark"
          >
            {compact ? 'Claim' : 'Claim Offer'}
            <span className="sr-only">: {offer.title}</span>
          </button>
          <button
            type="button"
            onClick={openDetails}
            className={cn(
              'inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full text-sm font-medium text-berry',
              compact ? 'px-2 underline-offset-4 hover:underline' : 'flex-1 border border-berry px-5 hover:bg-berry hover:text-cream',
            )}
          >
            Details
            <span className="sr-only">: {offer.title}</span>
            {compact && <ArrowRight aria-hidden className="size-4" />}
          </button>
        </div>
      </div>
    </article>
  );
}
