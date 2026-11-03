import { lazy, Suspense, useState } from 'react';
import { offerPosts } from 'virtual:blog-picks';
import { ArrowRight, BadgeCheck, CalendarCheck, Lock, MessageCircle, Navigation, Phone, ShieldCheck, Star, Wallet, type LucideIcon } from 'lucide-react';
import { BlogCard } from '../components/blog/BlogCard';
import { StatusChip } from '../components/branch/StatusChip';
import { CatalogCard, ImageZoom, PriceLine, useExpiredSchema, validLine } from '../components/offers/CatalogCard';
import { CategoryCard, ClaimBar, OfferTabs, SalonChips } from '../components/offers/OfferPageParts';
import { ReelCard } from '../components/Reels';
import { SalonNap } from '../components/SalonNap';
import { FAQAccordion } from '../components/service/FAQAccordion';
import { Section } from '../components/service/SectionHeader';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { ArrowLink } from '../components/ui/Button';
import { Picture } from '../components/ui/Primitives';
import { WhatsAppIcon } from '../components/ui/WhatsAppIcon';
import { useBooking } from '../context/booking';
import { locations } from '../data/branches';
import { beforeAfter, reels } from '../data/media';
import { categoryById, formatPrice, fromPriceIn, lineSaving, offerCategories, offersIn, savingPercent, type OfferCategoryId, type OfferImage } from '../data/offerCatalog';
import { offerCategoryPages, offerPagesShared as shared, pageClaimMessage } from '../data/offerPages';
import { campaignCountdown, campaignCta, isCampaignOpen, offersPath, salonOfferById, sheetOfferById } from '../data/offers';
import { CTA } from '../data/style';
import { track } from '../lib/analytics';
import { claimText, useChosenSalon } from '../lib/offers';
import { PICK_CALL, whatsappLink } from '../lib/whatsapp';

// The before/after slider loads once its section is reached.
const BeforeAfter = lazy(() => import('../components/BeforeAfter').then((module) => ({ default: module.BeforeAfter })));

const GOOGLE_REVIEWS = 'https://www.google.com/maps/search/?api=1&query=Xing+Premium+Unisex+Salon+Bangalore';
const SWIPE = 'no-scrollbar -mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 md:mx-0 md:px-0';
const TRUST_ICONS: Record<string, LucideIcon> = { chat: MessageCircle, shield: ShieldCheck, lock: Lock, wallet: Wallet };
const STEP_ICONS = [MessageCircle, BadgeCheck, CalendarCheck];
const SECTION = '!py-8 lg:!py-12';

/** A review, cut short with the rest behind "…more". The full text stays in the HTML. */
function ReviewCard({ quote, name }: { quote: string; name: string }) {
  const words = quote.split(/\s+/);
  const long = words.length > shared.reviews.limit;
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
            “{words.slice(0, shared.reviews.limit).join(' ')} <span className="font-medium text-berry">{shared.reviews.moreLabel}</span>
          </summary>
          {words.slice(shared.reviews.limit).join(' ')}”
        </details>
      ) : (
        <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-ink">“{quote}”</blockquote>
      )}
      <figcaption className="mt-2 text-sm font-semibold text-ink">
        {name} <span className="font-normal text-muted">· {shared.reviews.source}</span>
      </figcaption>
    </figure>
  );
}

/** /offers/hair-colour, /offers/hair-treatment and /offers/skin-care, from offerCatalog.ts and offerPages.ts. */
export default function OfferCategoryPage({ id }: { id: OfferCategoryId }) {
  const category = categoryById(id);
  const copy = offerCategoryPages[id];
  const offers = offersIn(id);
  const lead = offers[0];
  const salon = useChosenSalon();
  const booking = useBooking();
  const [zoom, setZoom] = useState<OfferImage | null>(null);
  const campaign = id === 'hair-colour' && isCampaignOpen();
  const cta = campaign ? campaignCta() : { label: CTA.claimWhatsapp, text: copy.claim };
  const message = pageClaimMessage(cta.text);
  const generalHref = salon ? whatsappLink(message.replace('___ (location)', salon.name), salon.whatsappHref) : whatsappLink(message);
  const faqs = copy.faqs.filter((item) => !item.campaign || isCampaignOpen());
  const pair = copy.results?.pair ? beforeAfter.pairs.find((item) => item.caption === copy.results?.pair) : undefined;
  const results = reels.items.filter((reel) => copy.results?.reels.includes(reel.caption));
  const posts = offerPosts[id] ?? [];
  const tuesday = salonOfferById('tuesday')!;
  const leadImage = id === 'hair-colour' && lead.poster ? lead.poster : lead.image;

  useExpiredSchema();

  return (
    <div data-cta={`offers_${id}`}>
      {/* Hero: everything on one phone screen. */}
      <section id="top" className="bg-gradient-to-br from-blush via-cream to-mint pb-6 pt-header-sm lg:pb-12 lg:pt-header">
        <div className="container-site pt-2 lg:grid lg:grid-cols-2 lg:items-center lg:gap-10 lg:pt-8">
          <div className="min-w-0">
            <Breadcrumbs trail={[{ label: 'Home', href: '/' }, { label: 'Offers', href: offersPath }]} current={copy.crumb} />
            <h1 className="text-balance font-display text-3xl font-medium leading-tight text-ink lg:text-hero">{category.h1}</h1>
            <p className="mt-1 text-sm text-muted">{category.intro}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink">{campaign ? campaignCountdown() : 'Limited-time offers'}</span>
              <span className="text-xs text-muted">{shared.trust.rating}</span>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-[38%_1fr] items-center gap-3 lg:mt-0 lg:grid-cols-[45%_1fr]">
            <button type="button" aria-label={`Enlarge ${leadImage.alt}`} onClick={() => setZoom(leadImage)} className="block overflow-hidden rounded-3xl bg-white shadow-soft">
              <Picture image={leadImage} eager priority sizes="(min-width: 1024px) 260px, 38vw" className={id === 'hair-colour' ? 'aspect-square w-full object-cover' : 'aspect-[4/5] w-full object-cover'} />
            </button>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">{lead.title}</p>
              <PriceLine line={lead.lines[0]} size="md" />
            </div>
          </div>
          <SalonChips className="mt-3 lg:col-span-2" />
          <div data-hero-cta className="mt-3 grid gap-2 sm:flex sm:items-center lg:col-span-2 lg:max-w-md">
            <a
              href={generalHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('offer_page_claim', { category: id, branch: salon?.id ?? 'none', page: location.pathname })}
              className="flex min-h-12 min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-whatsapp px-4 text-sm font-semibold text-white active:scale-[0.98] sm:flex-1"
            >
              <WhatsAppIcon className="size-5 shrink-0" />
              {cta.label}
            </a>
            <button type="button" onClick={() => booking.open(lead.bookingService, salon?.name ?? '')} className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full border border-berry px-4 text-sm font-semibold text-berry active:scale-[0.98]">
              {CTA.book}
            </button>
          </div>
        </div>
      </section>

      <OfferTabs items={offers.map((offer) => ({ id: offer.id, label: offer.tab }))} />

      <Section tone="white" id="offers" className={SECTION}>
        <h2 className="sr-only">{category.name} offers</h2>
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {offers.map((offer, i) => (
            <li key={offer.id} id={offer.id} className="relative min-w-0 scroll-mt-32">
              {/* Old links (#nov-highlights) still land here. */}
              {offer.aliases?.map((alias) => <span key={alias} id={alias} aria-hidden className="absolute -top-32" />)}
              <CatalogCard offer={offer} placement="offers" priority={i === 0} onZoom={setZoom} />
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="tint" id="prices" className={SECTION}>
        <h2 className="heading text-balance text-ink">{shared.prices.title}</h2>
        <table className="mt-4 w-full table-fixed overflow-hidden rounded-3xl bg-white text-left text-sm shadow-soft">
          <caption className="sr-only">{shared.prices.caption}</caption>
          <thead className="border-b border-ink/10 text-xs text-muted [&_th:first-child]:pl-4">
            <tr>
              <th scope="col" className="w-[40%] py-2 pr-2 font-semibold">Service</th>
              <th scope="col" className="py-2 pr-2 font-semibold">Was</th>
              <th scope="col" className="py-2 pr-2 font-semibold">Now</th>
              <th scope="col" className="py-2 pr-3 font-semibold">Save</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10 [&_th]:pl-4">
            {offers.map((offer) => {
              const line = offer.lines[0];
              return (
                <tr key={offer.id}>
                  <th scope="row" className="py-2 pr-2 font-medium text-ink [overflow-wrap:anywhere]">
                    <a href={`#${offer.id}`} className="underline-offset-4 hover:underline">
                      {offer.title}
                    </a>
                    {(line.unit || line.note) && <span className="block text-xs font-normal text-muted">{line.unit ?? line.note}</span>}
                  </th>
                  <td className="py-2 pr-2 tabular-nums text-muted">{line.was ? <s>{formatPrice(line.was)}</s> : '—'}</td>
                  <td className="py-2 pr-2 font-semibold tabular-nums text-berry">
                    {line.from && <span className="block text-xs font-normal text-muted">from</span>}
                    {formatPrice(line.now)}
                  </td>
                  <td className="py-2 pr-3 tabular-nums text-ink">{line.was ? `${formatPrice(lineSaving(line))} · ${savingPercent(line)}` : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="mt-3 text-sm text-ink">{copy.pricesNote}</p>
      </Section>

      {copy.results && (
      <Section tone="white" id="results" className={SECTION}>
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
            <li key={photo.name} className="w-[58%] shrink-0 snap-start sm:w-52">
              <Picture
                image={{ src: `/images/${photo.name}.webp`, alt: photo.alt, width: 600, height: photo.name.startsWith('gal-') ? 600 : 800 }}
                sizes="(min-width: 640px) 208px, 58vw"
                className="aspect-[3/4] w-full rounded-3xl bg-blush object-cover"
              />
            </li>
          ))}
        </ul>
      </Section>
      )}

      <Section tone="tint" id="trust" className={SECTION}>
        <h2 className="heading text-balance text-ink">{shared.steps.title}</h2>
        <ol className="mt-4 grid gap-2 md:grid-cols-3 md:gap-3">
          {shared.steps.items.map((step, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <li key={step.title} className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3">
                <Icon aria-hidden className="mt-0.5 size-6 shrink-0 text-berry" />
                <span>
                  <span className="block font-semibold text-ink">
                    {i + 1}. {step.title}
                  </span>
                  <span className="block text-sm text-muted">{step.text}</span>
                </span>
              </li>
            );
          })}
        </ol>
        <ul className="mt-2 grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
          {shared.trust.items.map((item) => {
            const Icon = TRUST_ICONS[item.icon];
            return (
              <li key={item.label} className="flex min-w-0 items-center gap-2 rounded-2xl border border-berry/10 bg-white p-3 text-sm font-medium text-ink">
                <Icon aria-hidden className="size-5 shrink-0 text-berry" />
                {item.label}
              </li>
            );
          })}
        </ul>
        <details className="group mt-3 rounded-2xl border border-berry/10 bg-white px-4">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
            {shared.trust.genuineTitle}
            <ArrowRight aria-hidden className="size-4 text-berry transition-transform group-open:rotate-90" />
          </summary>
          <ul className="space-y-1.5 pb-4 text-sm text-muted">
            {(campaign ? copy.genuine : copy.genuine.filter((line) => !line.includes('30 November'))).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </details>
      </Section>

      {copy.reviews && (
        <Section tone="white" id="reviews" className={SECTION}>
          <h2 className="heading text-balance text-ink">{copy.reviews.title}</h2>
          <ul data-swipe className={SWIPE}>
            {copy.reviews.items.map((review) => (
              <li key={review.name} className="w-[84%] shrink-0 snap-start sm:w-80">
                <ReviewCard quote={review.quote} name={review.name} />
              </li>
            ))}
          </ul>
          <a href={GOOGLE_REVIEWS} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-berry underline underline-offset-4">
            {shared.reviews.readAll}
          </a>
        </Section>
      )}

      <Section tone="tint" id="salons" className={SECTION}>
        <h2 className="heading text-balance text-ink">{shared.salons.title}</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-3">
          {locations.map((loc) => (
            <li key={loc.id} data-branch={loc.id} data-cta="claim_at_salon" className="min-w-0 rounded-3xl border border-berry/10 bg-white p-4 shadow-soft">
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
                  href={`${loc.whatsappHref}?text=${encodeURIComponent(claimText(sheetOfferById(lead.id)!, loc, 'Pick later'))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('offer_claim', { offer_id: lead.id, placement: 'offers', branch: loc.id, page: location.pathname })}
                  className="flex min-h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-whatsapp px-3 text-sm font-semibold text-white active:scale-[0.98]"
                >
                  <WhatsAppIcon className="size-5 shrink-0" />
                  {CTA.claim}
                </a>
                <a href={loc.phoneHref} aria-label={`Call Xing ${loc.name}`} className="grid size-12 shrink-0 place-items-center rounded-full border border-berry text-berry">
                  <Phone aria-hidden className="size-5" />
                </a>
                <a href={loc.directionsUrl} target="_blank" rel="noopener noreferrer" aria-label={`Directions to Xing ${loc.name}`} className="grid size-12 shrink-0 place-items-center rounded-full border border-berry text-berry">
                  <Navigation aria-hidden className="size-5" />
                </a>
              </div>
              <p className="mt-2 text-xs text-muted">{validLine(lead, loc)}</p>
              <details className="mt-1">
                <summary className="flex min-h-11 cursor-pointer list-none items-center text-sm font-medium text-berry [&::-webkit-details-marker]:hidden">{shared.salons.showAddress}</summary>
                <SalonNap salon={loc} />
              </details>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="white" id="faq" className={SECTION}>
        <FAQAccordion title={copy.faqTitle} items={faqs} askHref={generalHref} />
        <p className="mt-4 text-xs text-muted">Last updated: {__BUILD_DATE__}</p>
      </Section>

      {posts.length > 0 && (
        <Section tone="tint" id="guides" className={SECTION}>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="heading text-ink">{shared.guides.title}</h2>
            <ArrowLink href="/blog">{shared.guides.all}</ArrowLink>
          </div>
          <ul data-swipe className={SWIPE}>
            {posts.map((post) => (
              <li key={post.slug} className="w-[72%] shrink-0 snap-start sm:w-72">
                <BlogCard post={post} compact />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section tone="white" id="more-offers" className={SECTION}>
        <h2 className="heading text-balance text-ink">{shared.more.title}</h2>
        <ul data-swipe className={SWIPE}>
          {offerCategories
            .filter((other) => other.id !== id)
            .map((other) => (
              <li key={other.id} className="w-[72%] shrink-0 snap-start sm:w-72">
                <CategoryCard id={other.id} />
              </li>
            ))}
          <li className="w-[72%] shrink-0 snap-start sm:w-72">
            <a href={`${offersPath}#tuesday`} className="flex h-full flex-col justify-center rounded-3xl border border-berry/10 bg-blush p-5 shadow-soft active:scale-[0.98]">
              <span className="font-display text-2xl font-medium text-ink">{tuesday.title}</span>
              <span className="mt-1 text-sm font-semibold text-berry">{tuesday.badge}</span>
              <span className="mt-1 text-sm text-muted">{tuesday.sub}</span>
            </a>
          </li>
        </ul>
      </Section>

      <section data-claim-end aria-labelledby="final-cta" className="bg-gradient-to-br from-berry via-berrydark to-ink py-10 text-center">
        <div className="container-site">
          <h2 id="final-cta" className="text-balance font-display text-3xl font-medium text-cream">
            {copy.cta}
          </h2>
          <a
            href={generalHref}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="offers_final"
            className="mx-auto mt-5 flex min-h-[3.25rem] max-w-sm items-center justify-center gap-2 rounded-full bg-whatsapp px-6 text-base font-semibold text-white active:scale-[0.98]"
          >
            <WhatsAppIcon className="size-5" />
            {cta.label}
          </a>
        </div>
      </section>

      <ImageZoom image={zoom} onClose={() => setZoom(null)} />
      <ClaimBar href={generalHref} phoneHref={salon?.phoneHref ?? PICK_CALL} from={fromPriceIn(id)} placement={`offers_${id}`} />
    </div>
  );
}
