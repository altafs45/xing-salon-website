import { lazy, Suspense, useEffect, useLayoutEffect, useState } from 'react';
import { novemberPosts } from 'virtual:blog-picks';
import { ArrowRight, Check, Navigation, Phone, Star } from 'lucide-react';
import { BlogCard } from '../components/blog/BlogCard';
import { StatusChip } from '../components/branch/StatusChip';
import { ReelCard } from '../components/Reels';
import { NovemberCard, useExpiredSchema } from '../components/offers/NovemberBits';
import { NovemberHero } from '../components/offers/NovemberHero';
import { FAQAccordion } from '../components/service/FAQAccordion';
import { MobileStickyBar } from '../components/service/MobileStickyBar';
import { Section, SectionHeader } from '../components/service/SectionHeader';
import { CTABand, ProcessStepper } from '../components/service/Sections';
import { ArrowLink } from '../components/ui/Button';
import { WhatsAppIcon } from '../components/ui/WhatsAppIcon';
import { Picture, Reveal } from '../components/ui/Primitives';
import { useBooking } from '../context/booking';
import { locations } from '../data/branches';
import { beforeAfter, reels } from '../data/media';
import { novemberOffersPage as copy } from '../data/novemberOffersPage';
import {
  campaignCountdown,
  campaignLines,
  campaignState,
  formatPrice,
  lineSaving,
  novemberCampaign,
  offersPath,
  PRICE_NOTE,
  savingPercent,
  sheetOfferById,
  streakRange,
  type CampaignOfferId,
} from '../data/offers';
import { useHasShell } from '../hooks/useHasShell';
import { track } from '../lib/analytics';
import { cn } from '../lib/cn';
import { claimText, useChosenSalon } from '../lib/offers';
import { PICK_CALL, PICK_DIRECTIONS, whatsappLink } from '../lib/whatsapp';

// The before/after slider loads once its section is reached.
const BeforeAfter = lazy(() => import('../components/BeforeAfter').then((module) => ({ default: module.BeforeAfter })));

const HIGHLIGHT_MS = 2500;
const GOOGLE_REVIEWS = 'https://www.google.com/maps/search/?api=1&query=Xing+Premium+Unisex+Salon+Bangalore';

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

/** /offers/november: the three November hair colour offers, with prices, and everything needed to trust them. */
export default function NovemberOffersPage() {
  const state = campaignState();
  const salon = useChosenSalon();
  const booking = useBooking();
  const [highlight, setHighlight] = useState<CampaignOfferId | null>(null);
  const ended = state === 'ended';
  const generalHref = salon ? whatsappLink(copy.claimMessage.replace('___ (location)', salon.name), salon.whatsappHref) : whatsappLink(copy.claimMessage);
  const openBooking = () => booking.open('Hair Color', salon?.name ?? '');

  useExpiredSchema();
  // A page built before the end date still carries the live hero.
  useLayoutEffect(() => {
    if (ended) document.getElementById('first-paint')?.remove();
  }, [ended]);

  // The hero may be plain build-time HTML, so the live parts are added here.
  useEffect(() => {
    document.querySelectorAll('[data-nov-countdown]').forEach((el) => (el.textContent = campaignCountdown()));
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest('[data-nov-book]')) openBooking();
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salon?.id]);

  if (ended) return <Ended />;

  const pick = (id: CampaignOfferId) => {
    setHighlight(id);
    window.setTimeout(() => setHighlight(null), HIGHLIGHT_MS);
    track('nov_picker_result', { offer_id: id, placement: 'november', branch: salon?.id ?? 'none' });
    document.querySelector(`[data-offer-card="${id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const pair = beforeAfter.pairs.find((item) => item.caption === copy.results.pair);
  const results = reels.items.filter((reel) => (copy.results.reels as readonly string[]).includes(reel.caption));

  return (
    <div data-cta="november_page">
      <HeroSlot />

      <Section tone="white" id="offers">
        <SectionHeader eyebrow={copy.offersTitle.eyebrow} title={copy.offersTitle.title} text={copy.offersTitle.text} />
        <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {novemberCampaign.offers.map((offer, i) => (
            <li key={offer.id} className="scroll-mt-32">
              <NovemberCard offer={offer} placement="november" priority={i === 0} highlighted={highlight === offer.id} />
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="tint" id="choose">
        <SectionHeader eyebrow={copy.choose.eyebrow} title={copy.choose.title} text={copy.choose.text} />
        <ul className="mt-6 grid gap-3 md:grid-cols-3">
          {copy.choose.options.map((option) => (
            <li key={option.label}>
              <button type="button" onClick={() => pick(option.offer)} className="svc-card flex min-h-11 w-full flex-col items-start gap-1 p-4 text-left hover:ring-2 hover:ring-berry/40">
                <span className="text-sm font-semibold text-ink">{option.label}</span>
                <span className="inline-flex items-center gap-1 text-sm text-berry">
                  {option.result}
                  <ArrowRight aria-hidden className="size-4 shrink-0" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="white" id="prices">
        <SectionHeader eyebrow={copy.prices.eyebrow} title={copy.prices.title} text={copy.prices.text} />
        <div className="svc-card mt-8 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="border-b border-ink/10 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th scope="col" className="p-3 font-semibold">Service</th>
                <th scope="col" className="p-3 font-semibold">Was</th>
                <th scope="col" className="p-3 font-semibold">Now</th>
                <th scope="col" className="p-3 font-semibold">You save</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {campaignLines().map((line) => (
                <tr key={line.label}>
                  <th scope="row" className="p-3 font-medium text-ink">
                    {line.label}
                    <span className="block text-xs font-normal text-muted">
                      {[line.note, line.unit, line.unit && line.label === 'Hair Highlights' ? `8–10 streaks ≈ ${streakRange()}` : ''].filter(Boolean).join(' · ')}
                    </span>
                  </th>
                  <td className="p-3 text-muted"><s>{formatPrice(line.was)}</s></td>
                  <td className="p-3 font-semibold text-berry">{line.from && 'from '}{formatPrice(line.now)}</td>
                  <td className="p-3 text-ink">{formatPrice(lineSaving(line))} · {savingPercent(line)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-ink">{copy.prices.note}</p>
        <p className="mt-1 text-xs text-muted">{PRICE_NOTE}</p>
      </Section>

      {novemberCampaign.offers.map((offer, i) => {
        const dive = copy.deepDives[offer.id];
        const links = 'links' in dive ? dive.links : [dive.link];
        return (
          <Section key={offer.id} tone={i % 2 ? 'white' : 'tint'} id={offer.id}>
            <SectionHeader eyebrow={dive.eyebrow} title={dive.title} text={dive.answer} />
            <dl className="mt-8 grid gap-4 md:grid-cols-2">
              {dive.blocks.map((block) => (
                <div key={block.title} className="svc-card p-5">
                  <dt className="font-display text-xl font-medium text-ink">{block.title}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted">{block.text}</dd>
                </div>
              ))}
            </dl>
            {offer.id === 'nov-highlights' && (
              <div className="mt-8">
                <h3 className="font-display text-2xl font-medium text-ink">{copy.streaks.title}</h3>
                <p className="mt-1 text-sm text-muted">{copy.streaks.text}</p>
                <ul className="mt-3 grid grid-cols-3 gap-3">
                  {copy.streaks.examples.map((example) => (
                    <li key={example.count} className="svc-card p-4 text-center">
                      <p className="text-sm text-muted">{example.count} streaks</p>
                      <p className="font-display text-xl font-medium text-berry sm:text-2xl">{example.total}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <ul className="mt-6 flex flex-wrap gap-x-6">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-berry underline-offset-4 hover:underline">
                    {link.label}
                    <ArrowRight aria-hidden className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        );
      })}

      <Section tone="white" id="results">
        <SectionHeader eyebrow={copy.results.eyebrow} title={copy.results.title} text={copy.results.text} />
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pair && (
            <li>
              <Suspense fallback={<div className="aspect-[3/4] w-full rounded-card bg-blush" />}>
                <BeforeAfter pair={pair} sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw" />
              </Suspense>
            </li>
          )}
          {results.map((reel) => (
            <li key={reel.caption}>
              <ReelCard reel={reel} />
            </li>
          ))}
        </ul>
        <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {copy.results.photos.map((photo) => (
            <li key={photo}>
              <Picture
                image={{ src: `/images/work-${photo}.webp`, alt: `${photo.startsWith('balayage') ? 'Balayage' : 'Highlights'} on a client at Xing Salon Bangalore`, width: 600, height: 800 }}
                sizes="(min-width: 1024px) 200px, 50vw"
                className="aspect-[3/4] w-full rounded-card object-cover"
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="tint" id="safety">
        <SectionHeader eyebrow={copy.safety.eyebrow} title={copy.safety.title} text={copy.safety.text} />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {copy.safety.items.map((item) => (
            <li key={item.title} className="svc-card p-5">
              <p className="font-display text-lg font-medium text-ink">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{item.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="white" id="how">
        <SectionHeader eyebrow={copy.how.eyebrow} title={copy.how.title} />
        <ProcessStepper steps={copy.how.items} />
      </Section>

      <Section tone="tint" id="genuine">
        <SectionHeader eyebrow={copy.genuine.eyebrow} title={copy.genuine.title} text={copy.genuine.text} />
        <ul className="mt-6 space-y-2">
          {copy.genuine.items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-ink sm:text-base">
              <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="white" id="reviews">
        <SectionHeader eyebrow={copy.reviews.eyebrow} title={copy.reviews.title} />
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {copy.reviews.items.map((review) => (
            <li key={review.name}>
              <Reveal className="svc-card flex h-full flex-col p-5">
                <span role="img" aria-label="5 out of 5 stars" className="flex gap-0.5 text-gold">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} aria-hidden className="size-4 fill-current" />
                  ))}
                </span>
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink">“{review.quote}”</blockquote>
                <p className="mt-4 text-sm font-semibold text-ink">
                  {review.name} <span className="font-normal text-muted">· {copy.reviews.source}</span>
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-sm text-muted">
          {copy.reviews.rating} ·{' '}
          <a href={GOOGLE_REVIEWS} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-medium text-berry underline underline-offset-4">
            {copy.reviews.readAll}
          </a>
        </p>
      </Section>

      <Section tone="tint" id="salons">
        <SectionHeader eyebrow={copy.salons.eyebrow} title={copy.salons.title} />
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {locations.map((loc) => (
            <li key={loc.id} data-branch={loc.id} data-cta="claim_at_salon" className="svc-card flex flex-col gap-3 p-5">
              <div>
                <h3 className="font-display text-xl font-medium text-ink">
                  <a href={loc.path} className="underline-offset-4 hover:underline">Xing {loc.name}</a>
                </h3>
                <p className="text-sm text-muted">{loc.area}</p>
              </div>
              <StatusChip className="self-start" />
              <a
                href={`${loc.whatsappHref}?text=${encodeURIComponent(claimText(sheetOfferById('nov-colour-menu')!, loc, 'Pick later'))}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('nov_offer_claim', { offer_id: 'nov-colour-menu', placement: 'november', branch: loc.id })}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-whatsapp px-4 text-sm font-semibold text-white hover:brightness-105"
              >
                <WhatsAppIcon className="size-5" />
                Claim at {loc.name}
              </a>
              <div className="flex gap-4 text-sm font-medium text-berry">
                <a href={loc.phoneHref} className="inline-flex min-h-11 items-center gap-1.5">
                  <Phone aria-hidden className="size-4" />
                  Call
                </a>
                <a href={loc.directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5">
                  <Navigation aria-hidden className="size-4" />
                  Directions
                </a>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="white" id="faq">
        <FAQAccordion title={copy.faqTitle} items={copy.faqs} askHref={generalHref} />
        <p className="mt-6 text-xs text-muted">Last updated: {__BUILD_DATE__}</p>
      </Section>

      {novemberPosts.length > 0 && (
        <Section tone="tint" id="guides">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeader eyebrow={copy.guides.eyebrow} title={copy.guides.title} />
            <ArrowLink href="/blog">View all articles</ArrowLink>
          </div>
          <ul className={cn('mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4')}>
            {novemberPosts.map((post) => (
              <li key={post.slug}>
                <BlogCard post={post} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CTABand title={copy.cta.title} whatsappHref={generalHref} book={{ label: copy.hero.book, onClick: openBooking }} />

      <MobileStickyBar
        whatsappHref={generalHref}
        phoneHref={salon?.phoneHref ?? PICK_CALL}
        directionsHref={salon?.directionsUrl ?? PICK_DIRECTIONS}
        branch={salon?.id}
        whatsappLabel={`Claim November offer · ${campaignCountdown().split(' · ').pop()}`}
      />
    </div>
  );
}
