import { useState } from 'react';
import { BadgePercent, CalendarDays, Check, ChevronRight, CreditCard, Phone, ShieldCheck, Sparkles, Star, Users } from 'lucide-react';
import { posts } from 'virtual:blog-index';
import { BeforeAfter } from '../components/BeforeAfter';
import { ReelRow } from '../components/Reels';
import { SalonNap } from '../components/SalonNap';
import { BlogCard } from '../components/blog/BlogCard';
import { FAQAccordion } from '../components/service/FAQAccordion';
import { Section, SectionHeader } from '../components/service/SectionHeader';
import { Button } from '../components/ui/Button';
import { WhatsAppIcon } from '../components/ui/Decor';
import { Modal } from '../components/ui/Modal';
import { Picture } from '../components/ui/Primitives';
import { useBooking } from '../context/booking';
import { locations, ratingHeadline, salonById } from '../data/branches';
import { reviews } from '../data/content';
import { beforeAfter, reelsFor } from '../data/media';
import { catalogOffer, linePrice, offerCategoryPages, offersIn, pageFrom, saveText, validityText, type CatalogOffer, type OfferCategoryPage as Page } from '../data/offerCatalog';
import { formatPrice, offers, STREAK_CHOICES } from '../data/offers';
import { CTA } from '../data/style';
import { setBranch, useBranch } from '../lib/branch';
import { cn } from '../lib/cn';
import { whatsappLink } from '../lib/whatsapp';

/** The services whose clips, before/afters and guides belong on each page. */
const SERVICES: Record<Page['id'], string[]> = {
  'hair-colour': ['global-hair-color', 'highlights', 'balayage', 'fashion-color'],
  'hair-treatment': ['keratin-treatment', 'nanoplastia', 'hair-smoothening', 'womens-haircut-styling'],
  'skin-care': ['hydra-facial', 'facial-cleanup', 'body-polish', 'hair-spa'],
};

const TRUST = [
  { Icon: Users, label: 'Free consultation' },
  { Icon: ShieldCheck, label: 'Price fixed before we start' },
  { Icon: Sparkles, label: 'Premium products' },
  { Icon: CreditCard, label: 'Pay at the salon' },
];

/** The chosen salon (chips at the top), or none: the WhatsApp and Call buttons then ask which salon. */
function useSalon() {
  const id = useBranch();
  return id ? salonById(id) : undefined;
}

/** "Hi Xing! I’d like to claim the Hydra Facial offer (₹3,499) at Xing HSR Layout." */
function claimHref(offer: CatalogOffer, salonId?: string) {
  const salon = salonId ? salonById(salonId) : undefined;
  const text = `Hi Xing! I’d like to claim the ${offer.title} offer (${linePrice(offer.lines[0])}) at Xing ${salon ? salon.name : '___ (location)'}.`;
  return whatsappLink(text, salon?.whatsappHref);
}

function Price({ offer, large = false }: { offer: CatalogOffer; large?: boolean }) {
  const line = offer.lines[0];
  const save = saveText(line);
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
      {line.was && <s className="text-base tabular-nums text-muted">{formatPrice(line.was)}</s>}
      <span className={cn('font-display font-medium tabular-nums text-berry', large ? 'text-4xl' : 'text-3xl')}>
        {line.from && <span className="mr-1 text-lg">from</span>}
        {formatPrice(line.now)}
      </span>
      {line.unit && <span className="text-sm text-ink">{line.unit}</span>}
      {save && <span className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-success">{save}</span>}
    </div>
  );
}

function SalonChips() {
  const chosen = useBranch();
  const chip = (active: boolean) => cn('inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm font-medium', active ? 'border-berry bg-berry text-cream' : 'border-ink/15 bg-white text-ink');
  return (
    <div role="group" aria-label="Choose your salon" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
      <button type="button" aria-pressed={!chosen} onClick={() => setBranch('')} className={chip(!chosen)}>
        All salons
      </button>
      {locations.map((salon) => (
        <button key={salon.id} type="button" aria-pressed={chosen === salon.id} onClick={() => setBranch(salon.id)} className={chip(chosen === salon.id)}>
          {salon.name}
        </button>
      ))}
    </div>
  );
}

/** The highlights card's calculator: 6, 8 or 10 streaks. */
function Streaks({ offer }: { offer: CatalogOffer }) {
  const [count, setCount] = useState(8);
  return (
    <div className="mt-3 rounded-2xl bg-blush p-3">
      <p className="text-sm text-ink">How many streaks?</p>
      <div className="mt-2 flex gap-2">
        {STREAK_CHOICES.map((n) => (
          <button key={n} type="button" aria-pressed={count === n} onClick={() => setCount(n)} className={cn('min-h-11 flex-1 rounded-full border text-sm font-medium', count === n ? 'border-berry bg-berry text-cream' : 'border-ink/15 bg-white text-ink')}>
            {n}
          </button>
        ))}
      </div>
      <p aria-live="polite" className="mt-2 text-sm font-semibold text-berry">
        {count} streaks: {formatPrice(count * offer.lines[0].now)}
      </p>
    </div>
  );
}

function OfferCard({ offer, onDetails }: { offer: CatalogOffer; onDetails: () => void }) {
  const salon = useSalon();
  return (
    <article id={offer.id} className="svc-card scroll-mt-32 overflow-hidden" data-offer-card>
      <Picture image={offer.image} sizes="(min-width: 768px) 45vw, 100vw" className="aspect-[4/5] w-full object-cover sm:aspect-[4/3]" />
      <div className="p-5">
        <h3 className="font-display text-2xl font-medium text-ink">{offer.title}</h3>
        <p className="mt-1 text-sm text-muted">{offer.hook}</p>
        <div className="mt-3">
          <Price offer={offer} />
        </div>
        <ul className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-ink">
          {offer.benefits.map((benefit) => (
            <li key={benefit} className="flex flex-col items-center gap-1">
              <Check aria-hidden className="size-4 text-berry" />
              {benefit}
            </li>
          ))}
        </ul>
        {offer.includes && (
          <ol className="mt-4 flex flex-wrap gap-2 text-xs">
            {offer.includes.map((step, i) => (
              <li key={step} className="rounded-full bg-blush px-3 py-1 font-medium text-berrydark">
                {i + 1}. {step}
              </li>
            ))}
          </ol>
        )}
        {offer.streaks && <Streaks offer={offer} />}
        <p className="mt-4 flex items-center gap-2 text-xs text-muted">
          <CalendarDays aria-hidden className="size-4 text-berry" />
          {validityText(offer)}
        </p>
        <div className="mt-4 flex gap-3">
          <Button href={claimHref(offer, salon?.id)} external arrow={false} className="flex-1" data-cta="card-claim">
            <WhatsAppIcon className="size-4" />
            {CTA.claim}
          </Button>
          <Button variant="outline" arrow={false} onClick={onDetails}>
            {CTA.details}
          </Button>
        </div>
      </div>
    </article>
  );
}

function Details({ offer, onClose }: { offer: CatalogOffer | null; onClose: () => void }) {
  const booking = useBooking();
  return (
    <Modal open={!!offer} onClose={onClose} labelledBy="offer-details-title" layout="sheet">
      {offer && (
        <div className="p-5 sm:p-6">
          <h2 id="offer-details-title" className="font-display text-2xl font-medium text-ink">
            {offer.title}
          </h2>
          <div className="mt-2">
            <Price offer={offer} />
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-semibold text-ink">What’s included</dt>
              <dd className="text-muted">{(offer.includes ?? offer.benefits).join(' · ')}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Best for</dt>
              <dd className="text-muted">{offer.bestFor}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Validity</dt>
              <dd className="text-muted">{validityText(offer)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Terms</dt>
              <dd className="text-muted">{offer.terms}</dd>
            </div>
          </dl>
          <div className="mt-5 flex flex-col gap-3">
            <Button arrow={false} onClick={() => (onClose(), booking.open(offer.bookingService))}>
              {CTA.book}
            </Button>
            <Button variant="outline" href={offer.serviceLink}>
              About this service
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

/** One offer page: /offers/hair-colour, /offers/hair-treatment or /offers/skin-care. */
export default function OfferCategoryPage({ page }: { page: Page }) {
  const booking = useBooking();
  const salon = useSalon();
  const [details, setDetails] = useState<CatalogOffer | null>(null);
  const items = offersIn(page.id);
  const lead = catalogOffer(page.heroOfferId);
  const services = SERVICES[page.id];
  const pair = beforeAfter.pairs.find((entry) => services.includes(entry.service));
  const clips = services.flatMap((service) => reelsFor(service)).slice(0, 6);
  // Client results from the salon chairs (scripts/offer-images.mjs), for the hair pages.
  const results = page.id === 'skin-care' ? [] : Array.from({ length: 12 }, (_, i) => ({
    src: `/images/results/${page.id}-${i + 1}.webp`,
    avifSrcSet: `/images/results/${page.id}-${i + 1}.avif 600w`,
    width: 600,
    height: 750,
    alt: `${page.short} result ${i + 1} at Xing Premium Unisex Salon, Bangalore`,
  }));
  const guides = posts.filter((post) => post.relatedServices.some((service: string) => services.includes(service))).slice(0, 3);
  const others = offerCategoryPages.filter((other) => other.id !== page.id);
  const call = salon?.phoneHref ?? '#call-a-salon';

  return (
    <>
      <section className="bg-blush pb-8 pt-header-sm lg:pt-header">
        <div className="container-site pt-3 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:pt-10">
          <div>
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
                <li>
                  <a href="/" className="inline-flex min-h-11 items-center hover:text-berry">
                    Home
                  </a>
                </li>
                <ChevronRight aria-hidden className="size-3" />
                <li>
                  <a href="/offers" className="inline-flex min-h-11 items-center hover:text-berry">
                    Offers
                  </a>
                </li>
                <ChevronRight aria-hidden className="size-3" />
                <li aria-current="page" className="text-ink">
                  {page.seo.crumb}
                </li>
              </ol>
            </nav>
            <h1 className="mt-1 text-balance font-display text-hero font-medium text-ink">{page.h1}</h1>
            <div className="mt-3 flex items-center gap-4">
              <Picture image={lead.image} eager priority sizes="96px" className="aspect-[4/5] w-20 shrink-0 rounded-2xl object-cover shadow-soft lg:hidden" />
              <div>
                <p className="text-sm font-semibold text-ink">{lead.title}</p>
                <Price offer={lead} large />
                <p className="mt-1 text-xs text-muted">{validityText(lead)}</p>
              </div>
            </div>
            <div className="mt-4">
              <SalonChips />
            </div>
            <div className="mt-4 flex gap-3">
              <Button href={claimHref(lead, salon?.id)} external arrow={false} className="flex-1" data-cta="hero-claim">
                <WhatsAppIcon className="size-4" />
                {CTA.claimWhatsapp}
              </Button>
              <Button variant="outline" arrow={false} className="flex-1" onClick={() => booking.open(lead.bookingService, salon?.name)}>
                {CTA.book}
              </Button>
            </div>
          </div>
          <Picture image={lead.image} eager sizes="50vw" className="hidden aspect-[4/5] w-full max-w-md justify-self-end rounded-card object-cover shadow-lift lg:block" />
        </div>
      </section>

      {/* This page's offers, and the other two pages: sideways, never wrapping. */}
      <nav aria-label="Offers on this page" className="under-header sticky z-20 border-b border-ink/10 bg-cream/95 backdrop-blur-md">
        <div className="container-site no-scrollbar flex gap-2 overflow-x-auto py-2">
          {items.map((offer) => (
            <a key={offer.id} href={`#${offer.id}`} className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-ink/15 bg-white px-4 text-sm font-medium text-ink">
              {offer.title.replace('Schwarzkopf Professional ', '')}
            </a>
          ))}
        </div>
      </nav>
      <nav aria-label="Offer pages" className="container-site mt-4">
        <div className="grid grid-cols-3 gap-1 rounded-full bg-white p-1 text-center text-sm">
          {offerCategoryPages.map((other) => (
            <a key={other.id} href={other.path} aria-current={other.id === page.id ? 'page' : undefined} className={cn('flex min-h-11 items-center justify-center whitespace-nowrap rounded-full px-1 font-medium', other.id === page.id ? 'bg-berry text-cream' : 'text-ink')}>
              {other.short}
            </a>
          ))}
        </div>
      </nav>

      <Section tone="white" id="offers">
        <SectionHeader eyebrow="Offers" title={`${items.length} offers, all 3 salons`} />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {items.map((offer) => (
            <OfferCard key={offer.id} offer={offer} onDetails={() => setDetails(offer)} />
          ))}
        </div>
      </Section>

      <Section tone="tint">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[20rem] border-collapse text-left text-sm">
            <caption className="mb-3 text-left font-display text-2xl font-medium text-ink">Every price</caption>
            <thead>
              <tr className="border-b-2 border-berry/30">
                <th scope="col" className="py-2 pr-3">Offer</th>
                <th scope="col" className="py-2 pr-3">Was</th>
                <th scope="col" className="py-2">Now</th>
              </tr>
            </thead>
            <tbody>
              {items.map((offer) => (
                <tr key={offer.id} className="border-b border-ink/10">
                  <th scope="row" className="py-2 pr-3 font-medium text-ink">{offer.title}</th>
                  <td className="py-2 pr-3 text-muted">{offer.lines[0].was ? formatPrice(offer.lines[0].was) : '–'}</td>
                  <td className="py-2 font-semibold text-berry">{linePrice(offer.lines[0])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {(pair || clips.length > 0) && (
        <Section tone="white" gallery>
          <SectionHeader eyebrow="Results" title="Real client results" />
          <div className="mt-8 space-y-8">
            {pair && (
              <div className="max-w-sm">
                <BeforeAfter pair={pair} />
              </div>
            )}
            {results.length > 0 && (
              <ul data-swipe aria-label="Client results" className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
                {results.map((image) => (
                  <li key={image.src} className="w-[60%] max-w-[16rem] shrink-0 snap-start">
                    <Picture image={image} sizes="16rem" className="aspect-[4/5] w-full rounded-card object-cover" />
                  </li>
                ))}
              </ul>
            )}
            {clips.length > 0 && <ReelRow items={clips} />}
          </div>
        </Section>
      )}

      <Section tone="tint">
        <SectionHeader eyebrow="Why Xing" title="How the offers work" />
        <ul className="mt-6 grid grid-cols-2 gap-3">
          {TRUST.map(({ Icon, label }) => (
            <li key={label} className="svc-card flex items-center gap-3 p-4 text-sm font-medium text-ink">
              <Icon aria-hidden className="size-5 shrink-0 text-berry" />
              {label}
            </li>
          ))}
        </ul>
        <details className="group mt-4">
          <summary className="inline-flex min-h-11 cursor-pointer list-none items-center text-sm font-medium text-berry [&::-webkit-details-marker]:hidden">Why these offers are genuine</summary>
          <p className="mt-2 max-w-prose text-sm text-muted">The prices here are the salon’s own offer prices. We confirm your price at the consultation, before we start, and you pay at the salon. Nothing is charged online.</p>
        </details>
      </Section>

      <Section tone="white">
        <SectionHeader eyebrow="Reviews" title="What clients say" text={ratingHeadline} />
        <ul data-swipe className="no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:px-0">
          {reviews.items.slice(0, 3).map((review) => (
            <li key={review.name} className="svc-card w-[82%] shrink-0 snap-start p-5 md:w-auto">
              <span aria-hidden className="flex gap-0.5 text-gold">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </span>
              <blockquote className="mt-2 text-sm text-ink">“{review.quote}”</blockquote>
              <p className="mt-2 text-xs text-muted">{review.name} · Google review</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="tint" id="salons">
        <SectionHeader eyebrow="Salons" title="Claim at your salon" />
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {locations.map((loc) => (
            <li key={loc.id} className="svc-card p-5">
              <SalonNap salon={loc} />
              <div className="mt-4 flex flex-wrap gap-2">
                <Button href={loc.phoneHref} variant="outline" arrow={false} className="flex-1">
                  <Phone aria-hidden className="size-4" />
                  {CTA.call}
                </Button>
                <Button href={claimHref(lead, loc.id)} external arrow={false} className="flex-1">
                  <WhatsAppIcon className="size-4" />
                  WhatsApp
                </Button>
                <Button href={loc.directionsUrl} external variant="outline" arrow={false} className="w-full">
                  {CTA.directions}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="white" id="faq">
        <FAQAccordion title="Offer questions" items={page.faq} askHref={whatsappLink(`Hi Xing! I have a question about the ${page.name}: `)} />
      </Section>

      {guides.length > 0 && (
        <Section tone="tint">
          <SectionHeader eyebrow="Guides" title="Read before you visit" />
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {guides.map((post) => (
              <li key={post.slug}>
                <BlogCard post={post} compact />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section tone="white">
        <SectionHeader eyebrow="More" title="More offers" />
        <ul className="mt-6 grid gap-3 md:grid-cols-3">
          {others.map((other) => (
            <li key={other.id}>
              <a href={other.path} className="svc-card svc-card-hover flex min-h-11 flex-col p-5">
                <span className="font-display text-xl font-medium text-ink">{other.name}</span>
                <span className="mt-1 text-sm font-semibold text-berry">{pageFrom(other.id)}</span>
              </a>
            </li>
          ))}
          <li>
            <a href="/offers#tuesday" className="svc-card svc-card-hover flex min-h-11 flex-col p-5">
              <span className="font-display text-xl font-medium text-ink">{offers.tuesday.title}</span>
              <span className="mt-1 flex items-center gap-1 text-sm font-semibold text-berry">
                <BadgePercent aria-hidden className="size-4" />
                {offers.tuesday.deal}
              </span>
            </a>
          </li>
        </ul>
      </Section>

      {/* Phones: one line, at 320px too. */}
      <div className="safe-bottom fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-ink/10 bg-cream px-3 py-2 md:hidden" data-cta="sticky-claim">
        <a href={claimHref(lead, salon?.id)} target="_blank" rel="noopener noreferrer" className="flex min-h-12 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-whatsapp px-3 text-sm font-semibold text-white">
          <WhatsAppIcon className="size-4" />
          Claim · {pageFrom(page.id).replace(' per streak', '')}
        </a>
        <a href={call} className="flex min-h-12 items-center justify-center rounded-full border border-berry px-4 text-sm font-semibold text-berry">
          {CTA.call}
        </a>
      </div>

      <Details offer={details} onClose={() => setDetails(null)} />
    </>
  );
}
