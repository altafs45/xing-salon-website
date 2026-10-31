import { lazy, Suspense, useEffect, useLayoutEffect, useState } from 'react';
import { novemberPosts } from 'virtual:blog-picks';
import { ArrowRight, BadgeCheck, CalendarCheck, Lock, MessageCircle, Navigation, Phone, ShieldCheck, Sparkles, Star, Wallet, type LucideIcon } from 'lucide-react';
import { BlogCard } from '../components/blog/BlogCard';
import { StatusChip } from '../components/branch/StatusChip';
import { ReelCard } from '../components/Reels';
import { NovemberCard, PosterZoom, useExpiredSchema } from '../components/offers/NovemberBits';
import { NovemberHero } from '../components/offers/NovemberHero';
import { SalonNap } from '../components/SalonNap';
import { FAQAccordion } from '../components/service/FAQAccordion';
import { Section } from '../components/service/SectionHeader';
import { Accordion } from '../components/ui/Accordion';
import { ArrowLink } from '../components/ui/Button';
import { Picture } from '../components/ui/Primitives';
import { WhatsAppIcon } from '../components/ui/WhatsAppIcon';
import { useBooking } from '../context/booking';
import { locations } from '../data/branches';
import { beforeAfter, reels } from '../data/media';
import { novemberOffersPage as copy, pageClaimMessage } from '../data/novemberOffersPage';
import {
  campaignCta,
  campaignLines,
  campaignPill,
  campaignState,
  formatPrice,
  lineSaving,
  menuPricesImage,
  novemberCampaign,
  offersPath,
  savingPercent,
  sheetOfferById,
  streakRange,
  type CampaignOffer,
  type CampaignOfferId,
} from '../data/offers';
import { useHasShell } from '../hooks/useHasShell';
import { track } from '../lib/analytics';
import { cn } from '../lib/cn';
import { claimText, useChosenSalon } from '../lib/offers';
import { PICK_CALL, whatsappLink } from '../lib/whatsapp';

// The before/after slider loads once its section is reached.
const BeforeAfter = lazy(() => import('../components/BeforeAfter').then((module) => ({ default: module.BeforeAfter })));

const HIGHLIGHT_MS = 2500;
const GOOGLE_REVIEWS = 'https://www.google.com/maps/search/?api=1&query=Xing+Premium+Unisex+Salon+Bangalore';
const SWIPE = 'no-scrollbar -mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 md:mx-0 md:px-0';
const TRUST_ICONS: Record<string, LucideIcon> = { chat: MessageCircle, shield: ShieldCheck, lock: Lock, wallet: Wallet };
const STEP_ICONS = [MessageCircle, BadgeCheck, CalendarCheck];

/** The hero, unless the build already wrote it into the page (see NovemberHero). */
function HeroSlot() {
  return useHasShell() ? null : <NovemberHero />;
}

/** /offers/november after the end date: the address keeps its search ranking and points onward. */
function Ended() {
  const { ended } = copy;
  return (
    <section id="top" className="bg-gradient-to-br from-blush via-cream to-mint pb-14 pt-header-sm lg:pb-24 lg:pt-header">
      <div className="container-site pt-8 lg:pt-14">
        <h1 className="text-balance font-display text-hero font-medium text-ink">{ended.title}</h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">{ended.text}</p>
        <a href={offersPath} className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-berry px-6 text-sm font-semibold text-cream hover:bg-berrydark">
          {ended.offersLabel}
          <ArrowRight aria-hidden className="size-4" />
        </a>
        <ul className="mt-6 flex flex-wrap gap-2">
          {ended.links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="inline-flex min-h-11 items-center rounded-full border border-berry/30 bg-white/80 px-4 text-sm font-medium text-ink hover:border-berry hover:text-berry">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** A review, cut short with the rest behind "…more". The full text stays in the HTML. */
function ReviewCard({ quote, name }: { quote: string; name: string }) {
  const words = quote.split(/\s+/);
  const long = words.length > copy.reviews.limit;
  return (
    <figure className="flex h-full flex-col rounded-3xl border border-berry/10 bg-white p-4 shadow-soft">
      <span role="img" aria-label="5 out of 5 stars" className="flex gap-0.5 text-gold">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} aria-hidden className="size-4 fill-current" />
        ))}
      </span>
      {long ? (
        <details className="mt-2 flex-1 text-sm leading-relaxed text-ink">
          <summary className="min-h-11 cursor-pointer list-none">
            “{words.slice(0, copy.reviews.limit).join(' ')} <span className="font-medium text-berry">{copy.reviews.moreLabel}</span>
          </summary>
          {words.slice(copy.reviews.limit).join(' ')}”
        </details>
      ) : (
        <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-ink">“{quote}”</blockquote>
      )}
      <figcaption className="mt-2 text-sm font-semibold text-ink">
        {name} <span className="font-normal text-muted">· {copy.reviews.source}</span>
      </figcaption>
    </figure>
  );
}

/** The phone's claim bar: appears once the hero's button has scrolled away, and steps aside at the page's end. */
function ClaimBar({ href, phoneHref }: { href: string; phoneHref: string }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const hero = document.querySelector('[data-hero-cta]');
    const footer = document.querySelector('footer');
    if (!hero) return;
    let past = false;
    let atEnd = false;
    const update = () => setShown(past && !atEnd);
    const heroWatch = new IntersectionObserver(([entry]) => {
      past = !entry.isIntersecting;
      update();
    });
    const endWatch = new IntersectionObserver(([entry]) => {
      atEnd = entry.isIntersecting;
      update();
    });
    heroWatch.observe(hero);
    if (footer) endWatch.observe(footer);
    return () => {
      heroWatch.disconnect();
      endWatch.disconnect();
    };
  }, []);

  return (
    <nav
      aria-label="Quick actions"
      data-cta="sticky_bar"
      className={cn(
        'safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-cream/95 p-2 backdrop-blur-md transition duration-200 motion-reduce:transition-none md:hidden',
        '[[data-sheet-open]_&]:hidden',
        shown ? 'translate-y-0' : 'pointer-events-none translate-y-full opacity-0',
      )}
    >
      <div className="flex items-center gap-2">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('sticky_cta_click', { placement: 'november', page: location.pathname })}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-whatsapp px-3 text-sm font-semibold text-white active:scale-[0.98]"
        >
          <WhatsAppIcon className="size-5" />
          <span>
            Claim · {copy.fromLabel} · {campaignPill()}
          </span>
        </a>
        <a href={phoneHref} aria-label="Call a salon" className="grid size-12 shrink-0 place-items-center rounded-full border border-berry text-berry">
          <Phone aria-hidden className="size-5" />
        </a>
      </div>
    </nav>
  );
}

/** /offers/november: the three offers, short enough to read on a phone. Longer answers sit in closed panels. */
export default function NovemberOffersPage() {
  const state = campaignState();
  const salon = useChosenSalon();
  const booking = useBooking();
  const [highlight, setHighlight] = useState<CampaignOfferId | null>(null);
  const [active, setActive] = useState<CampaignOfferId>(copy.switcher[0].id);
  const [zoom, setZoom] = useState<CampaignOffer | null>(null);
  const ended = state === 'ended';
  const cta = campaignCta();
  const message = pageClaimMessage(cta.text);
  const generalHref = salon ? whatsappLink(message.replace('___ (location)', salon.name), salon.whatsappHref) : whatsappLink(message);
  const openBooking = () => booking.open('Hair Color', salon?.name ?? '');

  useExpiredSchema();
  // A page built before the end date still carries the live hero.
  useLayoutEffect(() => {
    if (ended) document.getElementById('first-paint')?.remove();
  }, [ended]);

  // The hero may be plain build-time HTML, so its live parts are added here.
  useEffect(() => {
    document.querySelectorAll('[data-nov-pill]').forEach((el) => (el.textContent = campaignPill()));
    document.querySelectorAll('[data-nov-claim-label]').forEach((el) => (el.textContent = cta.label));
    document.querySelectorAll<HTMLAnchorElement>('[data-nov-claim]').forEach((el) => (el.href = generalHref));
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest('[data-nov-book]')) openBooking();
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salon?.id]);

  // The switcher follows the card in view.
  useEffect(() => {
    if (ended) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id as CampaignOfferId);
      },
      { rootMargin: '-40% 0px -50% 0px' },
    );
    copy.switcher.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ended]);

  if (ended) return <Ended />;

  const pick = (id: CampaignOfferId) => {
    setHighlight(id);
    window.setTimeout(() => setHighlight(null), HIGHLIGHT_MS);
    track('nov_picker_result', { offer_id: id, placement: 'november', branch: salon?.id ?? 'none', page: location.pathname });
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const pair = beforeAfter.pairs.find((item) => item.caption === copy.results.pair);
  const results = reels.items.filter((reel) => copy.results.reels.includes(reel.caption));

  return (
    <div data-cta="november_page">
      <HeroSlot />

      {/* The switcher stays under the header while the offers scroll past. */}
      <div className="under-header sticky z-20 border-b border-ink/10 bg-cream/95 backdrop-blur-md">
        <div role="toolbar" aria-label="Jump to an offer" className="container-site flex gap-1 py-1.5">
          {copy.switcher.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active === item.id ? 'true' : undefined}
              className={cn('inline-flex min-h-11 flex-1 items-center justify-center rounded-full px-2 text-center text-sm font-medium leading-tight transition-colors', active === item.id ? 'bg-berry text-cream' : 'text-ink')}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <Section tone="white" id="offers" className="!py-6 lg:!py-12">
        <h2 className="heading text-balance text-ink">{copy.offersTitle}</h2>
        <ul className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {novemberCampaign.offers.map((offer, i) => (
            <li key={offer.id} id={offer.id} className="scroll-mt-32">
              <NovemberCard offer={offer} placement="november" priority={i === 0} highlighted={highlight === offer.id} onZoom={setZoom} />
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="tint" id="trust" className="!py-8 lg:!py-12">
        <h2 className="heading text-balance text-ink">{copy.trust.title}</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {copy.trust.items.map((item) => {
            const Icon = TRUST_ICONS[item.icon];
            return (
              <li key={item.label} className="flex items-center gap-2 rounded-2xl bg-white p-3 text-sm font-medium text-ink">
                <Icon aria-hidden className="size-5 shrink-0 text-berry" />
                {item.label}
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-sm font-medium text-ink">{copy.trust.rating}</p>
        <ol className="mt-3 flex items-center justify-between gap-2 text-sm font-medium text-ink">
          {copy.trust.steps.map((step, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <li key={step} className="flex items-center gap-1.5">
                <Icon aria-hidden className="size-5 text-berry" />
                {step}
                {i < copy.trust.steps.length - 1 && <ArrowRight aria-hidden className="ml-1 size-4 text-muted" />}
              </li>
            );
          })}
        </ol>
        <details className="group mt-3 rounded-2xl bg-white px-4">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
            {copy.trust.genuineTitle}
            <ArrowRight aria-hidden className="size-4 text-berry transition-transform group-open:rotate-90" />
          </summary>
          <ul className="space-y-1.5 pb-4 text-sm text-muted">
            {copy.trust.genuine.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </details>
      </Section>

      <Section tone="white" id="choose" className="!py-8 lg:!py-12">
        <h2 className="heading text-balance text-ink">{copy.choose.title}</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-3">
          {copy.choose.options.map((option) => (
            <li key={option.label}>
              <button type="button" onClick={() => pick(option.offer)} className="flex min-h-16 w-full items-center justify-between gap-3 rounded-3xl border border-berry/10 bg-white p-4 text-left shadow-soft active:scale-[0.98]">
                <span>
                  <span className="block text-sm font-semibold text-ink">{option.label}</span>
                  <span className="block text-sm text-berry">{option.result}</span>
                </span>
                <Sparkles aria-hidden className="size-5 shrink-0 text-gold" />
              </button>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="tint" id="results" className="!py-8 lg:!py-12">
        <h2 className="heading text-balance text-ink">{copy.results.title}</h2>
        <p className="mt-1 text-sm text-muted">{copy.results.text}</p>
        <ul data-swipe className={SWIPE}>
          {pair && (
            <li className="w-[72%] shrink-0 snap-start sm:w-64">
              <Suspense fallback={<div className="aspect-[3/4] w-full rounded-3xl bg-blush" />}>
                <BeforeAfter pair={pair} sizes="(min-width: 640px) 256px, 72vw" />
              </Suspense>
            </li>
          )}
          {results.map((reel) => (
            <li key={reel.caption} className="w-[58%] shrink-0 snap-start sm:w-52">
              <ReelCard reel={reel} />
            </li>
          ))}
          {copy.results.photos.map((photo) => (
            <li key={photo} className="w-[58%] shrink-0 snap-start sm:w-52">
              <Picture
                image={{ src: `/images/work-${photo}.webp`, alt: `${photo.startsWith('balayage') ? 'Balayage' : 'Highlights'} on a client at Xing Salon Bangalore`, width: 600, height: 800 }}
                sizes="(min-width: 640px) 208px, 58vw"
                className="aspect-[3/4] w-full rounded-3xl object-cover"
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="white" id="prices" className="!py-8 lg:!py-12">
        <h2 className="heading text-balance text-ink">{copy.prices.title}</h2>
        <figure className="mt-4 max-w-[26.25rem]">
          <figcaption className="mb-1 text-xs text-muted">{copy.prices.posterLabel}</figcaption>
          <Picture image={menuPricesImage} sizes="(min-width: 480px) 420px, 92vw" className="w-full rounded-3xl" />
        </figure>
        <table className="mt-4 w-full text-left text-sm">
          <thead className="border-b border-ink/10 text-xs uppercase tracking-wide text-muted">
            <tr>
              <th scope="col" className="py-2 pr-2 font-semibold">Service</th>
              <th scope="col" className="py-2 pr-2 font-semibold">Was</th>
              <th scope="col" className="py-2 pr-2 font-semibold">Now</th>
              <th scope="col" className="py-2 font-semibold">Save</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {campaignLines().map((line) => (
              <tr key={line.label}>
                <th scope="row" className="py-2 pr-2 font-medium text-ink">
                  {line.label}
                  {(line.note || line.unit) && (
                    <span className="block text-xs font-normal text-muted">
                      {line.label === 'Hair Highlights' ? `${formatPrice(line.now)}/streak · 8–10 ≈ ${streakRange()}` : line.note ?? line.unit}
                    </span>
                  )}
                </th>
                <td className="py-2 pr-2 tabular-nums text-muted">
                  <s>{formatPrice(line.was)}</s>
                </td>
                <td className="py-2 pr-2 font-semibold tabular-nums text-berry">
                  {line.from && 'from '}
                  {formatPrice(line.now)}
                </td>
                <td className="py-2 tabular-nums text-ink">
                  {formatPrice(lineSaving(line))} · {savingPercent(line)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-sm text-ink">{copy.prices.note}</p>
      </Section>

      <Section tone="tint" id="reviews" className="!py-8 lg:!py-12">
        <h2 className="heading text-balance text-ink">{copy.reviews.title}</h2>
        <ul data-swipe className={SWIPE}>
          {copy.reviews.items.map((review) => (
            <li key={review.name} className="w-[84%] shrink-0 snap-start sm:w-80">
              <ReviewCard quote={review.quote} name={review.name} />
            </li>
          ))}
        </ul>
        <a href={GOOGLE_REVIEWS} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-berry underline underline-offset-4">
          {copy.reviews.readAll}
        </a>
      </Section>

      <Section tone="white" id="salons" className="!py-8 lg:!py-12">
        <h2 className="heading text-balance text-ink">{copy.salons.title}</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-3">
          {locations.map((loc) => (
            <li key={loc.id} data-branch={loc.id} data-cta="claim_at_salon" className="rounded-3xl border border-berry/10 bg-white p-4 shadow-soft">
              <h3 className="font-display text-xl font-medium text-ink">
                <a href={loc.path} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                  Xing {loc.name}
                </a>
              </h3>
              <p className="text-sm text-muted">
                {loc.area} · {loc.hours.shortLabel}
              </p>
              <StatusChip salon={loc} className="mt-1" />
              <div className="mt-3 flex items-center gap-2">
                <a
                  href={`${loc.whatsappHref}?text=${encodeURIComponent(claimText(sheetOfferById('nov-colour-menu')!, loc, 'Pick later'))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('nov_offer_claim', { offer_id: 'nov-colour-menu', placement: 'november', branch: loc.id, page: location.pathname })}
                  className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-whatsapp px-3 text-sm font-semibold text-white active:scale-[0.98]"
                >
                  <WhatsAppIcon className="size-5" />
                  Claim here
                </a>
                <a href={loc.phoneHref} aria-label={`Call Xing ${loc.name}`} className="grid size-12 shrink-0 place-items-center rounded-full border border-berry text-berry">
                  <Phone aria-hidden className="size-5" />
                </a>
                <a href={loc.directionsUrl} target="_blank" rel="noopener noreferrer" aria-label={`Directions to Xing ${loc.name}`} className="grid size-12 shrink-0 place-items-center rounded-full border border-berry text-berry">
                  <Navigation aria-hidden className="size-5" />
                </a>
              </div>
              <details className="mt-1">
                <summary className="flex min-h-11 cursor-pointer list-none items-center text-sm font-medium text-berry [&::-webkit-details-marker]:hidden">{copy.salons.showAddress}</summary>
                <SalonNap salon={loc} />
              </details>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="tint" id="faq" className="!py-8 lg:!py-12">
        <FAQAccordion title={copy.faqTitle} items={copy.faqs} askHref={generalHref} />
        <details className="group mt-6 rounded-2xl bg-white px-4">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
            {copy.more.title}
            <ArrowRight aria-hidden className="size-4 text-berry transition-transform group-open:rotate-90" />
          </summary>
          <div className="pb-4">
            <Accordion
              idPrefix="offer-more"
              items={novemberCampaign.offers.map((offer) => ({
                q: offer.title,
                a: [offer.answer, ...offer.details.map((block) => `${block.title} ${block.text}`)].join(' '),
                href: offer.serviceLink,
                linkLabel: 'Read more',
              }))}
            />
          </div>
        </details>
        <p className="mt-4 text-xs text-muted">Last updated: {__BUILD_DATE__}</p>
      </Section>

      {novemberPosts.length > 0 && (
        <Section tone="white" id="guides" className="!py-8 lg:!py-12">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="heading text-ink">{copy.guides.title}</h2>
            <ArrowLink href="/blog">{copy.guides.all}</ArrowLink>
          </div>
          <ul data-swipe className={SWIPE}>
            {novemberPosts.map((post) => (
              <li key={post.slug} className="w-[72%] shrink-0 snap-start sm:w-72">
                <BlogCard post={post} compact />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <section aria-labelledby="final-cta" className="bg-gradient-to-br from-berry via-berrydark to-ink py-10 text-center">
        <div className="container-site">
          <h2 id="final-cta" className="font-display text-3xl font-medium text-cream">
            {copy.cta.title}
          </h2>
          <a
            href={generalHref}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="november_final"
            className="mx-auto mt-5 flex min-h-[3.25rem] max-w-sm items-center justify-center gap-2 rounded-full bg-whatsapp px-6 text-base font-semibold text-white active:scale-[0.98]"
          >
            <WhatsAppIcon className="size-5" />
            {cta.label}
          </a>
        </div>
      </section>

      <PosterZoom offer={zoom} onClose={() => setZoom(null)} />
      <ClaimBar href={generalHref} phoneHref={salon?.phoneHref ?? PICK_CALL} />
    </div>
  );
}
