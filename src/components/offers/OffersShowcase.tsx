import { ArrowRight } from 'lucide-react';
import { offers as copy } from '../../data/content';
import { offerCategories } from '../../data/offerCatalog';
import { offersPath } from '../../data/offers';
import { Floral } from '../ui/Decor';
import { Reveal, SectionIntro } from '../ui/Primitives';
import { SnapRow } from '../ui/SnapRow';
import { CategoryCard } from './OfferPageParts';

/**
 * The offers on the home page: the same three category cards as /offers (hair colour, hair treatment, skin care),
 * each opening its page. Phones: a swipe row with dots. Desktop: the intro on the left and the three cards.
 */
export function OffersShowcase() {
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
            View all offers
            <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
          </a>
        </SectionIntro>

        <div className="min-w-0 lg:col-span-9">
          <SnapRow tone="dark" itemWidth="w-[82%]" className="md:grid-cols-3 md:gap-5">
            {offerCategories.map((category, i) => (
              <Reveal key={category.id} delay={i * 0.06} className="h-full">
                <CategoryCard id={category.id} />
              </Reveal>
            ))}
          </SnapRow>
          <p className="mt-6 text-center text-sm text-cream/90">{copy.note}</p>
        </div>
      </div>
    </section>
  );
}
