import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Building2,
  Cake,
  Check,
  Flame,
  Flower2,
  Gem,
  Gift,
  Heart,
  Moon,
  Palette,
  PartyPopper,
  Smile,
  Sparkles,
  Sun,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { gmPage, giftFilters, isoDay, occasions, seasonWindow, shortDate, type GiftCategory, type Occasion, type OccasionIcon } from '../../data/giftMembership';
import { track } from '../../lib/analytics';
import { cn } from '../../lib/cn';
import { GiftCardPreview } from './GiftCardPreview';
import { FadeIn, Heading, Proof, PRIMARY, useOpenLeadForm } from './shared';

const ICONS: Record<OccasionIcon, LucideIcon> = {
  cake: Cake,
  heart: Heart,
  gem: Gem,
  flower: Flower2,
  users: Users,
  lamp: Flame,
  building: Building2,
  smile: Smile,
  sparkles: Sparkles,
  gift: Gift,
  sun: Sun,
  moon: Moon,
  palette: Palette,
  party: PartyPopper,
};

const CARD_SIZES = '(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw';

/** Today's date, or `?today=YYYY-MM-DD` to check how the page looks in another season. */
function currentDay() {
  const mocked = new URLSearchParams(window.location.search).get('today');
  return mocked && /^\d{4}-\d{2}-\d{2}$/.test(mocked) ? mocked : isoDay(new Date());
}

/** The 16:9 top of a card: its photo, or the occasion's colours and icon when it has none. */
function CardArt({ occasion, season }: { occasion: Occasion; season: boolean }) {
  const Icon = ICONS[occasion.icon];
  const dark = occasion.theme.text === 'light';
  return (
    <div className="relative aspect-video overflow-hidden" style={{ backgroundImage: `linear-gradient(135deg, ${occasion.theme.from}, ${occasion.theme.to})` }}>
      {occasion.image ? (
        <img
          src={occasion.image.src}
          srcSet={occasion.image.srcSet}
          sizes={CARD_SIZES}
          alt={occasion.image.alt}
          width={occasion.image.width}
          height={occasion.image.height}
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
        />
      ) : (
        <div aria-hidden className="grid size-full place-items-center">
          <span className={cn('grid size-20 place-items-center rounded-full', dark ? 'bg-cream/15 text-gold' : 'bg-white/60 text-berry')}>
            <Icon className="size-10" strokeWidth={1.5} />
          </span>
        </div>
      )}
      {season && (
        <p className="absolute left-3 top-3 inline-flex min-h-7 items-center gap-1 rounded-full bg-ink/85 px-3 text-xs font-semibold uppercase tracking-wide text-cream">
          <Sparkles aria-hidden className="size-3.5 text-gold" />
          {gmPage.gifts.season}
        </p>
      )}
    </div>
  );
}

function FeatureCard({ occasion, season, onGift }: { occasion: Occasion; season: boolean; onGift: (occasion: Occasion) => void }) {
  const value = occasion.slug === 'value';
  return (
    <FadeIn as="li" className={cn('flex flex-col overflow-hidden rounded-3xl border shadow-soft', value ? 'border-berry/20 bg-cream' : 'border-berry/10 bg-white')}>
      <CardArt occasion={occasion} season={season} />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-berry">{occasion.kind === 'value' ? 'Value Card' : 'Experience Card'}</p>
        <h3 className="mt-2 text-balance font-display text-2xl font-medium leading-tight text-ink">{occasion.heading}</h3>
        {occasion.title !== occasion.heading && <p className="mt-1 text-base font-semibold text-ink">{occasion.title}</p>}
        <p className="mt-2 text-base text-muted">{occasion.hook}</p>
        {occasion.includes.length > 0 && (
          <ul className="mt-4 space-y-1.5">
            {occasion.includes.map((entry) => (
              <li key={entry} className="flex items-start gap-2 text-base text-ink">
                <Check aria-hidden className="mt-1 size-4 shrink-0 text-berry" />
                {entry}
              </li>
            ))}
          </ul>
        )}
        {occasion.perk && (
          <p className="mt-4 flex items-start gap-2 rounded-2xl bg-blush px-3 py-2.5 text-sm font-medium text-berry">
            <Gift aria-hidden className="mt-0.5 size-4 shrink-0" />
            <span className="line-clamp-4">{occasion.perk}</span>
          </p>
        )}
        {occasion.note && <p className="mt-3 text-sm text-muted">{occasion.note}</p>}
        {occasion.endsAt && <p className="mt-3 text-sm font-medium text-ink">Offer ends {shortDate(occasion.endsAt)}</p>}
        <div className="mt-auto pt-5">
          <button type="button" onClick={() => onGift(occasion)} className={cn(PRIMARY, 'w-full')}>
            {occasion.corporate ? gmPage.gifts.corporateCta : gmPage.gifts.cta}
            <ArrowRight aria-hidden className="size-4" />
          </button>
          {occasion.link && (
            <a href={occasion.link.href} className="mt-2 flex min-h-11 items-center justify-center gap-1 text-sm font-medium text-berry underline underline-offset-4">
              {occasion.link.label}
            </a>
          )}
        </div>
      </div>
    </FadeIn>
  );
}

/** A festival out of season, under "Festivals": a small card in a two-column grid. */
function MiniCard({ occasion, onGift }: { occasion: Occasion; onGift: (occasion: Occasion) => void }) {
  const Icon = ICONS[occasion.icon];
  const dark = occasion.theme.text === 'light';
  return (
    <li className="max-sm:w-[82%] max-sm:shrink-0 max-sm:snap-start flex flex-col overflow-hidden rounded-3xl border border-berry/10 bg-white shadow-soft">
      <div aria-hidden className="grid h-16 place-items-center" style={{ backgroundImage: `linear-gradient(135deg, ${occasion.theme.from}, ${occasion.theme.to})` }}>
        <Icon className={cn('size-7', dark ? 'text-gold' : 'text-berry')} strokeWidth={1.5} />
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="text-balance text-base font-semibold leading-snug text-ink">{occasion.heading}</h3>
        <p className="mt-1 text-sm text-muted">{occasion.title}</p>
        <div className="mt-auto pt-3">
          <button type="button" onClick={() => onGift(occasion)} className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-berry text-sm font-semibold text-berry transition-colors hover:bg-berry hover:text-cream">
            {gmPage.gifts.cta}
          </button>
        </div>
      </div>
    </li>
  );
}

/** A row of chips that scrolls sideways inside its own box, fading at an edge only when there is more that way. */
function FilterChips({ value, onChange }: { value: string; onChange: (key: 'all' | GiftCategory) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: false, end: false });
  useEffect(() => {
    const el = ref.current!;
    const update = () => setEdges({ start: el.scrollLeft > 2, end: el.scrollLeft + el.clientWidth < el.scrollWidth - 2 });
    update();
    el.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, []);
  const mask = `linear-gradient(to right, ${edges.start ? 'transparent' : 'black'}, black 24px, black calc(100% - 24px), ${edges.end ? 'transparent' : 'black'})`;
  return (
    <div ref={ref} role="group" aria-label="Filter gift cards" className="no-scrollbar mt-8 flex gap-2 overflow-x-auto py-1" style={{ maskImage: mask, WebkitMaskImage: mask }}>
      {giftFilters.map((filter) => (
        <button
          key={filter.key}
          type="button"
          aria-pressed={value === filter.key}
          onClick={() => onChange(filter.key)}
          className={cn(
            'inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-base font-medium transition-colors duration-150 motion-reduce:transition-none md:text-sm',
            value === filter.key ? 'border-berry bg-berry text-cream' : 'border-ink/15 bg-white text-ink hover:border-berry',
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

/** Occasion gift cards: filters, the cards in season pinned first, and a live-preview teaser. */
export function OccasionGrid() {
  const open = useOpenLeadForm();
  const [filter, setFilter] = useState<'all' | GiftCategory>('all');
  const today = useMemo(currentDay, []);
  const { gifts } = gmPage;

  const { pinned, rest, minis } = useMemo(() => {
    const matches = (occasion: Occasion) => filter === 'all' || occasion.categories.includes(filter);
    const inSeason = occasions
      .map((occasion) => ({ occasion, window: seasonWindow(occasion, today) }))
      .filter((entry) => entry.window && matches(entry.occasion))
      .sort((a, b) => a.window!.start.localeCompare(b.window!.start))
      .map((entry) => entry.occasion);
    const value = occasions.find((occasion) => occasion.slug === 'value')!;
    return {
      pinned: inSeason,
      // Feature cards always show; the value card is always last.
      rest: occasions.filter((occasion) => occasion.size === 'feature' && occasion !== value && !inSeason.includes(occasion) && matches(occasion)).concat(matches(value) ? [value] : []),
      // Festivals out of season show only under "Festivals".
      minis: filter === 'festivals' ? occasions.filter((occasion) => occasion.size === 'mini' && !inSeason.includes(occasion)) : [],
    };
  }, [filter, today]);

  const gift = (occasion: Occasion) => {
    track('gm_occasion_cta', { slug: occasion.slug });
    open({ type: occasion.corporate ? 'corporate' : 'gift', product: occasion.slug });
  };

  const teaser = occasions[0];

  return (
    <section id="gift-cards" aria-labelledby="gift-cards-title" className="scroll-mt-4 bg-cream py-14 lg:py-24">
      <div className="container-site">
        <Heading id="gift-cards-title" eyebrow={gifts.eyebrow} title={gifts.title} sub={gifts.sub} />
        <FilterChips value={filter} onChange={(key) => setFilter(key)} />
        <p className="mt-4 text-base text-muted">{gifts.kinds}</p>

        <ul data-swipe className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-sm:no-scrollbar max-sm:-mx-4 max-sm:flex max-sm:snap-x max-sm:snap-mandatory max-sm:gap-4 max-sm:overflow-x-auto max-sm:scroll-px-4 max-sm:px-4 max-sm:pb-2">
          {pinned.map((occasion) => (
            <FeatureCard key={occasion.slug} occasion={occasion} season onGift={gift} />
          ))}
          {rest.map((occasion) => (
            <FeatureCard key={occasion.slug} occasion={occasion} season={false} onGift={gift} />
          ))}
        </ul>

        {minis.length > 0 && (
          <>
            <h3 className="mt-10 font-display text-2xl font-medium text-ink">More festival gift cards</h3>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {minis.map((occasion) => (
                <MiniCard key={occasion.slug} occasion={occasion} onGift={gift} />
              ))}
            </ul>
          </>
        )}

        {/* What the recipient receives, with a sample name and message. */}
        <FadeIn className="mt-12 grid items-center gap-8 rounded-3xl bg-blush p-5 sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-12">
          <div className="mx-auto w-full max-w-md">
            <GiftCardPreview theme={teaser.theme} label={teaser.cardLabel} recipient={gifts.teaser.recipient} message={gifts.teaser.message} sender={gifts.teaser.sender} />
          </div>
          <div className="text-center lg:text-left">
            <h3 className="font-display text-3xl font-medium text-ink">Personalised, the moment you type</h3>
            <p className="mt-3 text-base text-muted">Add their name and your message, and watch the card come to life. We deliver it on WhatsApp or email on the day you choose, or as a printed card at the salon.</p>
            <button type="button" onClick={() => gift(teaser)} className={cn(PRIMARY, 'mt-6 w-full sm:w-auto')}>
              {gifts.cta}
              <ArrowRight aria-hidden className="size-4" />
            </button>
            <Proof className="mt-3 lg:justify-start" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
