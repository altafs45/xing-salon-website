import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import { locations, salonById } from '../../data/branches';
import { campaignPill, isCampaignOpen } from '../../data/offers';
import { categoryById, formatPrice, fromPriceIn, maxSavingIn, offersIn, type OfferCategoryId } from '../../data/offerCatalog';
import { offerPagesShared } from '../../data/offerPages';
import { CTA } from '../../data/style';
import { track } from '../../lib/analytics';
import { clearBranch, setBranch, useBranch } from '../../lib/branch';
import { cn } from '../../lib/cn';
import { Picture } from '../ui/Primitives';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';

/** A row that scrolls sideways instead of wrapping, with a fade at the edge to show there is more. */
export const SIDEWAYS = 'no-scrollbar -mx-4 flex snap-x gap-2 overflow-x-auto scroll-px-4 whitespace-nowrap px-4 [mask-image:linear-gradient(to_right,#000_calc(100%-24px),transparent)] md:mx-0 md:px-0';

/**
 * All salons · Sarjapur Road · HSR Layout · Brookfield. The choice changes only where Claim, Call and WhatsApp go
 * and which salon the "Valid at" lines name. `?salon=hsr-layout` in the address preselects one (old offer links
 * use it); the choice is remembered like everywhere else on the site.
 */
export function SalonChips({ className }: { className?: string }) {
  const chosen = useBranch();
  useEffect(() => {
    const asked = new URLSearchParams(window.location.search).get('salon');
    if (asked && salonById(asked)) setBranch(asked);
  }, []);
  const chip = (on: boolean) =>
    cn('inline-flex min-h-11 shrink-0 snap-start items-center rounded-full border px-4 text-sm font-medium transition active:scale-[0.98]', on ? 'border-berry bg-berry text-cream' : 'border-ink/15 bg-white text-ink hover:border-berry hover:text-berry');
  return (
    <div role="radiogroup" aria-label={offerPagesShared.picker.label} className={cn(SIDEWAYS, className)}>
      <button type="button" role="radio" aria-checked={!chosen} onClick={clearBranch} className={chip(!chosen)}>
        {offerPagesShared.picker.all}
      </button>
      {locations.map((loc) => (
        <button key={loc.id} type="button" role="radio" aria-checked={chosen === loc.id} onClick={() => setBranch(loc.id)} className={chip(chosen === loc.id)}>
          {loc.name}
        </button>
      ))}
    </div>
  );
}

/** The sticky row of offer tabs: one per card, short labels on one line, the tab in view highlighted. */
export function OfferTabs({ items }: { items: Array<{ id: string; label: string }> }) {
  const [active, setActive] = useState(items[0]?.id);
  const row = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (seen) setActive(seen.target.id);
      },
      // A card counts as "in view" while it crosses the upper part of the screen, under the header and tabs.
      { rootMargin: '-120px 0px -55% 0px' },
    );
    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  // Keep the active tab visible in the row, without moving the page.
  useEffect(() => {
    const tab = row.current?.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    if (!tab || !row.current) return;
    const { offsetLeft, offsetWidth } = tab;
    const { scrollLeft, clientWidth } = row.current;
    if (offsetLeft < scrollLeft || offsetLeft + offsetWidth > scrollLeft + clientWidth) row.current.scrollTo({ left: offsetLeft - 16, behavior: 'smooth' });
  }, [active]);

  return (
    <nav aria-label="Offers on this page" className="under-header sticky z-30 border-b border-ink/10 bg-cream/95 backdrop-blur-md">
      <div className="container-site">
        <ul ref={row} className={cn(SIDEWAYS, 'py-2')}>
          {items.map((item) => (
            <li key={item.id} className="shrink-0 snap-start">
              <a
                href={`#${item.id}`}
                data-tab={item.id}
                aria-current={active === item.id ? 'true' : undefined}
                className={cn(
                  'inline-flex h-11 items-center whitespace-nowrap rounded-full px-4 text-sm font-medium transition',
                  active === item.id ? 'bg-ink text-cream' : 'text-ink hover:text-berry',
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

/** A whole-card link to a category page: photo, name, "From ₹X · Save up to ₹Y", its offers as chips. */
export function CategoryCard({ id, headingLevel: Heading = 'h3', priority = false }: { id: OfferCategoryId; headingLevel?: 'h2' | 'h3'; priority?: boolean }) {
  const category = categoryById(id);
  const offers = offersIn(id);
  const campaign = id === 'hair-colour' && isCampaignOpen();
  return (
    <a
      href={category.path}
      data-category-card={id}
      onClick={() => track('offer_category_click', { category: id, page: location.pathname })}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-berry/10 bg-white shadow-soft transition active:scale-[0.98]"
    >
      <div className="relative overflow-hidden bg-blush">
        <Picture image={category.image} eager={priority} priority={priority} sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, calc(100vw - 32px)" className="aspect-[4/5] w-full object-cover transition duration-200 group-hover:scale-[1.02] motion-reduce:transition-none" />
        {campaign && <span className="absolute left-3 top-3 rounded-full bg-cream px-3 py-1 text-xs font-semibold text-ink shadow-soft">Ends 30 Nov · {campaignPill()}</span>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-5">
        <Heading className="text-balance font-display text-2xl font-medium leading-tight text-ink">{category.name} Offers</Heading>
        <p className="mt-1 text-sm font-semibold text-berry">
          From {formatPrice(fromPriceIn(id))} · Save up to {formatPrice(maxSavingIn(id))}
        </p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {offers.slice(0, 3).map((offer) => (
            <li key={offer.id} className="rounded-full bg-blush px-2.5 py-1 text-xs font-medium text-berrydark">
              {offer.tab}
            </li>
          ))}
        </ul>
        <span className="mt-auto inline-flex min-h-11 items-center gap-1 pt-3 text-sm font-semibold text-berry">
          See {category.name.toLowerCase()} offers
          <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </a>
  );
}

/**
 * The phone's claim bar: appears once the hero's buttons have scrolled away, and steps aside at the footer so it
 * never covers the last button. One line at 320px: "Claim · from ₹399", and "Claim · ₹399" below 360px.
 */
export function ClaimBar({ href, phoneHref, from, placement }: { href: string; phoneHref: string; from: number; placement: string }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const hero = document.querySelector('[data-hero-cta]');
    const end = document.querySelector('[data-claim-end]') ?? document.querySelector('footer');
    if (!hero) return;
    let past = false;
    let atEnd = false;
    const update = () => setShown(past && !atEnd);
    const heroWatch = new IntersectionObserver(([entry]) => {
      past = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      update();
    });
    const endWatch = new IntersectionObserver(([entry]) => {
      atEnd = entry.isIntersecting || entry.boundingClientRect.top < 0;
      update();
    });
    heroWatch.observe(hero);
    if (end) endWatch.observe(end);
    return () => {
      heroWatch.disconnect();
      endWatch.disconnect();
    };
  }, []);

  return (
    <nav
      aria-label="Quick actions"
      data-cta="sticky_bar"
      className={cn(
        'safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-cream/95 p-2 backdrop-blur-md transition duration-200 motion-reduce:transition-none md:hidden',
        '[[data-sheet-open]_&]:hidden',
        shown ? 'translate-y-0' : 'pointer-events-none translate-y-full opacity-0',
      )}
    >
      <div className="flex items-center gap-2">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('sticky_cta_click', { placement, page: location.pathname })}
          className="flex min-h-12 min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-whatsapp px-3 text-sm font-semibold text-white active:scale-[0.98]"
        >
          <WhatsAppIcon className="size-5 shrink-0" />
          <span>
            {CTA.claim} · <span className="hidden min-[360px]:inline">from </span>
            {formatPrice(from)}
          </span>
        </a>
        <a href={phoneHref} aria-label="Call a salon" className="grid size-12 shrink-0 place-items-center rounded-full border border-berry text-berry">
          <Phone aria-hidden className="size-5" />
        </a>
      </div>
    </nav>
  );
}
