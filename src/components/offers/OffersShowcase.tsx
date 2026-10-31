import { ArrowRight } from 'lucide-react';
import { offers as copy } from '../../data/content';
import { isCampaignOpen, novemberCampaign, offersPath, salonOffers, type SalonOfferId } from '../../data/offers';
import { Floral } from '../ui/Decor';
import { Reveal, SectionIntro } from '../ui/Primitives';
import { SnapRow } from '../ui/SnapRow';
import { NovemberCard } from './NovemberBits';
import { OfferCard } from './OfferCard';

const FEATURED: SalonOfferId[] = ['hydra-facial', 'keratin', 'hair-colour', 'tuesday'];

/**
 * The offers on the home page: the same cards and wording as /offers, in compact form. Phones: a swipe row with
 * dots. Desktop: the intro on the left and four equal cards. Details opens the same sheet as /offers.
 */
export function OffersShowcase({ variant = 'compact' }: { variant?: 'compact' | 'full' }) {
  // During the campaign its colour offer leads and stands in for the everyday one.
  const live = isCampaignOpen();
  const featured = FEATURED.filter((id) => !live || id !== 'hair-colour').map((id) => salonOffers.find((offer) => offer.id === id)!);
  return (
    // data-hide-fab: the back-to-top button steps aside while these cards are on a phone's screen.
    <section id="offers" data-hide-fab className="section on-dark bg-berry">
      <Floral className="-left-14 bottom-0 hidden h-72 text-cream/25 md:block" />
      <Floral flip className="-right-14 top-0 hidden h-72 text-cream/25 md:block" />

      <div className="container-site relative grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-8">
        <SectionIntro tone="dark" eyebrow={copy.eyebrow} title={copy.title} text={copy.text} className="lg:col-span-3">
          <a
            href={offersPath}
            className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-cream px-6 text-sm font-medium text-berry transition-colors hover:bg-blush"
          >
            View all {salonOffers.length} offers
            <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
          </a>
        </SectionIntro>

        <div className="min-w-0 lg:col-span-9">
          <SnapRow tone="dark" itemWidth="w-[82%]" className="md:grid-cols-2 md:gap-5 lg:grid-cols-4 lg:gap-4">
            {live && (
              <Reveal className="h-full">
                <NovemberCard offer={novemberCampaign.offers[2]} placement="home" variant="compact" linkToPage />
              </Reveal>
            )}
            {featured.map((offer, i) => (
              <Reveal key={offer.id} delay={i * 0.06} className="h-full">
                <OfferCard offer={offer} placement="home" variant={variant} />
              </Reveal>
            ))}
          </SnapRow>
          <p className="mt-6 text-center text-sm text-cream/90">{copy.note}</p>
        </div>
      </div>
    </section>
  );
}
