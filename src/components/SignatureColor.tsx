import { useEffect, useRef, useState } from 'react';
import { BadgePercent, Clock, Heart, RefreshCw, Star } from 'lucide-react';
import { useBooking } from '../context/booking';
import { hairColor, reviews, signatureColor, site } from '../data/content';
import { offers } from '../data/offers';
import { cn } from '../lib/cn';
import { serviceHref } from '../lib/route';
import { whatsappLink } from '../lib/whatsapp';
import { ICONS } from './service/icons';
import { SectionHeader } from './service/SectionHeader';
import { ProcessStepper } from './service/Sections';
import { Accordion } from './ui/Accordion';
import { ArrowLink, Button } from './ui/Button';
import { WhatsAppIcon } from './ui/Decor';
import { Picture, Reveal } from './ui/Primitives';
import { SnapRow } from './ui/SnapRow';

type ColorOption = (typeof hairColor.options)[number];

// The hair colour page's own prefilled message, so both places start the same conversation.
// Covers every colour service, so the client says which one; each colour page has its own, narrower message.
const WHATSAPP_HREF = whatsappLink('Hi, I’d like a hair colour consultation at Xing ___ (location). I’m looking for ___ (global/highlights/balayage/fashion colour)');
const OFFER = offers.colourOffer;
const SUBHEAD = 'font-display text-2xl font-medium text-ink';
// Phones show body text at 16px; the smaller size starts at tablet width.
const BUTTON_TEXT = 'max-md:!text-sm';

function ColorCard({ option }: { option: ColorOption }) {
  const booking = useBooking();
  const { labels } = signatureColor;
  const facts = [
    { Icon: Heart, label: labels.bestFor, value: option.idealFor },
    { Icon: Clock, label: labels.duration, value: option.duration },
    { Icon: RefreshCw, label: labels.maintenance, value: option.maintenance },
  ];

  return (
    <article className="svc-card flex h-full flex-col overflow-hidden">
      <Picture image={option.image} className="aspect-photo w-full object-cover" />
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-medium text-ink">{option.name}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{option.caption}</p>
        <dl className="mt-4 flex-1 space-y-3 border-t border-ink/10 pt-4">
          {facts.map(({ Icon, label, value }) => (
            // A term and its description, with the icon inside the term: a <dl> group may hold nothing else.
            <div key={label} className="relative pl-7">
              <dt className="text-sm font-medium md:text-xs uppercase tracking-wide text-muted">
                <Icon aria-hidden className="absolute left-0 top-0.5 size-4 text-berry" />
                {label}
              </dt>
              <dd className="text-sm text-ink">{value}</dd>
            </div>
          ))}
        </dl>
        <Button onClick={() => booking.open(option.bookAs)} className={cn('mt-5 w-full', BUTTON_TEXT)}>
          {labels.book}
          <span className="sr-only">: {option.name}</span>
        </Button>
      </div>
    </article>
  );
}

/**
 * Phones only: "Book Hair Color" and WhatsApp stay one tap away while the section is on screen. It sits over
 * the site-wide action bar for that stretch and slides away again afterwards.
 */
function StickyBookBar({ visible }: { visible: boolean }) {
  const booking = useBooking();

  return (
    <div
      role="group"
      aria-label={signatureColor.cta}
      // Removed from the tab order and from screen readers while it is off screen.
      {...(!visible && { inert: '' })}
      className={cn(
        'safe-bottom fixed inset-x-0 bottom-0 z-[31] border-t border-ink/10 bg-cream shadow-lift transition-transform duration-300 motion-reduce:transition-none md:hidden',
        !visible && 'translate-y-full',
      )}
    >
      <div className="flex h-action-bar items-center gap-3 px-4">
        <button
          type="button"
          onClick={() => booking.open(signatureColor.bookAs)}
          className="min-h-12 flex-1 rounded-full bg-berry px-4 text-sm font-medium text-cream active:bg-berrydark"
        >
          {signatureColor.cta}
        </button>
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={signatureColor.whatsappLabel}
          className="grid size-12 shrink-0 place-items-center rounded-full border border-berry text-berry active:bg-blush"
        >
          <WhatsAppIcon className="size-5" />
        </a>
      </div>
    </div>
  );
}

/** The landing page's featured service: why to colour at Xing, the four colour types, how it works and FAQs. */
export function SignatureColor() {
  const booking = useBooking();
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    // "In view" once the section reaches the middle of the screen, so the bar doesn't flash at its edges.
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '-45% 0px -45% 0px' });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // While this section's own booking bar is up, the floating Call and WhatsApp buttons step aside.
  useEffect(() => {
    if (inView) document.documentElement.dataset.bookbar = '';
    else delete document.documentElement.dataset.bookbar;
    return () => {
      delete document.documentElement.dataset.bookbar;
    };
  }, [inView]);

  return (
    <section ref={sectionRef} id="signature-hair-color" className="bg-blush py-section">
      <div className="container-site">
        <SectionHeader eyebrow={signatureColor.eyebrow} title={signatureColor.title} text={signatureColor.text} />

        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-10">
          <Reveal className="lg:col-span-7">
            <ul className="grid grid-cols-3 gap-3 sm:gap-4">
              {signatureColor.featured.map((item) => (
                <li key={item.image.src}>
                  <figure>
                    <Picture image={item.image} className="aspect-portrait w-full rounded-card object-cover shadow-soft" />
                    <figcaption className="mt-3 text-center text-xs font-medium text-ink">{item.caption}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="lg:col-span-5">
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              {signatureColor.benefits.map((benefit, i) => {
                const Icon = ICONS[benefit.icon];
                return (
                  <li key={benefit.title}>
                    <Reveal delay={i * 0.05} className="flex gap-4">
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-berry shadow-soft">
                        <Icon aria-hidden className="size-5" strokeWidth={1.5} />
                      </span>
                      <div>
                        <p className="text-base font-semibold text-ink">{benefit.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted">{benefit.text}</p>
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ul>

            <p className="mt-6 inline-flex items-center gap-2.5 rounded-2xl border border-gold sm:rounded-full bg-white px-4 py-2.5 text-sm text-ink">
              <BadgePercent aria-hidden className="size-5 shrink-0 text-berry" />
              <span>
                <strong className="font-semibold">{OFFER.deal.toUpperCase()}</strong> {signatureColor.offerSuffix}.{' '}
                <a href={OFFER.details} className="inline-flex min-h-11 items-center font-medium text-berry underline underline-offset-4 md:min-h-0">
                  See the offer
                </a>
              </span>
            </p>
          </div>
        </div>

        <div className="mt-14">
          <p className={SUBHEAD}>{signatureColor.cardsTitle}</p>
          <div className="mt-6">
            {/* Phones: the colour cards slide on by themselves until the visitor swipes them. */}
            <SnapRow autoPlayMs={4500} className="md:grid-cols-2 md:gap-5 lg:grid-cols-4">
              {hairColor.options.map((option, i) => (
                <Reveal key={option.name} delay={i * 0.05} className="h-full">
                  <ColorCard option={option} />
                </Reveal>
              ))}
            </SnapRow>
          </div>

          <Reveal className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button onClick={() => booking.open(signatureColor.bookAs)} className={cn('w-full sm:w-auto', BUTTON_TEXT)}>
              {signatureColor.cta}
            </Button>
            <Button variant="outline" href={WHATSAPP_HREF} external arrow={false} className={cn('w-full sm:w-auto', BUTTON_TEXT)}>
              <WhatsAppIcon className="size-4" />
              {signatureColor.whatsappCta}
            </Button>
          </Reveal>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {signatureColor.areas}{' '}
            <a
              href={signatureColor.areasLink.href}
              className="inline-flex min-h-11 items-center font-medium text-berry underline underline-offset-4 md:min-h-0"
            >
              {signatureColor.areasLink.label}
            </a>
          </p>
        </div>

        <div className="mt-14">
          <p className={SUBHEAD}>{signatureColor.stepsTitle}</p>
          <ProcessStepper steps={signatureColor.steps} />
        </div>

        <Reveal className="svc-card mt-14 grid gap-6 p-5 sm:p-7 md:grid-cols-12 md:items-center md:gap-8">
          <div className="md:col-span-5">
            <p className="text-base font-semibold text-ink">{signatureColor.trustTitle}</p>
            <div className="mt-4 flex items-center gap-4">
              <span className="font-display text-5xl font-medium lining-nums text-ink">{site.rating}</span>
              <div>
                <span aria-hidden className="flex gap-0.5 text-gold">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="size-5 fill-current" />
                  ))}
                </span>
                <p className="mt-1 text-sm text-muted">{reviews.ratingLabel}</p>
              </div>
            </div>
          </div>
          <figure className="border-t border-ink/10 pt-6 md:col-span-7 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <blockquote className="font-display text-xl leading-snug text-ink">“{signatureColor.review.quote}”</blockquote>
            <figcaption className="mt-3 text-sm text-muted">
              <span className="font-semibold text-ink">{signatureColor.review.name}</span> · {reviews.source}
            </figcaption>
          </figure>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <p className={SUBHEAD}>{signatureColor.faqTitle}</p>
            <p className="mt-6 text-sm font-semibold text-ink">{signatureColor.linksTitle}</p>
            <ul className="mt-1">
              {signatureColor.links.map((link) => (
                <li key={link.label}>
                  <ArrowLink href={link.href} className="py-1.5 text-left">
                    {link.label}
                  </ArrowLink>
                </li>
              ))}
              <li>
                <ArrowLink href={serviceHref(signatureColor.pageLink.slug)} className="py-1.5 text-left">
                  {signatureColor.pageLink.label}
                </ArrowLink>
              </li>
            </ul>
          </div>
          <Reveal className="svc-card px-5 sm:px-7 lg:col-span-8">
            <Accordion items={signatureColor.faqs} idPrefix="color-faq" />
          </Reveal>
        </div>

        <p className="mt-10 border-t border-berry/15 pt-4">
          <ArrowLink href={signatureColor.bridalLink.href}>{signatureColor.bridalLink.label}</ArrowLink>
        </p>
      </div>

      <StickyBookBar visible={inView} />
    </section>
  );
}
