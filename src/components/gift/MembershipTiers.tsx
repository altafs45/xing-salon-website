import { useEffect, useRef, useState, type TouchEvent } from 'react';
import { ArrowRight, Check, Clock, ShieldCheck } from 'lucide-react';
import { defaultTier, gmPage, tiers, type Tier } from '../../data/giftMembership';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { onTabKeyDown } from '../../lib/a11y';
import { track } from '../../lib/analytics';
import { cn } from '../../lib/cn';
import { FadeIn, Heading, Proof, PRIMARY, useOpenLeadForm } from './shared';

/** Glow is rose, Gold soft gold and raised, Privé deep plum with gold text. */
const LOOKS = {
  rose: {
    card: 'border border-[#F2B8C6] bg-white text-ink',
    badge: 'bg-blush text-berry',
    accent: 'text-berry',
    muted: 'text-muted',
    check: 'text-berry',
    cta: 'border border-berry text-berry hover:bg-berry hover:text-cream',
  },
  gold: {
    card: 'border-2 border-[#C9A04A] bg-gradient-to-b from-[#FFF4D9] via-white to-white text-ink shadow-lift lg:z-10 lg:scale-[1.04]',
    badge: 'bg-gradient-to-r from-[#F3D48A] to-[#D2A445] text-ink',
    accent: 'text-golddeep',
    muted: 'text-muted',
    check: 'text-golddeep',
    cta: 'bg-berry text-cream hover:bg-berrydark',
  },
  plum: {
    card: 'border border-gold/40 bg-gradient-to-br from-plum to-[#160910] text-cream',
    badge: 'bg-gold/15 text-[#F3DFA2] ring-1 ring-gold/50',
    accent: 'text-[#F3DFA2]',
    muted: 'text-cream/80',
    check: 'text-gold',
    cta: 'border border-gold text-[#F3DFA2] hover:bg-gold hover:text-ink',
  },
} as const;

const SWIPE_PX = 50;

function TierCard({ tier, onChoose }: { tier: Tier; onChoose: (tier: Tier) => void }) {
  const look = LOOKS[tier.look];
  return (
    <article aria-labelledby={`tier-${tier.key}-name`} className={cn('flex h-full flex-col rounded-3xl p-5 transition-transform duration-200 sm:p-7', look.card)}>
      {/* In the flow, so it can never be clipped; an empty one keeps the three cards aligned. */}
      <p className={cn('inline-flex min-h-7 self-start items-center rounded-full px-3 text-xs font-semibold uppercase tracking-wide', tier.badge ? look.badge : 'invisible')}>
        {tier.badge ?? '—'}
      </p>
      <h3 id={`tier-${tier.key}-name`} className="mt-3 font-display text-3xl font-medium">
        {tier.name}
      </h3>
      <p className={cn('mt-4 font-display text-[4rem] font-semibold leading-none lining-nums', look.accent)}>
        +{tier.bonus}%
        <span className={cn('ml-2 align-middle font-sans text-base font-medium', look.muted)}>bonus value</span>
      </p>
      <p className="mt-3 text-base font-medium">
        Pay for 100%, enjoy {100 + tier.bonus}%
      </p>
      <p className={cn('mt-2 flex items-center gap-2 text-sm', look.muted)}>
        <Clock aria-hidden className="size-4 shrink-0" />
        Valid {tier.validityMonths} months
      </p>
      <ul className="mt-5 flex-1 space-y-2.5">
        {tier.perks.map((perk) => (
          <li key={perk} className="flex items-start gap-2.5 text-base">
            <Check aria-hidden className={cn('mt-1 size-5 shrink-0', look.check)} />
            {perk}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => onChoose(tier)}
        className={cn(
          'mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-4 text-base font-semibold transition duration-200 active:scale-95 motion-reduce:transition-none md:text-sm',
          look.cta,
        )}
      >
        {tier.cta}
        <ArrowRight aria-hidden className="size-4" />
      </button>
      <p className={cn('mt-3 text-center text-sm', look.muted)}>{gmPage.membership.microcopy}</p>
    </article>
  );
}

/** The three plans. Phones: a [Glow | Gold | Privé] switch over one card, Gold first. Desktop: three columns. */
export function MembershipTiers() {
  const open = useOpenLeadForm();
  const isWide = useMediaQuery('(min-width: 1024px)');
  const [active, setActive] = useState(tiers.indexOf(defaultTier));
  const touch = useRef<{ x: number; y: number } | null>(null);
  const viewed = useRef(new Set<string>());
  const { membership } = gmPage;

  const select = (index: number) => {
    setActive(index);
    track('gm_tier_view', { tier: tiers[index].key });
  };

  const choose = (tier: Tier) => {
    track('gm_tier_cta', { tier: tier.key });
    open({ type: 'membership', product: tier.key });
  };

  // Desktop shows all three: count each plan as viewed when it comes on screen.
  useEffect(() => {
    if (!isWide) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const key = (entry.target as HTMLElement).dataset.tier!;
        if (entry.isIntersecting && !viewed.current.has(key)) {
          viewed.current.add(key);
          track('gm_tier_view', { tier: key });
        }
      }
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-tier]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isWide]);

  const onTouchStart = (e: TouchEvent) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY });
  const onTouchEnd = (e: TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy)) return;
    select(Math.min(tiers.length - 1, Math.max(0, active + (dx < 0 ? 1 : -1))));
  };

  return (
    <section id="membership" aria-labelledby="membership-title" className="scroll-mt-4 bg-blush py-14 lg:py-24">
      <div className="container-site">
        <Heading id="membership-title" eyebrow={membership.eyebrow} title={membership.title} sub={membership.sub} />

        <p className="mx-auto mt-6 flex max-w-xl flex-wrap items-baseline justify-center gap-x-3 gap-y-1 text-center font-display text-3xl font-medium text-ink sm:text-4xl">
          <span>{membership.strip.from}</span>
          <ArrowRight aria-hidden className="size-6 self-center text-berry" />
          <span className="sr-only">becomes</span>
          <span className="text-berry">{membership.strip.to}</span>
        </p>

        {/* Phones and tablets: one plan at a time. */}
        <div role="tablist" aria-label="Membership plans" className="mx-auto mt-8 grid max-w-md grid-cols-3 rounded-full bg-white p-1 shadow-soft lg:hidden">
          {tiers.map((tier, i) => (
            <button
              key={tier.key}
              type="button"
              role="tab"
              id={`tier-tab-${tier.key}`}
              aria-selected={active === i}
              aria-controls={`tier-panel-${tier.key}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={(e) => onTabKeyDown(e, i, tiers.length, select)}
              className={cn(
                'min-h-11 rounded-full text-base font-semibold transition-colors duration-200 motion-reduce:transition-none',
                active === i ? 'bg-berry text-cream' : 'text-ink hover:text-berry',
              )}
            >
              {tier.short}
            </button>
          ))}
        </div>

        {/* All three cards share one grid cell on phones, so the area is always as tall as the tallest card and
            switching plans never moves the page. */}
        <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} className="mx-auto mt-5 grid max-w-md lg:mt-14 lg:max-w-none lg:grid-cols-3 lg:items-stretch lg:gap-6">
          {tiers.map((tier, i) => {
            const shown = isWide || active === i;
            return (
              <div
                key={tier.key}
                data-tier={tier.key}
                {...(!isWide && { role: 'tabpanel', id: `tier-panel-${tier.key}`, 'aria-labelledby': `tier-tab-${tier.key}` })}
                {...(!shown && ({ inert: '', 'aria-hidden': true } as object))}
                className={cn(
                  'col-start-1 row-start-1 transition duration-200 ease-out motion-reduce:transition-none lg:col-start-auto lg:row-start-auto',
                  !shown && 'invisible translate-y-2 opacity-0',
                )}
              >
                <TierCard tier={tier} onChoose={choose} />
              </div>
            );
          })}
        </div>

        <FadeIn className="mx-auto mt-10 max-w-2xl text-center">
          <p className="text-base text-ink">{membership.note}</p>
          <p className="mt-2 text-base font-medium text-berry">{membership.loss}</p>
          <ul className="mt-5 flex flex-wrap justify-center gap-2">
            {[membership.reciprocity, ...gmPage.risk].map((entry) => (
              <li key={entry} className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-white px-3 text-sm text-ink shadow-soft">
                <ShieldCheck aria-hidden className="size-4 text-success" />
                {entry}
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => choose(defaultTier)} className={cn(PRIMARY, 'mt-6 w-full sm:w-auto')}>
            {defaultTier.cta}
          </button>
          <Proof className="mt-3" />
        </FadeIn>
      </div>
    </section>
  );
}
