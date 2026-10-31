import { useEffect, useLayoutEffect, useRef } from 'react';
import { ArrowRight, Check, Clock, MapPin } from 'lucide-react';
import { useBooking } from '../../context/booking';
import type { Salon } from '../../data/branches';
import {
  campaignCountdown,
  formatPrice,
  isCampaignLive,
  isCampaignOpen,
  maxSavingRupees,
  novemberCampaign,
  PRICE_NOTE,
  promoHref,
  savingLabel,
  sheetOfferById,
  streakRange,
  type CampaignLine,
  type CampaignOffer,
} from '../../data/offers';
import { track } from '../../lib/analytics';
import { cn } from '../../lib/cn';
import { claimText, useChosenSalon, type OfferPlacement } from '../../lib/offers';
import { Picture } from '../ui/Primitives';
import { useOfferSheets } from './OfferSheets';

// Each card is counted once per page view.
const viewed = new Set<string>();

/** A page built before the end date still says "in stock" in its schema; this corrects it in the browser. */
export function useExpiredSchema() {
  useLayoutEffect(() => {
    if (isCampaignOpen()) return;
    document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
      script.textContent = (script.textContent ?? '').replaceAll('https://schema.org/InStock', 'https://schema.org/Discontinued');
    });
  }, []);
}

/** The "Nov" tag on the Offers link while the campaign is live. */
export function NovBadge() {
  if (!isCampaignLive()) return null;
  return <span className="ml-1.5 inline-block rounded-full bg-berry px-1.5 py-0.5 align-middle font-sans text-[0.625rem] font-semibold not-italic leading-none text-cream">Nov</span>;
}

function PriceLine({ line, compact }: { line: CampaignLine; compact: boolean }) {
  return (
    <div>
      <p className="flex flex-wrap items-baseline gap-x-2">
        {line.from && <span className="text-sm text-muted">from</span>}
        <s className="text-sm text-muted">{formatPrice(line.was)}</s>
        <span className={cn('font-display font-medium text-berry', compact ? 'text-2xl' : 'text-3xl')}>{formatPrice(line.now)}</span>
        {line.unit && <span className="text-sm text-ink">{line.unit}</span>}
        {line.note && <span className="text-sm text-ink">{line.note}</span>}
      </p>
      <p className="mt-1 inline-block rounded-full bg-success px-2.5 py-0.5 text-xs font-semibold text-white">{savingLabel(line)}</p>
    </div>
  );
}

function MenuTable({ offer }: { offer: CampaignOffer }) {
  return (
    <dl className="divide-y divide-ink/10 rounded-2xl bg-blush/60 px-3 text-sm">
      {offer.lines.map((line) => (
        <div key={line.label} className="flex items-center justify-between gap-2 py-2">
          <dt className="min-w-[5.5rem] flex-1 text-ink">
            {line.label}
            {line.unit && <span className="block text-xs text-muted">{line.unit}</span>}
          </dt>
          <dd className="shrink-0 text-right">
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

interface NovemberCardProps {
  offer: CampaignOffer;
  placement: OfferPlacement;
  /** `compact` on salon pages and the home page. */
  variant?: 'full' | 'compact';
  /** A salon's own page: Claim goes straight to that salon, with no picker. */
  salon?: Salon;
  /** Links the card to the offers page instead of opening the sheet (the home page). */
  linkToPage?: boolean;
  priority?: boolean;
  highlighted?: boolean;
}

/** A November offer: photo, the was / now price and saving in rupees, and Claim, Book and Details. */
export function NovemberCard({ offer, placement, variant = 'full', salon, linkToPage = false, priority = false, highlighted = false }: NovemberCardProps) {
  const sheets = useOfferSheets();
  const booking = useBooking();
  const chosen = useChosenSalon();
  const where = salon ?? chosen;
  const ref = useRef<HTMLElement>(null);
  const compact = variant === 'compact';
  const single = offer.lines.length === 1;
  const params = { offer_id: offer.id, placement, branch: where?.id ?? 'none' };
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
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offer.id, placement]);

  const PRIMARY = 'inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-berry px-4 text-sm font-semibold text-cream transition-colors hover:bg-berrydark';
  const LINK = 'inline-flex min-h-11 items-center justify-center gap-1 rounded-full px-2 text-sm font-medium text-berry underline-offset-4 hover:underline';

  return (
    <article
      ref={ref}
      data-offer-card={offer.id}
      className={cn('svc-card relative flex h-full flex-col overflow-hidden transition duration-200', highlighted && 'ring-4 ring-gold ring-offset-2 ring-offset-cream')}
    >
      <div className={cn('relative shrink-0 overflow-hidden bg-blush', compact ? 'aspect-[4/3]' : 'aspect-[4/5]')}>
        <Picture image={offer.poster} eager={priority} priority={priority} sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 90vw" className="absolute inset-0 size-full object-cover object-[50%_20%]" />
        {offer.tag && <span className="absolute left-3 top-3 rounded-full bg-cream px-3 py-1 text-xs font-semibold text-berrydark shadow-soft">{offer.tag}</span>}
      </div>

      <div className={cn('flex flex-1 flex-col', compact ? 'p-4' : 'p-5')}>
        <h3 id={`${placement}-${offer.id}-title`} className={cn('font-display font-medium leading-tight text-ink', compact ? 'text-xl' : 'text-2xl')}>
          {offer.title}
        </h3>
        <div className="mt-2">
          {single ? (
            <PriceLine line={offer.lines[0]} compact={compact} />
          ) : linkToPage ? (
            // The home page's column is too narrow for the price table.
            <>
              <p className="inline-block rounded-full bg-success px-2.5 py-0.5 text-xs font-semibold text-white">{sheetOffer.badge}</p>
              <p className="mt-1.5 text-sm leading-snug text-muted">{offer.sub}</p>
            </>
          ) : (
            <MenuTable offer={offer} />
          )}
        </div>
        {offer.lines[0].unit && single && <p className="mt-2 text-sm font-medium text-ink">8–10 streaks ≈ {streakRange()} total</p>}

        {!compact && (
          <>
            <ul className="mt-3 space-y-1.5">
              {offer.includes.slice(0, 3).map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-ink">
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted">{offer.duration}</p>
          </>
        )}

        <p className={cn('flex items-center gap-1.5 text-xs font-medium text-success', compact ? 'mt-3' : 'mt-3')}>
          {compact ? <Clock aria-hidden className="size-3.5" /> : <MapPin aria-hidden className="size-3.5" />}
          {compact ? campaignCountdown() : 'Valid till 30 Nov · all 3 salons'}
        </p>
        <p className="mt-1 text-xs leading-snug text-muted">{PRICE_NOTE}</p>

        <div className="mt-auto flex items-center gap-2 pt-4">
          {salon ? (
            <a
              href={`${salon.whatsappHref}?text=${encodeURIComponent(claimText(sheetOffer, salon, 'Pick later'))}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('nov_offer_claim', params)}
              className={PRIMARY}
            >
              Claim
              <span className="sr-only">: {offer.title}</span>
            </a>
          ) : (
            <button type="button" onClick={() => sheets.openClaim(offer.id, placement)} className={PRIMARY}>
              Claim
              <span className="sr-only">: {offer.title}</span>
            </button>
          )}
          {!compact && (
            <button
              type="button"
              onClick={() => {
                track('nov_offer_book', params);
                booking.open(offer.bookingService, where?.name ?? '', '', `${offer.title} (${sheetOffer.claimDetail})`);
              }}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-berry px-4 text-sm font-semibold text-berry hover:bg-berry hover:text-cream"
            >
              Book
              <span className="sr-only">: {offer.title}</span>
            </button>
          )}
          {linkToPage ? (
            <a href={novemberCampaign.path} className={LINK}>
              Details
              <ArrowRight aria-hidden className="size-4" />
            </a>
          ) : compact ? (
            <a href={promoHref(offer.id)} className={LINK}>
              Details
              <ArrowRight aria-hidden className="size-4" />
            </a>
          ) : null}
        </div>
        {!compact && (
          <button type="button" onClick={() => sheets.openDetails(offer.id, placement)} className={cn(LINK, 'mt-1 self-center')}>
            Details &amp; terms
            <span className="sr-only">: {offer.title}</span>
          </button>
        )}
      </div>
    </article>
  );
}

/** On a salon's page: the three November offers, each claimed at that salon. */
export function NovemberStrip({ salon }: { salon: Salon }) {
  useExpiredSchema();
  if (!isCampaignLive()) return null;
  return (
    <div data-cta="november_strip" className="mb-12">
      <p className="text-eyebrow font-medium uppercase text-berry">{campaignCountdown()}</p>
      <h2 className="heading mt-3 text-ink">November Hair Colour Offers</h2>
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {novemberCampaign.offers.map((offer) => (
          <li key={offer.id}>
            <NovemberCard offer={offer} placement="salon" variant="compact" salon={salon} />
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm">
        <a href={novemberCampaign.path} className="inline-flex min-h-11 items-center gap-1 font-medium text-berry underline-offset-4 hover:underline">
          See all November offer details
          <ArrowRight aria-hidden className="size-4" />
        </a>
      </p>
    </div>
  );
}

/** At the top of /offers. */
export function NovemberBanner() {
  if (!isCampaignLive()) return null;
  return (
    <a href={novemberCampaign.path} data-cta="november_banner" className="block bg-berry text-cream transition-colors hover:bg-berrydark">
      <span className="container-site flex min-h-14 flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3 text-sm font-medium">
        <span>November: Save up to {formatPrice(maxSavingRupees())} on hair colour · {campaignCountdown()}</span>
        <span className="inline-flex items-center gap-1 font-semibold">
          View November offers
          <ArrowRight aria-hidden className="size-4" />
        </span>
      </span>
    </a>
  );
}

/** On the colour service pages, above their own offers. */
export function NovemberServiceLink({ slug }: { slug: string }) {
  const offer = novemberCampaign.offers.find((item) => item.serviceLink === `/services/${slug}`);
  const hasOffer = offer ?? (slug === 'global-hair-color' || slug === 'highlights' || slug === 'balayage' ? novemberCampaign.offers[2] : undefined);
  if (!hasOffer || !isCampaignLive()) return null;
  return (
    <a href={promoHref(hasOffer.id)} className="mb-8 flex min-h-14 flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-card bg-berry px-5 py-3 text-sm font-medium text-cream hover:bg-berrydark">
      <span>November hair colour offer: {hasOffer.title} · {campaignCountdown()}</span>
      <span className="inline-flex items-center gap-1 font-semibold">
        See the offer
        <ArrowRight aria-hidden className="size-4" />
      </span>
    </a>
  );
}
