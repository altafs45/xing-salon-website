import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Clock, X } from 'lucide-react';
import { useBooking } from '../../context/booking';
import type { Salon } from '../../data/branches';
import {
  campaignPill,
  formatPrice,
  fromPrice,
  isCampaignOpen,
  maxSavingRupees,
  novemberCampaign,
  savingLabel,
  serviceOfferText,
  sheetOfferById,
  streakCost,
  STREAK_CHOICES,
  STREAKS_RECOMMENDED,
  type CampaignLine,
  type CampaignOffer,
} from '../../data/offers';
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

/** A page built before the end date still says "in stock" in its schema; this corrects it in the browser. */
export function useExpiredSchema() {
  useLayoutEffect(() => {
    if (isCampaignOpen()) return;
    document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
      script.textContent = (script.textContent ?? '').replaceAll('https://schema.org/InStock', 'https://schema.org/Discontinued');
    });
  }, []);
}

/** A poster or photo, full screen: pinch to zoom, swipe down or tap Close to leave. */
export function PosterZoom({ offer, onClose }: { offer: CampaignOffer | null; onClose: () => void }) {
  const start = useRef<number | null>(null);
  return (
    <Modal open={!!offer} onClose={onClose} label={offer ? `${offer.title} image` : 'Offer image'}>
      {offer && (
        <div
          className="relative bg-ink"
          onTouchStart={(e) => (start.current = e.touches.length === 1 ? e.touches[0].clientY : null)}
          onTouchEnd={(e) => {
            if (start.current !== null && e.changedTouches[0].clientY - start.current > SWIPE_CLOSE_PX) onClose();
            start.current = null;
          }}
        >
          <img src={offer.zoomSrc} alt={offer.poster.alt} width={offer.poster.width} height={offer.poster.height} style={{ touchAction: 'pinch-zoom' }} className="mx-auto max-h-[85svh] w-auto object-contain" />
          <button type="button" aria-label="Close" onClick={onClose} className="absolute right-2 top-2 grid size-11 place-items-center rounded-full bg-white/90 text-ink">
            <X aria-hidden className="size-5" />
          </button>
        </div>
      )}
    </Modal>
  );
}

function PriceLine({ line, compact }: { line: CampaignLine; compact: boolean }) {
  return (
    <div>
      <p className="flex flex-wrap items-baseline gap-x-2">
        {line.from && <span className="text-sm text-muted">from</span>}
        <s className="text-base tabular-nums text-muted">{formatPrice(line.was)}</s>
        <span className={cn('font-display font-medium tabular-nums text-berry', compact ? 'text-2xl' : 'text-3xl')}>{formatPrice(line.now)}</span>
        {line.unit && <span className="text-sm text-ink">{line.unit}</span>}
        {line.note && <span className="text-sm text-ink">{line.note}</span>}
      </p>
      <p className="mt-1 inline-block rounded-full bg-mint px-2.5 py-0.5 text-xs font-semibold text-success">{savingLabel(line)}</p>
    </div>
  );
}

function MenuTable({ offer }: { offer: CampaignOffer }) {
  return (
    <dl className="divide-y divide-ink/10 text-sm">
      {offer.lines.map((line) => (
        <div key={line.label} className="flex items-center justify-between gap-2 py-1.5">
          <dt className="min-w-[5.5rem] flex-1 text-ink">
            {line.label}
            {line.unit && <span className="block text-xs text-muted">{line.unit}</span>}
          </dt>
          <dd className="shrink-0 text-right tabular-nums">
            <s className="mr-1.5 text-xs text-muted">{formatPrice(line.was)}</s>
            <span className="font-semibold text-berry">
              {line.from && 'from '}
              {formatPrice(line.now)}
            </span>
          </dd>
        </div>
      ))}
    </dl>
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

interface NovemberCardProps {
  offer: CampaignOffer;
  placement: OfferPlacement;
  /** `compact` on the home page and salon pages. */
  variant?: 'full' | 'compact';
  /** A salon's own page: Claim goes straight to that salon, with no picker. */
  salon?: Salon;
  /** Links the card to the offers page instead of opening the sheet (the home page). */
  linkToPage?: boolean;
  priority?: boolean;
  highlighted?: boolean;
  onZoom?: (offer: CampaignOffer) => void;
}

/** A November offer: its image, the was / now price and saving in rupees, and Claim and Details. */
export function NovemberCard({ offer, placement, variant = 'full', salon, linkToPage = false, priority = false, highlighted = false, onZoom }: NovemberCardProps) {
  const sheets = useOfferSheets();
  const booking = useBooking();
  const chosen = useChosenSalon();
  const where = salon ?? chosen;
  const ref = useRef<HTMLElement>(null);
  const compact = variant === 'compact';
  const single = offer.lines.length === 1;
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
          track('nov_offer_view', params);
          track('view_promotion', { promotion_id: offer.id, promotion_name: offer.title, creative_slot: placement });
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offer.id, placement]);

  const PRIMARY = 'inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-berry px-4 text-sm font-semibold text-cream transition hover:bg-berrydark active:scale-[0.98]';
  const LINK = 'inline-flex min-h-11 items-center justify-center gap-1 rounded-full px-3 text-sm font-medium text-berry underline-offset-4 hover:underline';
  const picture = (
    <Picture
      image={compact ? offer.thumb : offer.poster}
      eager={priority}
      sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 90vw"
      className={cn('w-full object-cover', compact ? 'aspect-[4/3]' : 'aspect-[4/5]')}
    />
  );

  return (
    <article
      ref={ref}
      data-offer-card={offer.id}
      className={cn('relative flex h-full flex-col overflow-hidden rounded-3xl border border-berry/10 bg-white shadow-soft', highlighted && 'ring-4 ring-gold ring-offset-2 ring-offset-cream')}
    >
      <div className="relative shrink-0 overflow-hidden bg-blush">
        {onZoom ? (
          <button type="button" aria-label={`Enlarge ${offer.title} image`} onClick={() => onZoom(offer)} className="block w-full">
            {picture}
          </button>
        ) : (
          picture
        )}
        {offer.tag && <span className="absolute left-3 top-3 rounded-full bg-cream px-3 py-1 text-xs font-semibold text-berrydark shadow-soft">{offer.tag}</span>}
      </div>

      <div className={cn('relative flex flex-1 flex-col rounded-t-3xl bg-white', compact ? 'p-4' : '-mt-6 p-5')}>
        <h3 id={`${placement}-${offer.id}-title`} className={cn('font-display font-medium leading-tight text-ink', compact ? 'text-xl' : 'text-2xl')}>
          {offer.title}
        </h3>
        <div className="mt-2">
          {single ? (
            <PriceLine line={offer.lines[0]} compact={compact} />
          ) : compact ? (
            <>
              <p className="inline-block rounded-full bg-mint px-2.5 py-0.5 text-xs font-semibold text-success">{sheetOffer.badge}</p>
              <p className="mt-1.5 text-sm leading-snug text-muted">{offer.sub}</p>
            </>
          ) : (
            <MenuTable offer={offer} />
          )}
        </div>
        {!compact && offer.id === 'nov-highlights' && <StreakPicker />}

        {!compact && (
          <ul className="mt-3 space-y-1.5">
            {offer.bullets.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-ink">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
                {item}
              </li>
            ))}
          </ul>
        )}

        <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-success">
          <Clock aria-hidden className="size-3.5" />
          {compact ? campaignPill() : 'Valid till 30 Nov · all 3 salons'}
        </p>

        <div className="mt-auto flex items-center gap-2 pt-4">
          {salon ? (
            <a
              href={`${salon.whatsappHref}?text=${encodeURIComponent(claimText(sheetOffer, salon, 'Pick later'))}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                track('nov_offer_claim', params);
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
          {linkToPage ? (
            <a href={novemberCampaign.path} className={LINK}>
              {CTA.details}
              <ArrowRight aria-hidden className="size-4" />
            </a>
          ) : (
            !salon && (
              <button type="button" onClick={() => sheets.openDetails(offer.id, placement)} className={cn(LINK, 'border border-berry/30')}>
                {CTA.details}
                <span className="sr-only">: {offer.title}</span>
              </button>
            )
          )}
        </div>
        {!compact && (
          <button
            type="button"
            onClick={() => {
              track('nov_offer_book', params);
              booking.open(offer.bookingService, where?.name ?? '', '', `${offer.title} (${sheetOffer.claimDetail})`);
            }}
            className={cn(LINK, 'mt-1 self-center')}
          >
            {CTA.book}
            <span className="sr-only">: {offer.title}</span>
          </button>
        )}
      </div>
    </article>
  );
}

/** A salon page's swipe row of the three offers, each claimed at that salon. */
export function NovemberStrip({ salon }: { salon: Salon }) {
  useExpiredSchema();
  if (!isCampaignOpen()) return null;
  return (
    <section aria-labelledby="november-strip" data-cta="november_strip" data-gallery className="border-b border-ink/10 bg-blush py-8">
      <div className="container-site">
        <p className="text-eyebrow font-medium uppercase text-berry">{campaignPill()}</p>
        <h2 id="november-strip" className="heading mt-2 text-ink">
          November Hair Colour Offers
        </h2>
        <ul data-swipe className="no-scrollbar -mx-4 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          {novemberCampaign.offers.map((offer) => (
            <li key={offer.id} className="w-[82%] shrink-0 snap-start md:w-auto">
              <NovemberCard offer={offer} placement="salon" variant="compact" salon={salon} />
            </li>
          ))}
        </ul>
        <a href={novemberCampaign.path} className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-berry underline-offset-4 hover:underline">
          See all November offers
          <ArrowRight aria-hidden className="size-4" />
        </a>
      </div>
    </section>
  );
}

/** At the very top of /offers. */
export function NovemberBanner() {
  if (!isCampaignOpen()) return null;
  const [offer] = novemberCampaign.offers;
  return (
    <a href={novemberCampaign.path} data-cta="november_banner" className="block bg-berry pt-header-sm text-cream transition-colors hover:bg-berrydark lg:pt-header">
      <span className="container-site flex items-center gap-3 py-3">
        <Picture image={offer.thumb} eager decorative sizes="120px" className="h-20 w-16 shrink-0 rounded-xl object-cover" />
        <span className="min-w-0 flex-1 text-sm">
          <span className="block font-semibold">
            From {formatPrice(fromPrice())} · Save up to {formatPrice(maxSavingRupees())}
          </span>
          <span className="mt-0.5 inline-flex items-center gap-1 font-medium underline underline-offset-4">
            See November offers
            <ArrowRight aria-hidden className="size-4" />
          </span>
        </span>
      </span>
    </a>
  );
}

/** Which offer each colour service page points to. */
const SERVICE_OFFER: Record<string, number> = { 'global-hair-color': 0, highlights: 1, balayage: 2, 'fashion-color': 2 };

/** A slim offer bar near the top of the colour service pages. */
export function NovemberServiceLink({ slug }: { slug: string }) {
  const text = serviceOfferText(slug);
  if (!text) return null;
  return (
    <a href={`${novemberCampaign.path}#${novemberCampaign.offers[SERVICE_OFFER[slug]].id}`} className="block bg-berry text-cream hover:bg-berrydark">
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
