import { Accordion } from '../ui/Accordion';
import { faqPath } from '../../data/content';
import { ArrowLink, Button } from '../ui/Button';
import { WhatsAppIcon } from '../ui/Decor';
import { Reveal } from '../ui/Primitives';
import { SectionHeader } from './SectionHeader';

interface FAQAccordionProps {
  title: string;
  items: ReadonlyArray<{ q: string; a: string; href?: string; linkLabel?: string }>;
  askHref: string;
  /** Needed when a page has more than one accordion. */
  idPrefix?: string;
  /** Adds the link to /faq under the questions. */
  allLink?: boolean;
  /** Start with every answer closed. */
  closed?: boolean;
}

/** FAQ: heading and a WhatsApp prompt on the left, the accordion on the right. */
export function FAQAccordion({ title, items, askHref, idPrefix = 'faq', allLink = false, closed = false }: FAQAccordionProps) {
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <SectionHeader eyebrow="FAQs" title={title} className="lg:col-span-4">
        <p className="text-sm text-muted">Still have questions?</p>
        <Button variant="outline" href={askHref} external arrow={false} className="mt-3 w-full sm:w-auto">
          <WhatsAppIcon className="size-4" />
          Ask us on WhatsApp
        </Button>
      </SectionHeader>
      <Reveal className="svc-card px-5 sm:px-7 lg:col-span-8">
        <Accordion items={items} idPrefix={idPrefix} closed={closed} />
        {allLink && (
          <p className="py-3 text-right">
            <ArrowLink href={faqPath}>All FAQs</ArrowLink>
          </p>
        )}
      </Reveal>
    </div>
  );
}
