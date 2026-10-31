import { CalendarDays, Clock, Star } from 'lucide-react';
import { formatPrice, novemberCampaign, PRICE_NOTE, savingLabel } from '../../data/offers';
import { novemberOffersPage } from '../../data/novemberOffersPage';
import { whatsappLink } from '../../lib/whatsapp';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';

const { hero, claimMessage } = novemberOffersPage;
const [lead] = novemberCampaign.offers[0].lines;

/**
 * The first screen. The build writes it into the page as plain HTML (SHELLS in vite.config.ts), so there are no
 * hooks here: the page fills in `data-nov-countdown` and answers `data-nov-book` once its script has loaded.
 */
export function NovemberHero() {
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-br from-blush via-cream to-mint pt-header-sm lg:pt-header">
      <div className="container-site relative pb-8 pt-5 lg:pb-14 lg:pt-12">
        <p className="text-eyebrow font-medium uppercase text-berry">{hero.eyebrow}</p>
        <h1 className="mt-2 text-balance font-display text-[2rem] font-medium leading-[1.1] text-ink sm:text-hero">{hero.h1}</h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">{hero.sub}</p>

        <p className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-sm text-ink">{lead.label}</span>
          <s className="text-sm text-muted">{formatPrice(lead.was)}</s>
          <span className="font-display text-3xl font-medium text-berry">{formatPrice(lead.now)}</span>
          <span className="rounded-full bg-success px-2.5 py-0.5 text-xs font-semibold text-white">{savingLabel(lead)}</span>
        </p>
        <p className="mt-1 text-xs text-muted">{PRICE_NOTE}</p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <a
            href={whatsappLink(claimMessage)}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="november_hero"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-whatsapp px-6 text-sm font-semibold text-white transition hover:brightness-105"
          >
            <WhatsAppIcon className="size-5" />
            {hero.claim}
          </a>
          <button
            type="button"
            data-nov-book
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-berry px-6 text-sm font-semibold text-berry transition hover:bg-berry hover:text-cream"
          >
            <CalendarDays aria-hidden className="size-4" />
            {hero.book}
          </button>
        </div>

        <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-berrydark">
          <Clock aria-hidden className="size-3.5" />
          <span data-nov-countdown>Valid till {novemberCampaign.endLabel}</span>
        </p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {hero.chips.map((chip) => (
            <li key={chip.href}>
              <a href={chip.href} className="inline-flex min-h-11 items-center rounded-full border border-berry/30 bg-white/80 px-4 text-sm font-medium text-ink hover:border-berry hover:text-berry">
                {chip.label}
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-ink">
          {hero.trust.map((item, i) => (
            <span key={item} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden className="text-muted">·</span>}
              {i === 0 ? (
                <span className="inline-flex items-center gap-1">
                  <Star aria-hidden className="size-4 fill-gold text-gold" />
                  {item.replace('★ ', '')}
                </span>
              ) : (
                item
              )}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
