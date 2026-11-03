import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Clock, X } from 'lucide-react';
import { useBooking } from '../../context/booking';
import { locations, type Salon } from '../../data/branches';
import { categoryById, formatPrice, offersIn, savingLabel, type CatalogOffer, type OfferImage, type OfferLine } from '../../data/offerCatalog';
import { campaignPill, isCampaignOpen, sheetOfferById, serviceOfferText, streakCost, STREAK_CHOICES, STREAKS_RECOMMENDED } from '../../data/offers';
import { CTA } from '../../data/style';
import { track } from '../../lib/analytics';
import { cn } from '../../lib/cn';
import { claimText, useChosenSalon, type OfferPlacement } from '../../lib/offers';
import { Modal } from '../ui/Modal';
import { Picture } from '../ui/Primitives';
import { useOfferSheets } from './OfferSheets';

// Each card is counted once per page view.
const viewed = new Set<string>();
const SWIPE_CLOSE_PX = 90;

/** A page built before the campaign's end still says "in stock" in its schema; this corrects it in the browser. */
export function useExpiredSchema() {
  useLayoutEffect(() => {
    if (isCampaignOpen()) return;
    document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
      script.textContent = (script.textContent ?? '').replaceAll('https://schema.org/InStock', 'https://schema.org/Discontinued');
    });
  }, []);
}

/** An offer image, full screen: pinch to zoom, swipe down or tap Close to leave. */
export function ImageZoom({ image, onClose }: { image: OfferImage | null; onClose: () => void }) {
  const start = useRef<number | null>(null);
  return (
    <Modal open={!!image} onClose={onClose} label={image ? image.alt : 'Offer image'}>
      {image && (
        <div
          className="relative bg-ink"
          onTouchStart={(e) => (start.current = e.touches.length === 1 ? e.touches[0].clientY : null)}
          onTouchEnd={(e) => {
            if (start.current !== null && e.changedTouches[0].clientY - start.current > SWIPE_CLOSE_PX) onClose();
            start.current = null;
          }}
        >
          {/* The largest file, for a sharp zoom. */}
          <img src={image.src.replace(/-800\.webp$/, '-1200.webp')} alt={image.alt} width={image.width} height={image.height} style={{ touchAction: 'pinch-zoom' }} className="mx-auto max-h-[85svh] w-auto object-contain" />
          <button type="button" aria-label="Close" onClick={onClose} className="absolute right-2 top-2 grid size-11 place-items-center rounded-full bg-white/90 text-ink">
            <X aria-hidden className="size-5" />
          </button>
        </div>
      )}
    </Modal>
  );
}

/** ~~was~~ **now** with its unit, and the saving in rupees. */
export function PriceLine({ line, size = 'lg' }: { line: OfferLine; size?: 'md' | 'lg' }) {
  const saving = savingLabel(line);
  return (
    <div className="min-w-0">
      <p className="flex flex-wrap items-baseline gap-x-2">
        {line.from && <span className="text-sm text-muted">from</span>}
        {line.was && <s className="text-base tabular-nums text-muted">{formatPrice(line.was)}</s>}
        <span className={cn('font-display font-medium tabular-nums text-berry', size === 'lg' ? 'text-[2rem] leading-none' : 'text-2xl leading-none')}>{formatPrice(line.now)}</span>
        {line.unit && <span className="text-sm text-ink">{line.unit}</span>}
        {line.note && <span className="text-sm text-ink">{line.note}</span>}
      </p>
      {saving && <p className="mt-1.5 inline-block rounded-full bg-mint px-2.5 py-0.5 text-xs font-semibold text-success">{saving}</p>}
    </div>
  );
}

/** Highlights: pick a number of streaks, see the whole bill. */
function StreakPicker() {
  const [count, setCount] = useState<number>(STREAKS_RECOMMENDED.min);
  return (
    <div className="mt-3">
      <div role="radiogroup" aria-label="Number of streaks" className="flex gap-2">
        {STREAK_CHOICES.map((choice) => (
          <button
            key={choice}
            type="button"
            role="radio"
            aria-checked={choice === count}
            onClick={() => setCount(choice)}
            className={cn('min-h-11 flex-1 rounded-full border px-3 text-sm font-medium', choice === count ? 'border-berry bg-berry text-cream' : 'border-ink/15 bg-white text-ink')}
          >
            {choice}
          </button>
        ))}
      </div>
      <p aria-live="polite" className="mt-2 text-sm font-medium text-ink">
        {count} streaks ≈ {formatPrice(streakCost(count))}
      </p>
    </div>
  );
}

/** "Valid till 30 Nov · all 3 salons", "Limited-time offer · HSR Layout". */
export const validLine = (offer: CatalogOffer, salon?: Salon) => {
  const where =
    salon && offer.branches.includes(salon.id)
      ? salon.name
      : offer.branches.length === locations.length
        ? 'all 3 salons'
        : locations.filter((loc) => offer.branches.includes(loc.id)).map((loc) => loc.name).join(', ');
  const when = offer.validUntil && isCampaignOpen() ? 'Valid till 30 Nov' : 'Limited-time offer';
  return `${when} · ${salon && offer.branches.includes(salon.id) ? `valid at ${where}` : where}`;
};

interface CatalogCardProps {
  offer: CatalogOffer;
  placement: OfferPlacement;
  /** `compact` on the home page and salon pages. */
  variant?: 'full' | 'compact';
  /** A salon's own page: Claim goes straight to that salon, with no picker. */
  salon?: Salon;
  priority?: boolean;
  onZoom?: (image: OfferImage) => void;
}

/** One offer: its photo, the was / now price and saving, three bullets, Claim and View Details. */
export function CatalogCard({ offer, placement, variant = 'full', salon, priority = false, onZoom }: CatalogCardProps) {
  const sheets = useOfferSheets();
  const booking = useBooking();
  const chosen = useChosenSalon();
  const where = salon ?? chosen;
  const ref = useRef<HTMLElement>(null);
  const compact = variant === 'compact';
  const params = { offer_id: offer.id, placement, branch: where?.id ?? 'none', page: location.pathname };
  const sheetOffer = sheetOfferById(offer.id)!;

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const key = `${placement}:${offer.id}`;
        if (!viewed.has(key)) {
          viewed.add(key);
          track('offer_view', params);
          track('view_promotion', { promotion_id: offer.id, promotion_name: offer.title, creative_slot: placement });
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offer.id, placement]);

  const PRIMARY = 'inline-flex min-h-12 min-w-0 flex-1 items-center justify-center rounded-full bg-berry px-4 text-sm font-semibold text-cream transition hover:bg-berrydark active:scale-[0.98]';
  const SECONDARY = 'inline-flex min-h-12 shrink-0 items-center justify-center rounded-full border border-berry/30 px-4 text-sm font-medium text-berry transition hover:border-berry active:scale-[0.98]';
  const picture = (
    <Picture
      image={offer.image}
      eager={priority}
      priority={priority}
      sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, calc(100vw - 32px)"
      className="aspect-[4/3] w-full bg-blush object-cover md:aspect-[4/5]"
    />
  );

  return (
    <article ref={ref} data-offer-card={offer.id} className="flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-berry/10 bg-white shadow-soft">
      <div className={cn('relative shrink-0 overflow-hidden bg-blush', compact && '[&_img]:aspect-[4/3]')}>
        {onZoom ? (
          <button type="button" aria-label={`Enlarge ${offer.title} photo`} onClick={() => onZoom(offer.image)} className="block w-full">
            {picture}
          </button>
        ) : (
          picture
        )}
      </div>

      <div className={cn('flex min-w-0 flex-1 flex-col [overflow-wrap:anywhere]', compact ? 'p-4' : 'p-5')}>
        <h3 id={`${placement}-${offer.id}-title`} className={cn('text-balance font-display font-medium leading-tight text-ink', compact ? 'text-xl' : 'text-2xl')}>
          {offer.title}
        </h3>
        <div className="mt-2">
          <PriceLine line={offer.lines[0]} size={compact ? 'md' : 'lg'} />
        </div>
        {!compact && offer.id === 'highlights' && <StreakPicker />}

        {!compact && (
          <ul className="mt-3 space-y-1.5">
            {offer.includes.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-ink">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
                {item}
              </li>
            ))}
          </ul>
        )}

        <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-muted">
          <Clock aria-hidden className="size-3.5 shrink-0" />
          {compact && offer.validUntil && isCampaignOpen() ? campaignPill() : validLine(offer, where)}
        </p>

        <div className="mt-auto flex items-center gap-2 pt-4">
          {salon ? (
            <a
              href={`${salon.whatsappHref}?text=${encodeURIComponent(claimText(sheetOffer, salon, 'Pick later'))}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                track('offer_claim', params);
                track('select_promotion', { promotion_id: offer.id, promotion_name: offer.title, creative_slot: placement });
              }}
              className={PRIMARY}
            >
              {CTA.claim}: {salon.name}
              <span className="sr-only">: {offer.title}</span>
            </a>
          ) : (
            <button type="button" onClick={() => sheets.openClaim(offer.id, placement)} className={PRIMARY}>
              {CTA.claim}
              <span className="sr-only">: {offer.title}</span>
            </button>
          )}
          {!salon && (
            <button type="button" onClick={() => sheets.openDetails(offer.id, placement)} className={SECONDARY}>
              {CTA.details}
              <span className="sr-only">: {offer.title}</span>
            </button>
          )}
        </div>
        {!compact && (
          <button
            type="button"
            onClick={() => {
              track('offer_claim_book', params);
              booking.open(offer.bookingService, where?.name ?? '', '', `${offer.title} (${sheetOffer.claimDetail})`);
            }}
            className="mt-1 inline-flex min-h-11 items-center justify-center self-center px-3 text-sm font-medium text-berry underline-offset-4 hover:underline"
          >
            {CTA.book}
            <span className="sr-only">: {offer.title}</span>
          </button>
        )}
      </div>
    </article>
  );
}

/** A salon page's swipe row of the hair colour offers, each claimed at that salon. */
export function CampaignStrip({ salon }: { salon: Salon }) {
  useExpiredSchema();
  if (!isCampaignOpen()) return null;
  const category = categoryById('hair-colour');
  return (
    <section aria-labelledby="campaign-strip" data-cta="campaign_strip" data-gallery className="border-b border-ink/10 bg-blush py-8">
      <div className="container-site">
        <p className="text-eyebrow font-medium uppercase text-berry">{campaignPill()}</p>
        <h2 id="campaign-strip" className="heading mt-2 text-balance text-ink">
          {category.h1.replace(' in Bangalore', '')}
        </h2>
        <ul data-swipe className="no-scrollbar -mx-4 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4">
          {offersIn('hair-colour').map((offer) => (
            <li key={offer.id} className="w-[82%] shrink-0 snap-start md:w-auto">
              <CatalogCard offer={offer} placement="salon" variant="compact" salon={salon} />
            </li>
          ))}
        </ul>
        <a href={category.path} className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-berry underline-offset-4 hover:underline">
          See all hair colour offers
          <ArrowRight aria-hidden className="size-4" />
        </a>
      </div>
    </section>
  );
}

/** Which offer each colour service page points to. */
const SERVICE_OFFER: Record<string, string> = { 'global-hair-color': 'global-colour', highlights: 'highlights', balayage: 'balayage', 'fashion-color': 'fashion-colour' };

/** A slim offer bar near the top of the colour service pages, while the campaign is open. */
export function OfferServiceLink({ slug }: { slug: string }) {
  const text = serviceOfferText(slug);
  if (!text) return null;
  return (
    <a href={`${categoryById('hair-colour').path}#${SERVICE_OFFER[slug]}`} className="block bg-berry text-cream hover:bg-berrydark">
      <span className="container-site flex min-h-12 items-center justify-between gap-3 py-2 text-sm font-medium">
        {text}
        <span className="inline-flex shrink-0 items-center gap-1 font-semibold">
          See offer
          <ArrowRight aria-hidden className="size-4" />
        </span>
      </span>
    </a>
  );
}
