import { useMemo, useState } from 'react';
import { Phone, Search } from 'lucide-react';
import { FAQAccordion } from '../components/service/FAQAccordion';
import { Section } from '../components/service/SectionHeader';
import { CTABand } from '../components/service/Sections';
import { WhatsAppIcon } from '../components/ui/WhatsAppIcon';
import { Eyebrow } from '../components/ui/Primitives';
import { useBooking } from '../context/booking';
import { allFaqs, faqGroups, faqPage } from '../data/faqPage';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { cn } from '../lib/cn';
import { bookingWhatsappHref, PICK_CALL, whatsappLink } from '../lib/whatsapp';

const GROUPS = faqGroups();
const GROUP_IDS = GROUPS.map((group) => group.id);
const ASK_HREF = whatsappLink('Hi Xing ___ (location)! I have a question: ');

/** /faq: the site's questions in one place, by topic, with a search box. */
export default function FaqPage() {
  const booking = useBooking();
  const spied = useScrollSpy(GROUP_IDS);
  const [query, setQuery] = useState('');
  const term = query.trim().toLowerCase();

  const shown = useMemo(
    () =>
      GROUPS.map((group) => ({
        ...group,
        blocks: group.blocks
          .map((block) => ({ ...block, items: block.items.filter((item) => !term || `${item.q} ${item.a}`.toLowerCase().includes(term)) }))
          .filter((block) => block.items.length > 0),
      })).filter((group) => group.blocks.length > 0),
    [term],
  );
  const count = allFaqs(shown).length;

  return (
    <div data-cta="faq_page">
      <section className="bg-gradient-to-br from-blush via-cream to-mint pt-header-sm lg:pt-header">
        <div className="container-site pb-8 pt-6 lg:pb-12 lg:pt-10">
          <Eyebrow>{faqPage.hero.eyebrow}</Eyebrow>
          <h1 className="mt-2 text-balance font-display text-hero font-medium text-ink">{faqPage.hero.h1}</h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">{faqPage.hero.text}</p>
          <label className="relative mt-5 block max-w-xl">
            <span className="sr-only">{faqPage.hero.searchLabel}</span>
            <Search aria-hidden className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-berry" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={faqPage.hero.searchPlaceholder}
              className="min-h-12 w-full rounded-full border border-ink/15 bg-white pl-10 pr-4 text-base text-ink outline-none focus:border-berry"
            />
          </label>
          <p aria-live="polite" className="mt-2 min-h-5 text-sm text-muted">
            {term ? `${count} ${count === 1 ? 'question' : 'questions'} found` : ''}
          </p>
        </div>
      </section>

      <div className="under-header sticky z-20 border-b border-ink/10 bg-cream/95 backdrop-blur-md">
        <nav aria-label="FAQ topics" className="no-scrollbar container-site flex gap-1 overflow-x-auto py-1.5">
          {shown.map((group) => (
            <a
              key={group.id}
              href={`#${group.id}`}
              aria-current={spied === group.id ? 'true' : undefined}
              className={cn('inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors', spied === group.id ? 'bg-berry text-cream' : 'text-ink hover:text-berry')}
            >
              {group.label}
            </a>
          ))}
        </nav>
      </div>

      {shown.length === 0 && (
        <Section tone="white">
          <p className="text-center text-base text-muted">{faqPage.hero.noResults}</p>
        </Section>
      )}

      {shown.map((group, i) => (
        <Section key={group.id} tone={i % 2 ? 'tint' : 'white'} id={group.id} className="scroll-mt-16">
          <div className="space-y-12">
            {group.blocks.map((block) => (
              <FAQAccordion
                key={`${block.title}-${term}`}
                title={block.title}
                items={block.items.map((item) => ({ ...item, linkLabel: faqPage.moreLabel }))}
                askHref={ASK_HREF}
                idPrefix={`faq-${group.id}-${block.title.replace(/\W+/g, '-').toLowerCase()}`}
              />
            ))}
          </div>
        </Section>
      ))}

      <Section tone="white">
        <div className="svc-card flex flex-col items-center gap-4 p-6 text-center lg:p-10">
          <h2 className="heading text-ink">{faqPage.still.title}</h2>
          <p className="text-sm text-muted sm:text-base">{faqPage.still.text}</p>
          <div className="flex w-full flex-col justify-center gap-3 sm:flex-row">
            <a href={ASK_HREF} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-whatsapp px-6 text-sm font-semibold text-white hover:brightness-105">
              <WhatsAppIcon className="size-5" />
              {faqPage.still.whatsapp}
            </a>
            <a href={PICK_CALL} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-berry px-6 text-sm font-semibold text-berry hover:bg-berry hover:text-cream">
              <Phone aria-hidden className="size-4" />
              {faqPage.still.call}
            </a>
          </div>
        </div>
      </Section>

      <CTABand title={faqPage.cta.title} whatsappHref={bookingWhatsappHref} book={{ label: faqPage.cta.book, onClick: () => booking.open() }} />
    </div>
  );
}
