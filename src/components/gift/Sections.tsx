// The quieter sections of the gift cards & membership page: how it works, reviews, FAQ, the closing call to
// action, the terms and the optional how-to video.
import { ArrowRight, ClipboardList, MapPin, MessageCircle, Quote, Star, WalletCards } from 'lucide-react';
import { reviews } from '../../data/content';
import { defaultTier, faqs, gmPage, howToVideo, nearYou, salons, terms, testimonials } from '../../data/giftMembership';
import { servicesHubPath } from '../../data/services';
import { offersPath } from '../../data/offers';
import { cn } from '../../lib/cn';
import { whatsappLink } from '../../lib/whatsapp';
import { WhatsAppIcon } from '../ui/Decor';
import { FadeIn, Heading, ON_DARK, Proof, QAList, scrollToId, useOpenLeadForm } from './shared';

const STEP_ICONS = [ClipboardList, MessageCircle, WalletCards];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-title" className="bg-cream py-14 lg:py-24">
      <div className="container-site">
        <Heading id="how-title" title={gmPage.how.title} />
        {/* Phones: a vertical stepper joined by a line. Larger screens: three columns. */}
        <ol className="mx-auto mt-8 max-w-md md:mt-10 md:grid md:max-w-5xl md:grid-cols-3 md:gap-8">
          {gmPage.how.steps.map((step, i) => {
            const Icon = STEP_ICONS[i];
            const last = i === gmPage.how.steps.length - 1;
            return (
              <FadeIn as="li" key={step} className="relative flex gap-4 pb-8 last:pb-0 md:flex-col md:items-center md:pb-0 md:text-center">
                {!last && <span aria-hidden className="absolute bottom-0 left-6 top-12 w-px bg-berry/25 md:hidden" />}
                <span className="relative grid size-12 shrink-0 place-items-center rounded-full bg-berry text-cream shadow-lift">
                  <Icon aria-hidden className="size-6" />
                </span>
                <div className="pt-1.5 md:pt-0">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-berry">Step {i + 1}</p>
                  <p className="mt-1 text-lg font-medium text-ink">{step}</p>
                </div>
              </FadeIn>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export function Testimonials() {
  // Real reviews only: the gifting/membership ones once the owner adds them, the salon's published reviews until then.
  const items = (testimonials.length ? testimonials : reviews.items).slice(0, 3);
  return (
    <section aria-labelledby="proof-title" className="bg-blush py-14 lg:py-24">
      <div className="container-site">
        <Heading id="proof-title" title={gmPage.proof.title} />
        <div className="mx-auto mt-5 flex w-fit items-center gap-3 rounded-full bg-white px-5 py-2.5 shadow-soft">
          <span className="font-display text-3xl font-semibold lining-nums text-ink">{reviews.rating}</span>
          <span aria-hidden className="flex text-golddeep">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className="size-4 fill-current" />
            ))}
          </span>
          <span className="text-sm text-muted">{reviews.ratingLabel}</span>
        </div>
        <ul className="mt-8 grid gap-4 md:grid-cols-3 md:gap-6">
          {items.map((item) => (
            <FadeIn as="li" key={item.name} className="flex flex-col rounded-3xl border border-berry/10 bg-white p-5 shadow-soft sm:p-7">
              <Quote aria-hidden className="size-7 text-berry/40" />
              <blockquote className="mt-3 flex-1 text-base leading-relaxed text-ink">{item.quote}</blockquote>
              <p className="mt-4 text-base font-semibold text-ink">{item.name}</p>
              <p className="text-sm text-muted">{reviews.source}</p>
            </FadeIn>
          ))}
        </ul>
      </div>
    </section>
  );
}

const MORE_LINKS = [
  { label: 'All salon services', href: servicesHubPath },
  { label: 'Bridal hair & styling', href: '/services/womens-haircut-styling#bridal' },
  { label: 'Current offers', href: offersPath },
  { label: 'Pre-wedding salon timeline', href: '/blog/pre-wedding-salon-timeline' },
  { label: 'Hair spa benefits', href: '/blog/hair-spa-benefits' },
  { label: 'Hydra facial benefits', href: '/blog/hydra-facial-benefits' },
];

export function FaqSection() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-4 bg-cream py-14 lg:py-24">
      <div className="container-site max-w-3xl">
        <Heading id="faq-title" title={gmPage.faqTitle} />
        <div className="mt-8 rounded-3xl border border-berry/10 bg-white px-5 shadow-soft sm:px-7">
          <QAList items={faqs} idPrefix="gm-faq" answerClass="faq-answer" />
        </div>
        <nav aria-label="More from Xing" className="mt-8">
          <p className="text-sm font-semibold text-ink">More from Xing</p>
          <ul className="mt-2 flex flex-wrap gap-x-5">
            {MORE_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="inline-flex min-h-11 items-center gap-1 text-base text-berry underline underline-offset-4 hover:text-berrydark md:text-sm">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}

export function FinalCta() {
  const open = useOpenLeadForm();
  const { cta } = gmPage;
  return (
    <section aria-labelledby="final-title" className="on-dark bg-gradient-to-br from-berrydark via-berry to-berrydark py-14 text-cream lg:py-20">
      <div className="container-site flex flex-col items-center text-center">
        <h2 id="final-title" className="heading text-balance">
          {cta.title}
        </h2>
        <p className="mt-3 max-w-xl text-base text-cream/90">{cta.sub}</p>
        <div className="mt-7 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <button type="button" onClick={() => scrollToId('gift-cards')} className={cn(ON_DARK, 'w-full sm:w-auto')}>
            {cta.gift}
          </button>
          <button
            type="button"
            onClick={() => open({ type: 'membership', product: defaultTier.key })}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gold px-6 text-base font-semibold text-ink transition duration-200 hover:brightness-105 active:scale-95 motion-reduce:transition-none sm:w-auto md:text-sm"
          >
            {cta.member}
            <ArrowRight aria-hidden className="size-4" />
          </button>
          <a href={whatsappLink(gmPage.whatsappText)} target="_blank" rel="noopener noreferrer" data-cta="gm_final" className={cn(ON_DARK, 'w-full sm:w-auto')}>
            <WhatsAppIcon className="size-5" />
            {cta.whatsapp}
          </a>
        </div>
        <Proof tone="dark" className="mt-4" />

        <div className="mt-10 w-full max-w-3xl border-t border-cream/20 pt-8">
          <ul className="flex flex-wrap justify-center gap-2">
            {salons.map((salon) => (
              <li key={salon.key}>
                <a href={salon.pagePath} className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-cream/40 px-4 text-base text-cream hover:bg-cream/10 md:text-sm">
                  <MapPin aria-hidden className="size-4 text-gold" />
                  Xing {salon.name}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-cream/85">
            <span className="font-semibold text-cream">Near you: </span>
            {nearYou}
          </p>
        </div>
      </div>
    </section>
  );
}

export function Terms() {
  return (
    <section id="terms" aria-labelledby="terms-title" className="scroll-mt-4 bg-cream py-12 lg:py-16">
      <div className="container-site max-w-3xl">
        <h2 id="terms-title" className="font-display text-2xl font-medium text-ink">
          Gift Card & Membership Terms
        </h2>
        <div className="mt-4 rounded-3xl border border-berry/10 bg-white px-5 sm:px-7">
          <QAList items={terms} idPrefix="gm-terms" defaultOpen={null} />
        </div>
      </div>
    </section>
  );
}

/** "How to gift a Xing card": shown only once the owner has added the video and set `howToVideo.enabled`. */
export function VideoSlot() {
  if (!howToVideo.enabled) return null;
  return (
    <section aria-labelledby="video-title" className="bg-cream py-14">
      <div className="container-site max-w-md text-center">
        <h2 id="video-title" className="heading text-ink">
          {howToVideo.name}
        </h2>
        <video controls playsInline preload="none" poster={howToVideo.poster} width={360} height={640} className="mx-auto mt-6 aspect-[9/16] w-full max-w-xs rounded-3xl bg-ink object-cover">
          <source src={howToVideo.src} type="video/mp4" />
          <track kind="captions" src={howToVideo.captions} srcLang="en" label="English" default />
        </video>
        <details className="mt-4 text-left">
          <summary className="flex min-h-11 cursor-pointer items-center text-base font-medium text-berry">Read the transcript</summary>
          <p className="text-base text-muted">{howToVideo.transcript}</p>
        </details>
      </div>
    </section>
  );
}
