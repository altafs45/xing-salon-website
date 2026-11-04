import { Section, SectionHeader } from '../service/SectionHeader';

/** Questions in plain <details>, so they work on pages that are written out at build time. */
export function StaticFaq({ title, items }: { title: string; items: Array<{ q: string; a: string }> }) {
  return (
    <Section tone="tint" id="faq">
      <SectionHeader eyebrow="FAQs" title={title} />
      <div className="mt-6 max-w-3xl divide-y divide-ink/10">
        {items.map((item) => (
          <details key={item.q} className="py-1">
            <summary className="flex min-h-11 cursor-pointer items-center text-sm font-medium text-ink">{item.q}</summary>
            <p className="pb-3 text-sm leading-relaxed text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
