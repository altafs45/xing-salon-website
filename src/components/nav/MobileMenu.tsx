import { NovBadge } from '../offers/NovemberBits';
import { useEffect, useRef, type ReactNode, type RefObject, type TouchEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Phone, X } from 'lucide-react';
import type { NavMenu } from '../../data/navMenus';
import { categories, servicesIn } from '../../data/services';
import { cn } from '../../lib/cn';
import { currentPage, serviceHref } from '../../lib/route';
import { ICONS } from '../service/icons';
import { Button } from '../ui/Button';
import { Logo, WhatsAppIcon } from '../ui/Decor';
import { Picture } from '../ui/Primitives';

export interface MobileNavItem {
  id: string;
  label: string;
  href: string;
  current: boolean;
}

interface MobileMenuProps {
  items: MobileNavItem[];
  /** The id of the item that opens the Services levels instead of linking. */
  servicesId: string;
  /** Items that open a panel of links, by item id. */
  menus: Record<string, NavMenu>;
  /** Where the visitor is: [] the main list, ['services'] the categories, ['services', <category key>] one category. */
  path: string[];
  /** Steps into a level (adds a history entry, so Back comes up again). */
  onEnter: (level: string) => void;
  /** Goes up one level: the on-screen Back, a swipe right, or the browser's Back. */
  onUp: () => void;
  onClose: () => void;
  /** For a link tap: closes without stepping back through history. */
  onNavigate: () => void;
  whatsappHref: string;
  phoneHref: string;
}

const SWIPE_PX = 60;
const SLIDE_S = 0.22;

/** A level's top row: Back (or the logo), its title, and Close. Stays put while the level scrolls under it. */
function LevelHeader({ title, back, onBack, onClose, headingRef }: { title: string; back?: string; onBack?: () => void; onClose: () => void; headingRef: RefObject<HTMLHeadingElement> }) {
  return (
    <div className="safe-top shrink-0 border-b border-ink/10 bg-cream">
      <div className="flex h-header-sm items-center gap-2 px-4">
        {onBack ? (
          <button type="button" onClick={onBack} className="-ml-2 inline-flex min-h-11 shrink-0 items-center gap-1 rounded-md pr-2 text-base font-medium text-berry">
            <ChevronLeft aria-hidden className="size-5" />
            {back}
          </button>
        ) : (
          <Logo />
        )}
        <h2 ref={headingRef} tabIndex={-1} className={cn('min-w-0 flex-1 truncate text-center font-display text-xl font-medium text-ink outline-none', !onBack && 'sr-only')}>
          {title}
        </h2>
        <button type="button" aria-label="Close menu" onClick={onClose} className="-mr-2 ml-auto grid size-11 shrink-0 place-items-center rounded-md text-ink hover:text-berry">
          <X aria-hidden className="size-6" />
        </button>
      </div>
    </div>
  );
}

/** The site menu on phones and tablets: a main list, then Services › category › service, one level at a time. */
export function MobileMenu({ items, servicesId, menus, path, onEnter, onUp, onClose, onNavigate, whatsappHref, phoneHref }: MobileMenuProps) {
  const reduce = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const depth = path.length;
  const previousDepth = useRef(depth);
  const forward = depth >= previousDepth.current;
  const category = depth === 2 ? categories.find((entry) => entry.key === path[1]) : undefined;
  const menu = depth === 1 ? menus[path[0]] : undefined;
  const title = depth === 0 ? 'Menu' : menu?.title ?? (depth === 1 ? 'Services' : category?.title ?? 'Services');

  // Each level change moves focus to the new level's heading (not on first open: the dialog takes focus then).
  useEffect(() => {
    if (previousDepth.current !== depth) headingRef.current?.focus();
    previousDepth.current = depth;
  }, [depth, path]);

  const onTouchStart = (e: TouchEvent) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY });
  const onTouchEnd = (e: TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (depth > 0 && dx > SWIPE_PX && Math.abs(dx) > Math.abs(dy) * 1.5) onUp();
  };

  let body: ReactNode;
  if (depth === 0) {
    body = (
      <>
        <nav aria-label="Mobile" className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4">
          <ul className="divide-y divide-ink/10">
            {items.map((item) => (
              <li key={item.id}>
                {item.id === servicesId || menus[item.id] ? (
                  <button
                    type="button"
                    onClick={() => onEnter(item.id === servicesId ? 'services' : item.id)}
                    className={cn('flex min-h-14 w-full items-center justify-between py-3 text-left font-display text-2xl', item.current ? 'italic text-berry' : 'text-ink')}
                  >
                    <span>
                      {item.label}
                      {item.id === 'offers' && <NovBadge />}
                    </span>
                    <ChevronRight aria-hidden className="size-6 text-berry" />
                  </button>
                ) : (
                  <a
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={item.current ? 'page' : undefined}
                    className={cn('flex min-h-14 items-center py-3 font-display text-2xl', item.current ? 'italic text-berry' : 'text-ink')}
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
        {/* Pinned to the foot of the menu, clear of the home indicator. */}
        <div className="safe-bottom shrink-0 space-y-3 border-t border-ink/10 bg-cream px-4 pt-4 [padding-bottom:max(1rem,env(safe-area-inset-bottom))]">
          <Button href={whatsappHref} external arrow={false} className="min-h-12 w-full">
            <WhatsAppIcon className="size-5" />
            Book on WhatsApp
          </Button>
          <Button variant="outline" href={phoneHref} arrow={false} className="min-h-12 w-full">
            <Phone aria-hidden className="size-4" />
            Call
          </Button>
        </div>
      </>
    );
  } else if (menu) {
    body = (
      <div className="flex min-h-0 flex-1 flex-col">
        <ul className="min-h-0 flex-1 divide-y divide-ink/10 overflow-y-auto overscroll-contain px-4">
          {menu.feature && (
            <li className="py-3">
              <a href={menu.feature.href} onClick={onNavigate} className="flex items-center gap-3 rounded-3xl bg-blush p-3">
                <Picture image={menu.feature.image} decorative sizes="96px" className="h-24 w-20 shrink-0 rounded-2xl object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-ink">{menu.feature.title}</span>
                  <span className="mt-2 flex min-h-11 items-center justify-center rounded-full bg-berry px-3 text-sm font-semibold text-cream">{menu.feature.button}</span>
                </span>
              </a>
            </li>
          )}
          {menu.items.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={onNavigate} className="flex min-h-14 items-center justify-between gap-3 py-2">
                <span className="min-w-0">
                  <span className={cn('block text-lg font-medium', item.highlight ? 'text-berry' : 'text-ink')}>{item.label}</span>
                  {item.note && <span className="block text-sm text-muted">{item.note}</span>}
                </span>
                <ChevronRight aria-hidden className="size-5 shrink-0 text-berry" />
              </a>
            </li>
          ))}
        </ul>
        <div className="shrink-0 border-t border-ink/10 bg-cream px-4 pt-4 [padding-bottom:max(1rem,env(safe-area-inset-bottom))]">
          <a href={menu.viewAll.href} onClick={onNavigate} className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-berry px-5 text-base font-semibold text-cream">
            {menu.viewAll.label}
          </a>
        </div>
      </div>
    );
  } else if (depth === 1) {
    body = (
      <ul className="min-h-0 flex-1 divide-y divide-ink/10 overflow-y-auto overscroll-contain px-4">
        {categories.map((entry) => {
          const Icon = ICONS[entry.icon];
          const count = servicesIn(entry).length;
          return (
            <li key={entry.key}>
              <button type="button" onClick={() => onEnter(entry.key)} className="flex min-h-16 w-full items-center gap-3 py-2 text-left">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-blush text-berry">
                  <Icon aria-hidden className="size-5" strokeWidth={1.5} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-medium text-ink">{entry.title}</span>
                  <span className="block text-sm text-muted">
                    {count} {count === 1 ? 'service' : 'services'}
                  </span>
                </span>
                <ChevronRight aria-hidden className="size-5 shrink-0 text-berry" />
              </button>
            </li>
          );
        })}
      </ul>
    );
  } else if (category) {
    body = (
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="px-4 py-4">
          <a href={category.path} onClick={onNavigate} className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-berry px-5 text-base font-semibold text-cream">
            {category.hasPage ? `View all ${category.title}` : `Visit the ${category.title} Studio`}
          </a>
        </div>
        {category.groups.map((group) => (
          <section key={group.key} aria-label={group.title ?? category.title}>
            {/* Group names stay at the top of the panel while their services scroll under them. */}
            {group.title && <h3 className="sticky top-0 z-10 bg-cream px-4 py-2 text-eyebrow font-medium uppercase text-berry">{group.title}</h3>}
            <ul className="divide-y divide-ink/10 px-4 pb-3">
              {group.services.map((service) => (
                <li key={service.slug}>
                  <a
                    href={serviceHref(service.slug)}
                    onClick={onNavigate}
                    aria-current={currentPage?.slug === service.slug ? 'page' : undefined}
                    className="flex min-h-[3.25rem] items-center justify-between gap-3 py-2"
                  >
                    <span className="min-w-0">
                      <span className={cn('line-clamp-2 text-base font-medium', currentPage?.slug === service.slug ? 'text-berry' : 'text-ink')}>{service.menuLabel}</span>
                      <span className="block truncate text-sm text-muted">{service.blurb}</span>
                    </span>
                    <ChevronRight aria-hidden className="size-4 shrink-0 text-berry" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <p aria-live="polite" className="sr-only">
        {depth === 0 ? '' : `${title} menu`}
      </p>
      {/* One level at a time, full width: the new one slides in and the old one goes at once, so no edge peeks. */}
      <AnimatePresence initial={false}>
        <motion.div
          key={path.join('/') || 'root'}
          className="absolute inset-0 flex flex-col bg-cream"
          initial={reduce ? { opacity: 0 } : { x: forward ? '100%' : '-30%', opacity: forward ? 1 : 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0 } }}
          transition={{ duration: SLIDE_S, ease: 'easeOut' }}
        >
          <LevelHeader
            title={title}
            back={depth === 1 ? 'Back' : 'Services'}
            onBack={depth > 0 ? onUp : undefined}
            onClose={onClose}
            headingRef={headingRef}
          />
          {body}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
