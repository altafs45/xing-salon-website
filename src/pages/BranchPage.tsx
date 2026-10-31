import { useState } from 'react';
import { ArrowRight, Check, Expand, Landmark, MapPin, Navigation, Phone, Star, X } from 'lucide-react';
import { BeforeAfter } from '../components/BeforeAfter';
import { SisterBusinesses } from '../components/BranchesSection';
import { RatingChip, StatusChip } from '../components/branch/StatusChip';
import { FAQAccordion } from '../components/service/FAQAccordion';
import { HeroSplit } from '../components/service/HeroSplit';
import { MobileStickyBar } from '../components/service/MobileStickyBar';
import { Section, SectionHeader } from '../components/service/SectionHeader';
import { BenefitGrid, CTABand, ProcessStepper } from '../components/service/Sections';
import { ArrowLink, Button } from '../components/ui/Button';
import { WhatsAppIcon } from '../components/ui/Decor';
import { Modal } from '../components/ui/Modal';
import { Picture, Reveal } from '../components/ui/Primitives';
import { SnapRow } from '../components/ui/SnapRow';
import { locations, type Salon } from '../data/branches';
import { SalonNap } from '../components/SalonNap';
import { branchPages, visitSteps } from '../data/branchPages';
import { beforeAfter } from '../data/media';
import { salonOfferById, withCampaignFaq } from '../data/offers';
import { NovemberStrip } from '../components/offers/NovemberBits';
import { OfferCard } from '../components/offers/OfferCard';
import { servicePages } from '../data/pages';
import { servicesHubPath } from '../data/services';
import { cn } from '../lib/cn';
import { whatsappLink } from '../lib/whatsapp';



/** /salons/<id>: one salon's own page. Details from branches.ts, copy from data/branchPages, offers from offers.ts. */
export default function BranchPage({ salon }: { salon: Salon }) {
  const page = branchPages[salon.id];
  const hero = salon.photos[page.hero.photo];
  // "Hi Xing Brookfield! I'd like to book the Hair Colour offer. Preferred day/time: "
  const book = (what: string) => whatsappLink(`Hi Xing ${salon.name}! I’d like to book ${what}. Preferred day/time: `, salon.whatsappHref);
  const bookHref = book('an appointment');
  const others = locations.filter((other) => other.id !== salon.id);

  return (
    <div data-branch={salon.id}>
      <div data-cta="hero">
        <HeroSplit
          page={{
            hero: {
              eyebrow: `Xing Premium Unisex Salon · ${salon.name}`,
              h1: page.hero.h1,
              sub: page.hero.sub,
              chips: [],
              image: { ...hero, alt: page.hero.photoAlt },
            },
          }}
          label={salon.name}
          trail={[{ label: 'Salons', href: '/salons' }]}
          actions={
            <>
              <ul className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" aria-label="At a glance">
                <li className="shrink-0">
                  <RatingChip salon={salon} />
                </li>
                <li className="shrink-0">
                  <StatusChip salon={salon} />
                </li>
                <li className="inline-flex min-h-8 shrink-0 items-center whitespace-nowrap rounded-full border border-berry/20 bg-cream px-3 py-1 text-xs font-medium text-ink">
                  Walk-ins welcome
                </li>
              </ul>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4 lg:mt-7">
                <Button href={bookHref} external arrow={false}>
                  <WhatsAppIcon className="size-4" />
                  Book on WhatsApp
                </Button>
                <Button variant="outline" href={salon.phoneHref} arrow={false}>
                  <Phone aria-hidden className="size-4" />
                  Call {salon.name}
                </Button>
              </div>
              <a
                href={salon.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-berry underline-offset-4 hover:underline"
              >
                <Navigation aria-hidden className="size-4" />
                Get directions
              </a>
            </>
          }
        />
      </div>

      <QuickInfo salon={salon} />

      {/* Offers */}
      <Section tone="tint" id="offers">
        <NovemberStrip salon={salon} />
        <div data-cta="offers">
          <SectionHeader eyebrow="Salon Offers" title={page.offers.title} text="Limited-time offers. Your stylist confirms everything before we start." />
          <div className="mt-10">
            <SnapRow itemWidth="w-[85%]" className="md:grid-cols-2 md:gap-5 lg:grid-cols-3">
              {page.offers.items.map((id) => (
                <OfferCard key={id} offer={salonOfferById(id)!} placement="salon" variant="compact" salon={salon} />
              ))}
            </SnapRow>
          </div>
          <p className="mt-4 text-xs text-muted">Terms apply. Offers can change; we confirm the offer and the price with you before starting.</p>
        </div>
      </Section>

      {/* Popular services */}
      <Section tone="white" id="services">
        <SectionHeader eyebrow="Services" title={page.services.title} text={page.services.text} />
        <div className="mt-10">
          <SnapRow className="md:grid-cols-2 md:gap-5 lg:grid-cols-4">
            {page.services.items.map((item, i) => {
              const image = servicePages[item.slug]?.hero.image;
              return (
                <Reveal key={item.label} delay={(i % 4) * 0.05} className="h-full">
                  <a href={`/services/${item.slug}${item.hash ?? ''}`} className="svc-card svc-card-hover group flex h-full flex-col overflow-hidden">
                    {image && !image.src.endsWith('.svg') && (
                      <div className="aspect-photo overflow-hidden bg-blush">
                        <Picture
                          image={image}
                          decorative
                          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 85vw"
                          className="size-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-display text-xl font-medium text-ink">{item.label}</h3>
                      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{item.text}</p>
                      <span className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-berry">
                        View service
                        <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
                      </span>
                    </div>
                  </a>
                </Reveal>
              );
            })}
          </SnapRow>
        </div>
        <ArrowLink href={servicesHubPath} className="mt-6">
          See the full service menu
        </ArrowLink>
      </Section>

      <Gallery salon={salon} title={page.gallery.title} text={page.gallery.text} />

      {/* Before & after: results from Xing's stylists. */}
      <Section tone="white">
        <SectionHeader eyebrow={beforeAfter.eyebrow} title={beforeAfter.title} text={beforeAfter.text} />
        <div className="mt-10">
          <SnapRow className="md:grid-cols-3 md:gap-6">
            {beforeAfter.pairs.slice(0, 3).map((pair) => (
              <BeforeAfter key={pair.before.src} pair={pair} />
            ))}
          </SnapRow>
        </div>
      </Section>

      <Section tone="tint">
        <SectionHeader eyebrow="Why Xing" title={page.why.title} />
        <BenefitGrid items={page.why.items} />
      </Section>

      <BranchReviews salon={salon} title={page.reviews.title} bookHref={bookHref} />

      <Section tone="tint">
        <SectionHeader eyebrow="Your Visit" title="How It Works" />
        <ProcessStepper steps={visitSteps} />
      </Section>

      <Location salon={salon} title={page.reach.title} notes={page.reach.notes} />

      {/* Areas served: written for people, the names as plain text. */}
      <Section tone="tint">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <SectionHeader eyebrow="Areas We Serve" title={page.areas.title} className="lg:col-span-5" />
          <Reveal className="max-w-[65ch] space-y-4 lg:col-span-7">
            {page.areas.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed text-ink">
                {paragraph}
              </p>
            ))}
            <ul className="flex flex-wrap gap-2 pt-2">
              {salon.areasServed.map((area) => (
                <li key={area} className="rounded-full bg-cream px-3 py-1.5 text-sm text-berrydark">
                  {area}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        {page.sister && <SisterBusinesses intro={page.sister} />}
      </Section>

      <Section tone="white" id="faq">
        <FAQAccordion title={page.faqTitle} items={withCampaignFaq(page.faqs)} askHref={whatsappLink(`Hi Xing ${salon.name}! I have a question: `, salon.whatsappHref)} allLink />
      </Section>

      {/* The other salons */}
      <Section tone="tint">
        <div data-cta="other_salons">
          <SectionHeader eyebrow="Other Xing Salons" title="Closer to One of Our Other Salons?" />
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {others.map((other) => (
              <li key={other.id} data-branch={other.id}>
                <a href={other.path} data-branch-card="" className="svc-card svc-card-hover group flex items-center gap-4 p-4 sm:p-5">
                  <Picture image={other.photos[0]} decorative sizes="96px" className="size-20 shrink-0 rounded-xl object-cover sm:size-24" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-xl font-medium text-ink">Xing {other.name}</span>
                    <span className="mt-0.5 block truncate text-sm text-muted">{other.area}</span>
                    <span className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-berry">
                      Visit page
                      <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <div data-cta="final_cta">
        <CTABand title={page.cta} whatsappHref={bookHref} phone={{ href: salon.phoneHref, label: salon.name }} directionsHref={salon.directionsUrl} />
      </div>

      <MobileStickyBar whatsappHref={bookHref} phoneHref={salon.phoneHref} directionsHref={salon.directionsUrl} branch={salon.id} />
    </div>
  );
}

function QuickInfo({ salon }: { salon: Salon }) {
  return (
    <section aria-label={`Visiting Xing ${salon.name}`} className="border-b border-ink/10 bg-cream py-8 lg:py-10">
      <div className="container-site" data-cta="quick_info">
        <SalonNap salon={salon} variant="full" className="svc-card p-5 sm:p-6">
          {salon.landmark && (
            <p className="mt-2 flex items-start gap-2 text-sm text-muted">
              <Landmark aria-hidden className="mt-0.5 size-4 shrink-0 text-berry" />
              {salon.landmark}
            </p>
          )}
        </SalonNap>
      </div>
    </section>
  );
}

/** Six photos of the salon: two columns on phones, a large photo beside four small ones on desktop, and all of them full screen. */
function Gallery({ salon, title, text }: { salon: Salon; title: string; text: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const photos = salon.photos;
  if (!photos.length) return null;

  return (
    <Section tone="tint" id="gallery">
      <SectionHeader eyebrow="The Salon" title={title} text={text} />
      <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2">
        {photos.map((photo, i) => (
          <li key={photo.src} className={cn(i === 0 && 'lg:col-span-2 lg:row-span-2', i === 5 && 'lg:hidden')}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group relative block size-full overflow-hidden rounded-2xl bg-blush"
              aria-label={`View larger: ${photo.alt}`}
            >
              <Picture
                image={photo}
                sizes={i === 0 ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, 50vw'}
                className="aspect-photo size-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </button>
          </li>
        ))}
      </ul>
      <Button variant="outline" onClick={() => setOpen(0)} arrow={false} className="mt-6">
        <Expand aria-hidden className="size-4" />
        View all {photos.length} photos
      </Button>

      <Modal open={open !== null} onClose={() => setOpen(null)} label={title} layout="full">
        <div className="relative p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-medium text-ink">{title}</h2>
            <button type="button" onClick={() => setOpen(null)} aria-label="Close photos" className="grid size-11 shrink-0 place-items-center rounded-full text-ink hover:bg-blush">
              <X aria-hidden className="size-5" />
            </button>
          </div>
          {open !== null && (
            <SnapRow carousel itemWidth="w-full" label={title} startIndex={open}>
              {photos.map((photo) => (
                <figure key={photo.src}>
                  <Picture image={photo} sizes="(min-width: 640px) 34rem, 100vw" className="aspect-photo w-full rounded-2xl object-cover" />
                  <figcaption className="mt-3 text-sm text-muted">{photo.alt}</figcaption>
                </figure>
              ))}
            </SnapRow>
          )}
        </div>
      </Modal>
    </Section>
  );
}

/**
 * The salon's Google rating, with a link to read its reviews on Google. Reviews are shown here only once
 * they are copied from this salon's own Google profile; the brand-wide reviews stay on the home page.
 */
function BranchReviews({ salon, title, bookHref }: { salon: Salon; title: string; bookHref: string }) {
  const { rating } = salon;
  if (!rating) return null;
  return (
    <Section tone="white" id="reviews">
      <div data-cta="reviews" className="svc-card mx-auto flex max-w-3xl flex-col items-center gap-6 p-6 text-center sm:p-10">
        <SectionHeader eyebrow="Google Reviews" title={title} align="center" />
        <div className="flex items-center gap-4">
          <p className="font-display text-stat font-semibold lining-nums text-ink">{rating.value.toFixed(1)}</p>
          <div className="text-left">
            <span role="img" aria-label={`Rated ${rating.value.toFixed(1)} out of 5`} className="flex gap-0.5 text-gold">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} aria-hidden className="size-5 fill-current" />
              ))}
            </span>
            <p className="mt-1 text-sm text-muted">{rating.count.toLocaleString('en-IN')} Google reviews for Xing {salon.name}</p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button href={bookHref} external arrow={false}>
            <WhatsAppIcon className="size-4" />
            Book your visit
          </Button>
          <Button variant="outline" href={salon.mapUrl} external arrow={false}>
            Read all on Google
          </Button>
        </div>
      </div>
    </Section>
  );
}

/** How to get there, with the map loaded only when asked for, so the page stays fast. */
function Location({ salon, title, notes }: { salon: Salon; title: string; notes: string[] }) {
  const [showMap, setShowMap] = useState(false);
  return (
    <Section tone="white" id="directions">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12" data-cta="location">
        <div>
          <SectionHeader eyebrow="Find Us" title={title} />
          <Reveal>
            <SalonNap salon={salon} className="mt-6" />
            <ul className="mt-5 space-y-3">
              {notes.map((note) => (
                <li key={note} className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-berry" />
                  {note}
                </li>
              ))}
            </ul>
            {salon.nearbyLandmarks.length > 0 && (
              <>
                <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-berry">Nearby landmarks</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {salon.nearbyLandmarks.map((place) => (
                    <li key={place} className="rounded-full bg-blush px-3 py-1.5 text-sm text-berrydark">
                      {place}
                    </li>
                  ))}
                </ul>
              </>
            )}
            <Button href={salon.directionsUrl} external arrow={false} className="mt-7 w-full sm:w-auto">
              <Navigation aria-hidden className="size-4" />
              Get directions
            </Button>
          </Reveal>
        </div>

        <Reveal className="svc-card relative aspect-[4/3] overflow-hidden bg-blush">
          {showMap ? (
            <iframe
              src={salon.mapEmbedUrl}
              title={`Map showing Xing ${salon.name}`}
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 size-full border-0"
            />
          ) : (
            // A stand-in for the map: Google's map loads only after a tap.
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-blush via-cream to-mint p-6 text-center">
              <Picture image={salon.photos[0]} decorative sizes="(min-width: 1024px) 50vw, 100vw" className="absolute inset-0 size-full object-cover opacity-20" />
              <span className="relative grid size-14 place-items-center rounded-full bg-berry text-cream shadow-lift">
                <MapPin aria-hidden className="size-7" />
              </span>
              <p className="relative font-display text-2xl font-medium text-ink">Xing {salon.name}</p>
              <p className="relative max-w-xs text-sm text-muted">{salon.area}</p>
              <Button variant="outline" onClick={() => setShowMap(true)} arrow={false} className="relative bg-cream">
                Tap to load map
              </Button>
            </div>
          )}
        </Reveal>
      </div>
    </Section>
  );
}

