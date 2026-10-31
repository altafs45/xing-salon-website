import { ArrowDown, ArrowRight, MapPin } from 'lucide-react';
import { FAQAccordion } from '../components/service/FAQAccordion';
import { HeroSplit } from '../components/service/HeroSplit';
import { BranchesSection } from '../components/BranchesSection';
import { Section, SectionHeader } from '../components/service/SectionHeader';
import { BenefitGrid, CTABand, OfferCards, RelatedServiceCards } from '../components/service/Sections';
import { ArrowLink, Button } from '../components/ui/Button';
import { CountUp } from '../components/ui/CountUp';
import { WhatsAppIcon } from '../components/ui/Decor';
import { Picture, Reveal } from '../components/ui/Primitives';
import { SnapRow } from '../components/ui/SnapRow';
import { about } from '../data/about';
import { locations } from '../data/branches';
import { offers, type Offer } from '../data/offers';
import { servicePages } from '../data/pages';
import { studio } from '../data/pages/tattoo';
import { servicesHubPath } from '../data/services';
import { homeHref, serviceHref } from '../lib/route';
import { bookingWhatsappHref, whatsappLink } from '../lib/whatsapp';

const photos = locations.flatMap((salon) => salon.photos);

/** /about: the brand story, why Xing, and every salon with its own contact details (#hsr-layout and so on). */
export default function AboutPage() {
  return (
    <div>
      <HeroSplit
        page={about}
        label="About Us"
        trail={[]}
        compactPhoto
        actions={
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4 lg:mt-7">
            <Button href="#locations" arrow={false}>
              Find Your Nearest Salon
              <ArrowDown aria-hidden className="size-4" />
            </Button>
            {/* Asks which salon, then opens that salon's WhatsApp. */}
            <Button variant="outline" href={bookingWhatsappHref} arrow={false}>
              <WhatsAppIcon className="size-4" />
              Book on WhatsApp
            </Button>
          </div>
        }
      />

      {/* Quick finder: the fastest way to the right salon. */}
      <section aria-labelledby="finder-title" className="border-b border-ink/10 bg-cream py-8">
        <div className="container-site">
          <h2 id="finder-title" className="text-base font-semibold text-ink">
            {about.finder.title}
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            {locations.map((salon, i) => (
              <li key={salon.id} className={i === locations.length - 1 && locations.length % 2 ? 'col-span-2 sm:col-span-1' : undefined}>
                <a
                  href={`#${salon.id}`}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-berry/30 bg-white px-5 text-sm font-medium text-ink transition-colors hover:border-berry hover:text-berry sm:w-auto"
                >
                  <MapPin aria-hidden className="size-4 text-berry" />
                  {salon.id === 'brookfield' ? 'Brookfield / AECS Layout' : salon.name}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted">
            {about.finder.tattoo}{' '}
            <a href={serviceHref('tattoo')} className="inline-flex min-h-11 items-center gap-1 font-medium text-berry underline-offset-4 hover:underline">
              {studio.name}, Brookfield
              <ArrowRight aria-hidden className="size-4" />
            </a>
          </p>
        </div>
      </section>

      <Section tone="white">
        <SectionHeader eyebrow={about.story.eyebrow} title={about.story.title} align="center" />
        <Reveal className="mx-auto mt-6 max-w-3xl space-y-4 text-center">
          {about.story.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-base leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </Reveal>
      </Section>

      {/* Numbers: count up once on scroll; shown as final values when motion is reduced. */}
      <section aria-label="Xing in numbers" className="bg-blush py-12">
        <ul className="container-site grid grid-cols-2 gap-6 text-center md:grid-cols-5">
          {about.numbers.map((item) => (
            <li key={item.label}>
              <CountUp value={item.value} suffix={item.suffix} className="block font-display text-stat font-medium text-berry" />
              <span className="mt-1 block text-sm text-ink">{item.label}</span>
            </li>
          ))}
          <li className="col-span-2 md:col-span-1">
            <span className="block font-display text-stat font-medium text-berry">{about.founded}</span>
            <span className="mt-1 block text-sm text-ink">Established</span>
          </li>
        </ul>
      </section>

      <Section tone="white">
        <SectionHeader eyebrow={about.why.eyebrow} title={about.why.title} />
        <BenefitGrid items={about.why.items} />
      </Section>

      <Section tone="tint">
        <SectionHeader eyebrow="What We Do" title={about.specialities.title} />
        <RelatedServiceCards
          items={about.specialities.items.map((item) => ({
            href: serviceHref(item.slug),
            label: item.label,
            text: item.text,
            image: servicePages[item.slug].hero.image,
          }))}
        />
        <ArrowLink href={servicesHubPath} className="mt-8">
          {about.specialities.cta}
        </ArrowLink>
      </Section>

      <section className="on-dark bg-gradient-to-br from-berry via-berrydark to-ink py-16 lg:py-20">
        <Reveal className="container-site">
          <blockquote className="mx-auto max-w-3xl text-balance text-center font-display text-hero font-medium leading-tight text-cream">
            “{about.commitment}”
          </blockquote>
        </Reveal>
      </section>

      <BranchesSection id="locations" />

      {/* Real salon photos only; hidden until a salon has some. */}
      {photos.length > 0 && (
        <Section tone="tint">
          <SectionHeader eyebrow="Gallery" title={about.gallery.title} />
          <div className="mt-10">
            <SnapRow className="md:grid-cols-3 md:gap-5">
              {photos.map((photo) => (
                <Picture key={photo.src} image={photo} className="svc-card aspect-photo w-full object-cover" />
              ))}
            </SnapRow>
          </div>
        </Section>
      )}

      <Section tone="white">
        <SectionHeader eyebrow="Current Offers" title={about.offers.title} />
        {/* Each card's title links to where the offer is described in full. */}
        <OfferCards offers={[offers.tuesday, offers.birthday, offers.membership].map((offer: Offer) => ({ ...offer, href: offer.details }))} />
        <ArrowLink href={homeHref('#offers')} className="mt-8">
          {about.offers.cta}
        </ArrowLink>
      </Section>

      <Section tone="tint" id="faq">
        <FAQAccordion title={about.faqTitle} items={about.faqs} askHref={whatsappLink('Hi, I have a question about Xing at Xing ___ (location).')} />
      </Section>

      <CTABand title={about.cta} whatsappHref={bookingWhatsappHref} />
    </div>
  );
}
