import { Clock } from 'lucide-react';
import { novemberCampaign } from '../../data/offers';
import { novemberOffersPage } from '../../data/novemberOffersPage';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { OfferSlides } from './OfferSlider';

const { hero } = novemberOffersPage;

/**
 * The first screen: the three offers, sliding. The build writes it into the page as plain HTML (SHELLS in
 * vite.config.ts), so there are no hooks here: the page starts the slider, fills in `data-nov-pill` and answers
 * `data-nov-book` once its script has loaded.
 */
export function NovemberHero() {
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-b from-blush via-cream to-cream pt-header-sm lg:pt-header">
      <div className="container-site pb-6 pt-2 lg:pb-12 lg:pt-8">
        <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 sm:mb-0">
          <h1 className="font-display text-2xl font-medium leading-tight text-ink sm:text-hero">
            {hero.h1}
            <span className="sr-only">{hero.h1Hidden}</span>
          </h1>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1 text-xs font-semibold text-success">
            <Clock aria-hidden className="size-3.5" />
            <span data-nov-pill>Valid till {novemberCampaign.endLabel}</span>
          </p>
        </div>
        <p className="mb-2 hidden text-sm text-muted sm:mt-1 sm:mb-4 sm:block">{hero.sub}</p>
        <div data-offer-slider data-gallery data-hero-cta aria-roledescription="carousel" aria-label="November offers">
          <OfferSlides priority onOfferPage />
        </div>
        <Breadcrumbs trail={[{ label: 'Home', href: '/' }, { label: 'Offers', href: '/offers' }]} current={novemberOffersPage.seo.crumb} />
      </div>
    </section>
  );
}
