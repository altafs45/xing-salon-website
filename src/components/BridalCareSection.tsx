import { ArrowRight } from 'lucide-react';
import { bridalCare } from '../data/content';
import { cn } from '../lib/cn';
import { currentPage, hasPage, serviceHref } from '../lib/route';
import { whatsappLink } from '../lib/whatsapp';
import { ICONS } from './service/icons';
import { SectionHeader } from './service/SectionHeader';
import { ProcessStepper } from './service/Sections';
import { Button } from './ui/Button';
import { WhatsAppIcon } from './ui/Decor';
import { Reveal } from './ui/Primitives';
import { SnapRow } from './ui/SnapRow';

type CardId = (typeof bridalCare.cards)[number]['id'];

interface BridalCareSectionProps {
  /** Three cards and no timeline, for service pages. */
  compact?: boolean;
  /** Which cards to show (all by default), e.g. to leave out the page you are on. */
  cards?: CardId[];
}

/**
 * Bridal hair care and pre-wedding salon services: cards that link to each service page, a suggested
 * timeline and one WhatsApp CTA. Content only; the caller wraps it in its own section.
 */
export function BridalCareSection({ compact = false, cards }: BridalCareSectionProps) {
  // Never link a page to itself, e.g. the Bridal Hair Styling card on the Women's page.
  const shown = bridalCare.cards.filter(
    (card) => (cards ? cards.includes(card.id) : true) && hasPage(card.slug) && card.slug !== currentPage?.slug,
  );

  return (
    <>
      <SectionHeader eyebrow={bridalCare.eyebrow} title={bridalCare.title} text={compact ? undefined : bridalCare.text} />
      <div className="mt-10">
        <SnapRow className={cn('md:grid-cols-3 md:gap-5')}>
          {shown.map((card, i) => {
            const Icon = ICONS[card.icon];
            return (
              <Reveal key={card.id} delay={i * 0.05} className="h-full">
                <a href={serviceHref(card.slug)} className="svc-card svc-card-hover group flex h-full flex-col p-5 sm:p-6">
                  <span className="grid size-12 place-items-center rounded-full bg-blush text-berry">
                    <Icon aria-hidden className="size-6" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-4 font-display text-xl font-medium text-ink">{card.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{card.text}</p>
                  <span className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-berry">
                    Explore
                    <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-1.5 motion-reduce:transition-none" />
                  </span>
                </a>
              </Reveal>
            );
          })}
        </SnapRow>
      </div>

      {!compact && (
        <div className="mt-14">
          <h3 className="font-display text-2xl font-medium text-ink">{bridalCare.timelineTitle}</h3>
          <ProcessStepper steps={bridalCare.timeline} />
        </div>
      )}

      <Reveal className="mt-10">
        <Button href={whatsappLink(bridalCare.whatsappText)} external arrow={false} className="w-full sm:w-auto">
          <WhatsAppIcon className="size-4" />
          {bridalCare.cta}
        </Button>
      </Reveal>
    </>
  );
}
