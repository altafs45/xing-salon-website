import { CalendarDays, Clock } from 'lucide-react';
import { campaignCta, formatPrice, heroPoster, novemberCampaign } from '../../data/offers';
import { novemberOffersPage, pageClaimMessage } from '../../data/novemberOffersPage';
import { whatsappLink } from '../../lib/whatsapp';
import { Picture } from '../ui/Primitives';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';

const { hero } = novemberOffersPage;
const [offer] = novemberCampaign.offers;
const [lead] = offer.lines;

/**
 * The first screen. The build writes it into the page as plain HTML (SHELLS in vite.config.ts), so there are no hooks
 * here: the page fills in `data-nov-pill` and `data-nov-claim`, and answers `data-nov-book`, once its script has loaded.
 */
export function NovemberHero() {
  const cta = campaignCta();
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-b from-blush to-cream pt-header-sm lg:pt-header">
      <div className="container-site grid gap-x-12 pb-6 pt-3 lg:grid-cols-2 lg:items-center lg:pb-14 lg:pt-10">
        <div className="relative mx-auto w-full max-w-[21.25rem] lg:order-2 lg:max-w-md">
          <Picture
            image={heroPoster}
            eager
            priority
            sizes="(min-width: 1024px) 448px, 340px"
            className="aspect-square w-full rounded-3xl object-cover shadow-soft ring-1 ring-berry/20"
          />
          <span className="absolute -left-2 -top-2 rounded-full bg-success px-3 py-1 text-sm font-semibold text-white shadow-soft">{hero.sticker}</span>
        </div>

        <div className="mt-4 min-w-0 lg:order-1 lg:mt-0">
          <h1 className="text-balance font-display text-[1.875rem] font-medium leading-tight text-ink sm:text-hero">
            {hero.h1}
            <span className="sr-only">{hero.h1Hidden}</span>
          </h1>
          <p className="mt-1 text-sm text-muted">{hero.sub}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <p data-nov-price className="flex items-baseline gap-2">
              <s className="text-base tabular-nums text-muted">{formatPrice(lead.was)}</s>
              <span className="font-display text-4xl font-medium tabular-nums text-berry">{formatPrice(lead.now)}</span>
            </p>
            <p data-nov-saving className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1 text-xs font-semibold text-success">
              <Clock aria-hidden className="size-3.5" />
              <span data-nov-pill>Valid till {novemberCampaign.endLabel}</span>
            </p>
          </div>
          <a
            href={whatsappLink(pageClaimMessage(cta.text))}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="november_hero"
            data-nov-claim
            data-hero-cta
            className="mt-3 flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 text-base font-semibold text-white transition hover:brightness-105 active:scale-[0.98] lg:max-w-sm"
          >
            <WhatsAppIcon className="size-5" />
            <span data-nov-claim-label>{cta.label}</span>
          </a>
          <button type="button" data-nov-book className="mt-1 inline-flex min-h-11 w-full items-center justify-center gap-2 text-sm font-medium text-berry underline-offset-4 hover:underline lg:max-w-sm">
            <CalendarDays aria-hidden className="size-4" />
            {hero.book}
          </button>
        </div>
      </div>
    </section>
  );
}
