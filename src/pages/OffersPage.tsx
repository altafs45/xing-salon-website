import { useEffect, useState } from 'react';
import { BadgeCheck, CalendarCheck, Gift, MessageCircle, Phone, Sparkles } from 'lucide-react';
import { CatalogCard, ImageZoom } from '../components/offers/CatalogCard';
import { CategoryCard, ClaimBar, SalonChips } from '../components/offers/OfferPageParts';
import { SalonNap } from '../components/SalonNap';
import { FAQAccordion } from '../components/service/FAQAccordion';
import { Section } from '../components/service/SectionHeader';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { WhatsAppIcon } from '../components/ui/WhatsAppIcon';
import { useBooking } from '../context/booking';
import { locations, ratingLabel } from '../data/branches';
import { site } from '../data/content';
import { membershipPath } from '../data/membershipLinks';
import { biggestSaving, catalogOfferById, fromPriceIn, offerCategories, type OfferImage } from '../data/offerCatalog';
import { offersHubPage as copy, offerPagesShared as shared, pageClaimMessage } from '../data/offerPages';
import { isCampaignOpen, promoHref, salonOfferById } from '../data/offers';
import { CTA } from '../data/style';
import { track } from '../lib/analytics';
import { isOfferToday, useChosenSalon } from '../lib/offers';
import { PICK_CALL, whatsappLink } from '../lib/whatsapp';

const SECTION = '!py-8 lg:!py-12';
const STEP_ICONS = [MessageCircle, BadgeCheck, CalendarCheck];

/** /offers: every current offer, for all three salons. Each category has its own page; this is the overview. */
export default function OffersPage() {
  const salon = useChosenSalon();
  const booking = useBooking();
  const [zoom, setZoom] = useState<OfferImage | null>(null);
  const message = pageClaimMessage(copy.claim);
  const generalHref = salon ? whatsappLink(message.replace('___ (location)', salon.name), salon.whatsappHref) : whatsappLink(message);
  const featured = biggestSaving();
  const tuesday = salonOfferById('tuesday')!;
  const tuesdayToday = isOfferToday(tuesday);
  const faqs = copy.faqs.filter((item) => !('campaign' in item) || isCampaignOpen());

  // Old links to an offer's card here (/offers#keratin, /offers#hydra-facial) now go to its category page.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id && (catalogOfferById(id) || id === 'hair-colour')) window.location.replace(promoHref(id));
  }, []);

  return (
    <div data-cta="offers_page">
      <section id="top" className="bg-gradient-to-br from-blush via-cream to-mint pb-6 pt-header-sm lg:pb-12 lg:pt-header">
        <div className="container-site pt-2 lg:pt-8">
          <Breadcrumbs trail={[{ label: 'Home', href: '/' }]} current="Offers" />
          <h1 className="text-balance font-display text-3xl font-medium leading-tight text-ink lg:text-hero">{copy.hero.h1}</h1>
          <p className="mt-1 text-base font-medium text-ink">{copy.hero.sub}</p>
          <p className="mt-1 text-sm text-muted">{ratingLabel({ value: site.rating, count: locations.reduce((sum, loc) => sum + loc.rating.count, 0) })}</p>
          <SalonChips className="mt-4" />
          <div data-hero-cta className="mt-3 grid max-w-md gap-2 sm:flex sm:items-center">
            <a
              href={generalHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('offer_page_claim', { category: 'all', branch: salon?.id ?? 'none', page: location.pathname })}
              className="flex min-h-12 min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-whatsapp px-4 text-sm font-semibold text-white active:scale-[0.98] sm:flex-1"
            >
              <WhatsAppIcon className="size-5 shrink-0" />
              {CTA.claimWhatsapp}
            </a>
            <button type="button" onClick={() => booking.open('', salon?.name ?? '')} className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full border border-berry px-4 text-sm font-semibold text-berry active:scale-[0.98]">
              {CTA.book}
            </button>
          </div>
        </div>
      </section>

      <Section tone="white" id="categories" className={SECTION}>
        <h2 className="heading text-balance text-ink">{copy.categoriesTitle}</h2>
        <ul className="mt-4 grid gap-5 md:grid-cols-3">
          {offerCategories.map((category, i) => (
            <li key={category.id} className="min-w-0">
              <CategoryCard id={category.id} priority={i === 0} />
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="tint" id="featured" className={SECTION}>
        <h2 className="heading text-balance text-ink">{copy.featuredTitle}</h2>
        <div className="mt-4 max-w-md">
          <CatalogCard offer={featured} placement="offers" onZoom={setZoom} />
        </div>
      </Section>

      <Section tone="white" id="more" className={SECTION}>
        <h2 className="heading text-balance text-ink">{copy.extrasTitle}</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          <li id="tuesday" className="min-w-0 scroll-mt-32">
            <div className="flex h-full items-start gap-3 rounded-3xl border border-berry/10 bg-blush p-4">
              <Sparkles aria-hidden className="mt-0.5 size-6 shrink-0 text-berry" />
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 font-semibold text-ink">
                  {tuesday.title}
                  {tuesdayToday && <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-semibold text-ink">Today</span>}
                </p>
                <p className="text-sm font-semibold text-berry">{tuesday.badge}</p>
                <p className="text-sm text-muted">{tuesday.terms[0]}</p>
              </div>
            </div>
          </li>
          <li id="membership" className="min-w-0 scroll-mt-32">
            <a href={membershipPath} className="flex h-full items-start gap-3 rounded-3xl border border-berry/10 bg-white p-4 shadow-soft active:scale-[0.98]">
              <Gift aria-hidden className="mt-0.5 size-6 shrink-0 text-berry" />
              <span className="min-w-0">
                <span id="gift-card" className="block font-semibold text-ink">
                  Memberships &amp; Gift Cards
                </span>
                <span className="block text-sm font-semibold text-berry">{salonOfferById('membership')!.badge}</span>
                <span className="block text-sm text-muted">Pay once and save all year, or gift a Xing day.</span>
              </span>
            </a>
          </li>
        </ul>
      </Section>

      <Section tone="tint" id="how" className={SECTION}>
        <h2 className="heading text-balance text-ink">{shared.steps.title}</h2>
        <ol className="mt-4 grid gap-3 md:grid-cols-3">
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
      </Section>

      <Section tone="white" id="salons" className={SECTION}>
        <h2 className="heading text-balance text-ink">{shared.salons.title}</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-3">
          {locations.map((loc) => (
            <li key={loc.id} data-branch={loc.id} className="min-w-0 rounded-3xl border border-berry/10 bg-white p-4 shadow-soft">
              <h3 className="font-display text-xl font-medium text-ink">
                <a href={loc.path} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                  Xing {loc.name}
                </a>
              </h3>
              <SalonNap salon={loc} />
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="tint" id="faq" className={SECTION}>
        <FAQAccordion title={copy.faqTitle} items={faqs} askHref={generalHref} allLink />
      </Section>

      <section data-claim-end aria-labelledby="final-cta" className="bg-gradient-to-br from-berry via-berrydark to-ink py-10 text-center">
        <div className="container-site">
          <h2 id="final-cta" className="text-balance font-display text-3xl font-medium text-cream">
            {copy.cta}
          </h2>
          <div className="mx-auto mt-5 flex max-w-sm items-center gap-2">
            <a href={generalHref} target="_blank" rel="noopener noreferrer" data-cta="offers_final" className="flex min-h-[3.25rem] min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-whatsapp px-6 text-base font-semibold text-white active:scale-[0.98]">
              <WhatsAppIcon className="size-5" />
              {CTA.claimWhatsapp}
            </a>
            <a href={salon?.phoneHref ?? PICK_CALL} aria-label="Call a salon" className="grid size-[3.25rem] shrink-0 place-items-center rounded-full border border-cream/60 text-cream">
              <Phone aria-hidden className="size-5" />
            </a>
          </div>
        </div>
      </section>

      <ImageZoom image={zoom} onClose={() => setZoom(null)} />
      <ClaimBar href={generalHref} phoneHref={salon?.phoneHref ?? PICK_CALL} from={fromPriceIn()} placement="offers_page" />
    </div>
  );
}
