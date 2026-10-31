import { ArrowRight, Check, Gift, Sparkles, X } from 'lucide-react';
import { defaultTier, gmPage } from '../../data/giftMembership';
import { track } from '../../lib/analytics';
import { cn } from '../../lib/cn';
import type { Choice } from './QuickChooser';
import { FadeIn, Heading, Proof, PRIMARY, scrollToId, SECONDARY, useOpenLeadForm } from './shared';

const { compare } = gmPage;

/** A ✓, a ✗ or a short phrase, with the yes/no spelled out for screen readers. */
function Cell({ value }: { value: string | boolean }) {
  if (typeof value === 'string') return <>{value}</>;
  return value ? (
    <>
      <Check aria-hidden className="inline size-5 text-success" />
      <span className="sr-only">Yes</span>
    </>
  ) : (
    <>
      <X aria-hidden className="inline size-5 text-muted" />
      <span className="sr-only">No</span>
    </>
  );
}

/** Gift card or membership, in five seconds: a decision line, then six rows. Highlights the visitor's pick. */
export function Comparison({ recommended }: { recommended: Choice }) {
  const open = useOpenLeadForm();
  const giftFirst = recommended === 'gift';

  const sendGift = () => {
    track('gm_compare_cta', { target: 'gift' });
    scrollToId('gift-cards');
  };
  const getGold = () => {
    track('gm_compare_cta', { target: 'membership' });
    open({ type: 'membership', product: defaultTier.key });
  };

  const columns = [
    { key: 'gift' as const, name: 'Gift Card', Icon: Gift, pick: (row: (typeof compare.rows)[number]) => row.gift },
    { key: 'membership' as const, name: 'Membership', Icon: Sparkles, pick: (row: (typeof compare.rows)[number]) => row.member },
  ];
  const cards = giftFirst ? columns : [...columns].reverse();

  return (
    <section id="compare" aria-labelledby="compare-title" className="scroll-mt-4 bg-blush py-14 lg:py-24">
      <div className="container-site">
        <Heading id="compare-title" title={compare.title} />

        {/* The decision line: two halves. */}
        <div className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-2 sm:gap-5">
          {[
            { key: 'gift', ...compare.left, note: undefined },
            { key: 'membership', ...compare.right },
          ].map((half) => (
            <div key={half.key} className={cn('rounded-3xl p-5 text-center sm:p-7', recommended === half.key ? 'bg-berry text-cream shadow-lift' : 'bg-white text-ink shadow-soft')}>
              <p className={cn('text-base', recommended === half.key ? 'text-cream/90' : 'text-muted')}>{half.q}</p>
              <p className="mt-1 font-display text-4xl font-semibold">
                {half.a}
                {half.note && <span className="ml-2 align-middle font-sans text-sm font-medium">({half.note})</span>}
              </p>
            </div>
          ))}
        </div>

        {/* Phones: two stacked cards, the visitor's pick first. */}
        <ul className="mx-auto mt-8 grid max-w-md gap-4 md:hidden">
          {cards.map(({ key, name, Icon, pick }) => {
            const picked = recommended === key;
            return (
              <FadeIn as="li" key={key} className={cn('rounded-3xl bg-white p-5 shadow-soft', picked ? 'border-2 border-berry' : 'border border-berry/10')}>
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                  <h3 className="flex items-center gap-2 font-display text-2xl font-medium text-ink">
                    <Icon aria-hidden className="size-5 text-berry" />
                    {name}
                  </h3>
                  {picked && <p className="inline-flex min-h-7 shrink-0 items-center rounded-full bg-blush px-3 text-xs font-semibold text-berry">{compare.tag}</p>}
                </div>
                <dl className="mt-4 divide-y divide-ink/10">
                  {compare.rows.map((row) => (
                    <div key={row.label} className="flex items-start justify-between gap-4 py-2.5 text-base">
                      <dt className="text-muted">{row.label}</dt>
                      <dd className="text-right font-medium text-ink">
                        <Cell value={pick(row)} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </FadeIn>
            );
          })}
        </ul>

        {/* Larger screens: one compact table. */}
        <FadeIn className="mx-auto mt-10 hidden max-w-4xl overflow-hidden rounded-3xl bg-white shadow-soft md:block">
          <table className="w-full table-fixed text-left text-base">
            <caption className="sr-only">Gift card and membership compared</caption>
            <thead>
              <tr>
                <td className="w-1/3 px-6 py-4" />
                {columns.map(({ key, name, Icon }) => (
                  <th key={key} scope="col" className={cn('px-6 py-4 align-bottom', recommended === key && 'bg-berry/10')}>
                    {recommended === key && <span className="mb-2 inline-flex min-h-7 items-center rounded-full bg-berry px-3 text-xs font-semibold text-cream">{compare.tag}</span>}
                    <span className="flex items-center gap-2 font-display text-2xl font-medium text-ink">
                      <Icon aria-hidden className="size-5 text-berry" />
                      {name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {compare.rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row" className="px-6 py-3.5 font-medium text-muted">
                    {row.label}
                  </th>
                  {columns.map(({ key, pick }) => (
                    <td key={key} className={cn('px-6 py-3.5 text-ink', recommended === key && 'bg-berry/10 font-medium')}>
                      <Cell value={pick(row)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </FadeIn>

        <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <button type="button" onClick={sendGift} className={cn(giftFirst ? PRIMARY : SECONDARY, 'w-full sm:w-auto', !giftFirst && 'bg-white')}>
            {compare.giftCta}
          </button>
          <button type="button" onClick={getGold} className={cn(giftFirst ? SECONDARY : PRIMARY, 'w-full sm:w-auto', giftFirst && 'bg-white')}>
            {compare.memberCta}
            <ArrowRight aria-hidden className="size-4" />
          </button>
        </div>
        <Proof className="mt-3" />
      </div>
    </section>
  );
}
