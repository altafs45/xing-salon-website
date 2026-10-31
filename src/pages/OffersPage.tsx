import { lazy, Suspense, useEffect, useRef, useState, type UIEvent } from 'react';
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Navigation, Phone, Sparkles, Star } from 'lucide-react';
import { StatusChip } from '../components/branch/StatusChip';
import { NovemberBanner } from '../components/offers/NovemberBits';
import { OfferCard } from '../components/offers/OfferCard';
import { FAQAccordion } from '../components/service/FAQAccordion';
import { MobileStickyBar } from '../components/service/MobileStickyBar';
import { Section, SectionHeader } from '../components/service/SectionHeader';
import { CTABand, ProcessStepper } from '../components/service/Sections';
import { WhatsAppIcon } from '../components/ui/Decor';
import { Eyebrow, Reveal } from '../components/ui/Primitives';
import { useBooking } from '../context/booking';
import { locations } from '../data/branches';
import { beforeAfter } from '../data/media';
import { isCampaignOpen, salonOfferById, salonOffers, type SalonOffer, type SalonOfferId } from '../data/offers';
import { offersPage, type OfferFilter } from '../data/offersPage';
import { track } from '../lib/analytics';
import { clearBranch, setBranch } from '../lib/branch';
import { cn } from '../lib/cn';
import { generalClaimHref, useChosenSalon } from '../lib/offers';
import { PICK_CALL, PICK_DIRECTIONS } from '../lib/whatsapp';

// The before/after slider loads once its section is reached.
const BeforeAfter = lazy(() => import('../components/BeforeAfter').then((module) => ({ default: module.BeforeAfter })));

const HIGHLIGHT_MS = 2500;
const PILL = 'inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border px-4 text-sm font-medium transition-colors duration-150';
const GOOGLE_REVIEWS = 'https://www.google.com/maps/search/?api=1&query=Xing+Premium+Unisex+Salon+Bangalore';

const matches = (offer: SalonOffer, filter: OfferFilter) =>
  filter === 'all-offers' || (filter === 'tuesday' ? offer.id === 'tuesday' : offer.category === filter);

/** Desktop: with every offer showing, Hydra and Keratin sit wide on the first row and Gift Cards closes the grid. */
const span = (offer: SalonOffer, count: number, all: boolean) => {
  if (!all) return count <= 2 ? { className: 'lg:col-span-3', wide: true } : { className: 'lg:col-span-2', wide: false };
  if (offer.id === 'hydra-facial' || offer.id === 'keratin') return { className: 'lg:col-span-3', wide: true };
  if (offer.id === 'gift-card') return { className: 'lg:col-span-6', wide: true };
  return { className: 'lg:col-span-2', wide: false };
};

/** /offers: every current offer in one swipeable deck, with details and a two-tap claim. */
export default function OffersPage() {
  const salon = useChosenSalon();
  const booking = useBooking();
  const [filter, setFilter] = useState<OfferFilter>('all-offers');
  const [highlight, setHighlight] = useState<SalonOfferId | null>(null);
  const shown = salonOffers.filter((offer) => matches(offer, filter));

  const chooseFilter = (next: OfferFilter) => {
    setFilter(next);
    track('filter_select', { filter: next, placement: 'offers', branch: salon?.id ?? 'none' });
  };

  /** "Not sure which one?": shows the suggested offer and draws attention to it. */
  const pick = (id: SalonOfferId) => {
    setFilter('all-offers');
    setHighlight(id);
    window.setTimeout(() => setHighlight(null), HIGHLIGHT_MS);
    requestAnimationFrame(() => {
      const card = document.querySelector<HTMLElement>(`[data-offer-card="${id}"]`);
      const row = card?.closest('ul');
      if (card && row && row.scrollWidth > row.clientWidth) row.scrollTo({ left: card.parentElement!.offsetLeft - 16, behavior: 'smooth' });
      card?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  return (
    <div data-cta="offers_page">
      <NovemberBanner />
      <Hero />

      {/* Filters, kept in reach under the header while scrolling the deck. */}
      <div className="under-header sticky z-20 border-b border-ink/10 bg-cream/95 backdrop-blur-md">
        <div role="toolbar" aria-label="Filter offers" className="no-scrollbar container-site flex gap-1 overflow-x-auto py-1.5">
          {offersPage.filters.map((option) => {
            const active = option.id === filter;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={active}
                onClick={() => chooseFilter(option.id)}
                className={cn('relative inline-flex min-h-11 shrink-0 items-center px-4 text-sm font-medium transition-colors', active ? 'text-berry' : 'text-ink hover:text-berry')}
              >
                {option.label}
                <span
                  aria-hidden
                  className={cn(
                    'absolute inset-x-3 bottom-1 h-0.5 origin-center rounded-full bg-berry transition-transform duration-300 motion-reduce:transition-none',
                    active ? 'scale-x-100' : 'scale-x-0',
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      <section id="all-offers" aria-labelledby="deck-title" data-hide-fab className="bg-blush py-10 lg:py-16">
        <div className="container-site">
          <h2 id="deck-title" className="sr-only">
            {offersPage.deckTitle}
          </h2>
          <OfferDeck offers={shown} all={filter === 'all-offers'} highlight={highlight} />
          <p className="mt-6 text-center text-xs text-muted">{offersPage.smallPrint}</p>

          {/* Pick for me */}
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <p className="flex items-center gap-2 font-display text-2xl font-medium text-ink">
              <Sparkles aria-hidden className="size-5 text-gold" />
              {offersPage.pick.title}
            </p>
            <ul className="flex flex-wrap justify-center gap-2">
              {offersPage.pick.items.map((item) => (
                <li key={item.label}>
                  <button type="button" onClick={() => pick(item.offer)} className={cn(PILL, 'gap-2 border-berry/30 bg-white text-ink hover:border-berry hover:text-berry')}>
                    {item.label}
                    <ArrowRight aria-hidden className="size-4 text-berry" />
                    <span className="text-muted">{salonOfferById(item.offer)!.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Proof />

      <Section tone="tint">
        <SectionHeader eyebrow={offersPage.steps.eyebrow} title={offersPage.steps.title} />
        <ProcessStepper steps={offersPage.steps.items} />
      </Section>

      <ClaimAtSalon />

      <Section tone="tint" id="faq">
        <FAQAccordion title={offersPage.faqTitle} items={offersPage.faqs} askHref={generalClaimHref(salon)} allLink />
      </Section>

      <CTABand title={offersPage.cta.title} whatsappHref={generalClaimHref(salon)} book={{ label: offersPage.hero.book, onClick: () => booking.open('', salon?.name ?? '') }} />

      <MobileStickyBar
        whatsappHref={generalClaimHref(salon)}
        phoneHref={salon?.phoneHref ?? PICK_CALL}
        directionsHref={salon?.directionsUrl ?? PICK_DIRECTIONS}
        branch={salon?.id}
      />
    </div>
  );
}

/** Heading, trust line, salon switcher and the two ways to claim. Fits one phone screen. */
function Hero() {
  const salon = useChosenSalon();
  const booking = useBooking();
  const { hero } = offersPage;
  const choose = (id?: string) => {
    if (id) setBranch(id);
    else clearBranch();
    track('branch_select', { branch: id ?? 'all', placement: 'offers' });
  };

  return (
    <section id="home" className={cn("relative overflow-hidden bg-gradient-to-br from-blush via-cream to-mint", !isCampaignOpen() && "pt-header-sm lg:pt-header")}>
      <span aria-hidden className="absolute -right-24 -top-24 size-72 rounded-full bg-berry/10 blur-2xl" />
      <div className="container-site relative pb-8 pt-6 lg:pb-14 lg:pt-12">
        <Eyebrow>{hero.eyebrow}</Eyebrow>
        <h1 className="mt-2 text-balance font-display text-hero font-medium text-ink">{hero.h1}</h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">{hero.text}</p>
        <p className="mt-3 flex flex-wrap items-center gap-x-2 text-sm font-medium text-ink">
          {hero.trust.map((item, i) => (
            <span key={item} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden className="text-muted">·</span>}
              {i === 0 ? (
                <span className="inline-flex items-center gap-1">
                  <Star aria-hidden className="size-4 fill-gold text-gold" />
                  {item.replace('★ ', '')}
                </span>
              ) : (
                item
              )}
            </span>
          ))}
        </p>

        <div role="radiogroup" aria-label="Your salon" className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {[undefined, ...locations].map((loc) => {
            const active = loc ? salon?.id === loc.id : !salon;
            return (
              <button
                key={loc?.id ?? 'all'}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => choose(loc?.id)}
                className={cn(PILL, active ? 'border-berry bg-berry text-cream' : 'border-ink/15 bg-white/80 text-ink hover:border-berry hover:text-berry')}
              >
                {loc ? loc.name : 'All salons'}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a
            href={generalClaimHref(salon)}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="hero"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-whatsapp px-6 text-sm font-semibold text-white transition hover:brightness-105 active:scale-[0.98]"
          >
            <WhatsAppIcon className="size-5" />
            {hero.claim}
          </a>
          <button
            type="button"
            onClick={() => booking.open('', salon?.name ?? '')}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-berry px-6 text-sm font-semibold text-berry transition hover:bg-berry hover:text-cream active:scale-[0.98]"
          >
            <CalendarDays aria-hidden className="size-4" />
            {hero.book}
          </button>
        </div>
      </div>
    </section>
  );
}

/**
 * Phones: a swipeable deck, one card at a time with the next peeking in, a "2 / 6" counter, dots and arrows.
 * Tablets: two columns. Desktop: a grid with the two lead offers wider.
 */
function OfferDeck({ offers, all, highlight }: { offers: SalonOffer[]; all: boolean; highlight: SalonOfferId | null }) {
  const row = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  // A new filter starts the deck from its first card.
  useEffect(() => {
    row.current?.scrollTo({ left: 0 });
    setActive(0);
  }, [offers.length, all]);

  const onScroll = (e: UIEvent<HTMLUListElement>) => {
    const el = e.currentTarget;
    const first = el.children[0] as HTMLElement | undefined;
    const second = el.children[1] as HTMLElement | undefined;
    if (!first || !second) return;
    setActive(Math.round(el.scrollLeft / (second.offsetLeft - first.offsetLeft)));
  };
  const step = (by: number) => {
    const el = row.current;
    const target = el?.children[Math.max(0, Math.min(offers.length - 1, active + by))] as HTMLElement | undefined;
    if (el && target) el.scrollTo({ left: target.offsetLeft - el.offsetLeft - 16, behavior: 'smooth' });
  };

  return (
    <div role="group" aria-roledescription="carousel" aria-label="Offers">
      <ul
        ref={row}
        onScroll={onScroll}
        className="no-scrollbar relative -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-6 lg:gap-6"
      >
        {offers.map((offer, i) => {
          const layout = span(offer, offers.length, all);
          return (
            <li key={offer.id} id={offer.id} className={cn('w-[88%] shrink-0 snap-start scroll-mt-32 md:w-auto', layout.className)}>
              <OfferCard
                offer={offer}
                placement="offers"
                heading={offersPage.headings[offer.id]}
                headingLevel="h2"
                wide={layout.wide}
                priority={i === 0}
                highlighted={highlight === offer.id}
              />
            </li>
          );
        })}
      </ul>

      {offers.length > 1 && (
        <div className="mt-4 flex items-center justify-between gap-3 md:hidden">
          <button type="button" aria-label="Previous offer" onClick={() => step(-1)} disabled={active === 0} className="grid size-11 place-items-center rounded-full border border-berry/30 text-berry disabled:opacity-30">
            <ChevronLeft aria-hidden className="size-5" />
          </button>
          <div className="flex flex-col items-center gap-2">
            <p aria-live="polite" className="text-sm font-medium tabular-nums text-ink">
              {active + 1} / {offers.length}
            </p>
            <div aria-hidden className="flex gap-1.5">
              {offers.map((offer, i) => (
                <span key={offer.id} className={cn('h-2 rounded-full bg-berry transition-all duration-300 motion-reduce:transition-none', i === active ? 'w-6' : 'w-2 opacity-30')} />
              ))}
            </div>
          </div>
          <button type="button" aria-label="Next offer" onClick={() => step(1)} disabled={active === offers.length - 1} className="grid size-11 place-items-center rounded-full border border-berry/30 text-berry disabled:opacity-30">
            <ChevronRight aria-hidden className="size-5" />
          </button>
        </div>
      )}
    </div>
  );
}

/** Before & after for the offered services, then three client reviews. */
function Proof() {
  const { proof } = offersPage;
  const pairs = proof.pairs.flatMap((item) => {
    const pair = beforeAfter.pairs.find((entry) => entry.caption === item.caption);
    return pair ? [{ pair, offer: salonOfferById(item.offer)! }] : [];
  });

  return (
    <Section tone="white">
      <SectionHeader eyebrow={proof.eyebrow} title={proof.title} text={proof.text} />
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pairs.map(({ pair, offer }) => (
          <li key={pair.caption}>
            <Suspense fallback={<div className="aspect-[3/4] w-full rounded-card bg-blush" />}>
              <BeforeAfter pair={pair} sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" />
            </Suspense>
            <p className="mt-2 text-center text-xs font-medium text-berry">Claimed with: {offer.title} ({offer.badge})</p>
          </li>
        ))}
      </ul>

      <ul className="mt-12 grid gap-4 md:grid-cols-3">
        {proof.reviews.map((review) => (
          <li key={review.name}>
            <Reveal className="svc-card flex h-full flex-col p-5">
              <span role="img" aria-label="5 out of 5 stars" className="flex gap-0.5 text-gold">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} aria-hidden className="size-4 fill-current" />
                ))}
              </span>
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink">“{review.quote}”</blockquote>
              <p className="mt-4 text-sm font-semibold text-ink">
                {review.name} <span className="font-normal text-muted">· {proof.source}</span>
              </p>
            </Reveal>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-center text-sm text-muted">
        {proof.rating} ·{' '}
        <a href={GOOGLE_REVIEWS} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-medium text-berry underline underline-offset-4">
          {proof.readAll}
        </a>
      </p>
    </Section>
  );
}

/** The three salons, each with its status, its own WhatsApp, phone and map, and a link to its page. */
function ClaimAtSalon() {
  const ICON = 'grid size-11 place-items-center rounded-full border border-berry/25 text-berry transition-colors hover:bg-berry hover:text-cream';
  return (
    <Section tone="white" id="salons">
      <SectionHeader eyebrow={offersPage.salons.eyebrow} title={offersPage.salons.title} />
      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {locations.map((loc) => (
          <li key={loc.id} data-branch={loc.id} data-cta="claim_at_salon" className="svc-card flex flex-col gap-3 p-5">
            <div>
              <h3 className="font-display text-xl font-medium text-ink">Xing {loc.name}</h3>
              <p className="text-sm text-muted">{loc.area}</p>
            </div>
            <StatusChip salon={loc} className="self-start" />
            <div className="mt-1 flex items-center gap-3">
              <a href={generalClaimHref(loc)} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp Xing ${loc.name}`} className={ICON}>
                <WhatsAppIcon className="size-5" />
              </a>
              <a href={loc.phoneHref} aria-label={`Call Xing ${loc.name}`} className={ICON}>
                <Phone aria-hidden className="size-5" />
              </a>
              <a href={loc.directionsUrl} target="_blank" rel="noopener noreferrer" aria-label={`Directions to Xing ${loc.name}`} className={ICON}>
                <Navigation aria-hidden className="size-5" />
              </a>
              <a href={loc.path} className="ml-auto inline-flex min-h-11 items-center gap-1 text-sm font-medium text-berry underline-offset-4 hover:underline">
                Salon page
                <ArrowRight aria-hidden className="size-4" />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
