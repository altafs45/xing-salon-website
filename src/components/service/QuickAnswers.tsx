import { serviceOfferText } from '../../data/offers';

interface QuickAnswersProps {
  faqs: ReadonlyArray<{ q: string; a: string }>;
  /** Service pages also answer what it costs. */
  slug?: string;
}

const MAX_WORDS = 30;
const QUESTIONS = 3;
const firstSentence = (answer: string) => answer.split(/(?<=[.?!])\s/)[0];

/** Three questions answered in a sentence each, from the page's own FAQ, for readers and answer engines. */
export function QuickAnswers({ faqs, slug }: QuickAnswersProps) {
  const items = faqs
    .map(({ q, a }) => ({ q, a: firstSentence(a) }))
    .filter(({ a }) => a.split(/\s+/).length <= MAX_WORDS)
    .slice(0, QUESTIONS);
  if (slug) {
    const offer = serviceOfferText(slug);
    items.push({ q: 'What does it cost?', a: `Your stylist confirms the price at consultation, before starting.${offer ? ` ${offer}.` : ''}` });
  }
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="quick-answers" className="border-b border-ink/10 bg-cream py-8">
      <div className="container-site">
        <h2 id="quick-answers" className="font-display text-2xl font-medium text-ink">
          Quick answers
        </h2>
        <dl className="mt-3 grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <div key={item.q}>
              <dt className="text-sm font-semibold text-ink">{item.q}</dt>
              <dd className="mt-0.5 text-sm leading-relaxed text-muted">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
