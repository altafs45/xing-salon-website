import { useEffect, useRef } from 'react';
import { ArrowRight, CalendarDays, Check, ChevronLeft, ChevronRight, Clock, Pause, Play } from 'lucide-react';
import { novemberOffersPage as copy, pageClaimMessage } from '../../data/novemberOffersPage';
import { campaignCta, formatPrice, novemberCampaign, savingLabel, type CampaignOffer } from '../../data/offers';
import { startOfferSlider } from '../../lib/offerSlider';
import { whatsappLink } from '../../lib/whatsapp';
import { Picture } from '../ui/Primitives';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';

const STEP = 'grid size-11 place-items-center rounded-full border border-berry/30 bg-white text-berry transition-colors hover:border-berry';

function Price({ offer, first }: { offer: CampaignOffer; first: boolean }) {
  const [lead] = offer.lines;
  if (offer.lines.length > 1) {
    return (
      <dl className="mt-3 divide-y divide-ink/10 text-sm">
        {offer.lines.map((line) => (
          <div key={line.label} className="flex items-center justify-between gap-2 py-1.5">
            <dt className="text-ink">
              {line.label}
              {line.unit && <span className="text-muted"> · {line.unit}</span>}
            </dt>
            <dd className="shrink-0 tabular-nums">
              <s className="mr-1.5 text-xs text-muted">{formatPrice(line.was)}</s>
              <span className="font-semibold text-berry">
                {line.from && 'from '}
                {formatPrice(line.now)}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    );
  }
  return (
    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 lg:mt-2">
      <p {...(first && { 'data-nov-price': true })} className="flex flex-wrap items-baseline gap-x-2">
        <s className="text-base tabular-nums text-muted">{formatPrice(lead.was)}</s>
        <span className="font-display text-3xl font-medium tabular-nums text-berry lg:text-4xl">{formatPrice(lead.now)}</span>
        <span className="text-sm text-ink">{lead.note ?? lead.unit}</span>
      </p>
      <p {...(first && { 'data-nov-saving': true })} className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-success">
        {savingLabel(lead)}
      </p>
    </div>
  );
}

interface OfferSlidesProps {
  /** The first poster is the page's main image. */
  priority?: boolean;
  /** On /offers/november: adds the booking button, which the page answers through `data-nov-book`. */
  onOfferPage?: boolean;
}

/** The three November posters, each with its offer in plain words. No hooks: the build writes this into the page. */
function OfferSlides({ priority = false, onOfferPage = false }: OfferSlidesProps) {
  const cta = campaignCta();
  const { offers } = novemberCampaign;
  return (
    <>
      <ul className="mb-2 flex gap-1 rounded-full bg-white p-1 shadow-soft lg:mb-3">
        {offers.map((offer, i) => (
          <li key={offer.id} className="min-w-0 flex-1">
            <button
              type="button"
              data-slider-tab={i}
              data-active={i === 0}
              className="min-h-11 w-full rounded-full px-1.5 text-sm font-medium leading-tight text-ink transition-colors data-[active=true]:bg-berry data-[active=true]:text-cream"
            >
              {copy.switcher[i].label}
            </button>
          </li>
        ))}
      </ul>

      <div className="overflow-hidden rounded-3xl bg-white text-left shadow-soft ring-1 ring-berry/15">
        <div data-slider-track className="flex touch-pan-y transition-transform duration-700 ease-out motion-reduce:transition-none">
          {offers.map((offer, i) => (
            <article key={offer.id} className="grid w-full shrink-0 content-start lg:grid-cols-2 lg:content-center lg:items-center">
              <a href={`${novemberCampaign.path}#${offer.id}`} aria-label={`${offer.title}: see the offer`} className="block">
                <Picture
                  image={offer.fullPoster}
                  eager={priority && i === 0}
                  priority={priority && i === 0}
                  sizes="(min-width: 1280px) 600px, (min-width: 1024px) 50vw, 100vw"
                  className="mx-auto aspect-square w-full max-w-[20rem] bg-white object-contain lg:max-w-none"
                />
              </a>
              {/* Phones: the button comes straight after the price, the explanation after it. */}
              <div className="flex min-w-0 flex-col px-4 pb-4 pt-2 sm:p-6 lg:p-8">
                <p className="hidden text-xs font-semibold uppercase tracking-wide text-berry lg:block">
                  Offer {i + 1} of {offers.length}
                </p>
                <h2 className="font-display text-2xl font-medium leading-tight text-ink lg:mt-1 lg:text-3xl">{offer.title}</h2>
                <Price offer={offer} first={i === 0} />
                <div className="order-1 lg:order-none">
                  <p className="mt-3 text-base leading-relaxed text-ink">{copy.slides[offer.id]}</p>
                  <ul className="mt-3 grid gap-1.5">
                    {offer.includes.slice(0, 3).map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-ink">
                        <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-success">
                    <Clock aria-hidden className="size-4" />
                    Valid till {novemberCampaign.endLabel} · all 3 salons
                  </p>
                </div>
                <a
                  href={whatsappLink(pageClaimMessage(`I’d like the ${offer.title} offer.`))}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta="november_slider"
                  className="mt-2 flex min-h-[3.25rem] w-full lg:mt-4 items-center justify-center gap-2 rounded-full bg-whatsapp px-6 text-base font-semibold text-white transition hover:brightness-105 active:scale-[0.98]"
                >
                  <WhatsAppIcon className="size-5" />
                  {cta.label}
                </a>
                <div className="mt-1 flex flex-wrap justify-center gap-x-4">
                  <a href={`${novemberCampaign.path}#${offer.id}`} className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-berry underline-offset-4 hover:underline">
                    See full details
                    <ArrowRight aria-hidden className="size-4" />
                  </a>
                  {onOfferPage && (
                    <button type="button" data-nov-book className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-berry underline-offset-4 hover:underline">
                      <CalendarDays aria-hidden className="size-4" />
                      {copy.hero.book}
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-3 flex justify-center gap-2">
        <button type="button" data-slider-step="-1" aria-label="Previous offer" className={STEP}>
          <ChevronLeft aria-hidden className="size-5" />
        </button>
        <button type="button" data-slider-toggle aria-label="Pause the offers" className={STEP}>
          <Pause aria-hidden className="size-5" />
          <Play aria-hidden className="hidden size-5" />
        </button>
        <button type="button" data-slider-step="1" aria-label="Next offer" className={STEP}>
          <ChevronRight aria-hidden className="size-5" />
        </button>
      </div>
    </>
  );
}

/** The slider on pages the script draws itself: the home page and /offers. */
export function OfferSlider({ priority = false }: { priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? startOfferSlider(ref.current) : undefined), []);
  return (
    <div ref={ref} data-offer-slider data-gallery aria-roledescription="carousel" aria-label="November offers">
      <OfferSlides priority={priority} />
    </div>
  );
}
