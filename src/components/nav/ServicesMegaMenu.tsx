import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { m } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { categories, type ServiceCategory } from '../../data/services';
import { cn } from '../../lib/cn';
import { currentPage, serviceHref } from '../../lib/route';
import { bookingWhatsappHref } from '../../lib/whatsapp';
import { ICONS } from '../service/icons';
import { WhatsAppIcon } from '../ui/Decor';

const NAV_LINK = 'relative whitespace-nowrap py-2 text-sm transition-colors hover:text-berry';
const PANEL_ID = 'services-menu';
/** Pointer leaving the item: wait this long before closing, so a diagonal move to the panel doesn't close it. */
const CLOSE_DELAY_MS = 150;

/** The category the visitor is browsing, so the menu opens on it; Hair Care otherwise. */
const startTab = Math.max(
  0,
  categories.findIndex((category) => category.groups.some((group) => group.services.some((service) => service.slug === currentPage?.slug))),
);

function ServiceLinks({ category, onNavigate }: { category: ServiceCategory; onNavigate: () => void }) {
  const grouped = category.groups.some((group) => group.title);
  return (
    <div className={cn('grid gap-x-8 gap-y-6', grouped ? 'grid-cols-4' : 'grid-cols-1')}>
      {category.groups.map((group) => (
        <div key={group.key} className="min-w-0">
          {group.title && <p className="text-eyebrow font-medium uppercase text-berry">{group.title}</p>}
          <ul className={cn('mt-3 space-y-1', !grouped && 'mt-0 grid grid-cols-3 gap-x-8 space-y-0')}>
            {group.services.map((service) => (
              <li key={service.slug}>
                <a
                  href={serviceHref(service.slug)}
                  onClick={onNavigate}
                  aria-current={currentPage?.slug === service.slug ? 'page' : undefined}
                  className="group/item -mx-2 block rounded-lg px-2 py-1.5 transition-colors hover:bg-blush focus-visible:bg-blush"
                >
                  <span className={cn('flex items-center gap-2 text-sm', currentPage?.slug === service.slug ? 'font-semibold text-berry' : 'font-medium text-ink')}>
                    {service.menuLabel}
                    {service.badge && <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-semibold text-ink">{service.badge}</span>}
                  </span>
                  {/* Space kept for it, so showing it on hover moves nothing. */}
                  <span className="block truncate text-xs text-muted opacity-0 transition-opacity duration-150 group-hover/item:opacity-100 group-focus-visible/item:opacity-100 motion-reduce:transition-none">
                    {service.blurb}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** Desktop "Services": a panel under the header with the categories down the left and their services on the right. */
export function ServicesMegaMenu({ label, isActive, underline }: { label: string; isActive: boolean; underline: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(startTab);
  const root = useRef<HTMLLIElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef(0);
  const category = categories[tab];

  const show = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hideSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };
  const close = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(false);
  };

  // Esc closes and returns to the button; a click anywhere else closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      close();
      button.current?.focus();
    };
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && close();
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const focusTab = (index: number) => root.current?.querySelectorAll<HTMLElement>('[role="tab"]')[index]?.focus();

  const onButtonKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'ArrowDown') return;
    e.preventDefault();
    show();
    requestAnimationFrame(() => focusTab(tab));
  };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next = e.key === 'ArrowDown' ? index + 1 : e.key === 'ArrowUp' ? index - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? categories.length - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const wrapped = (next + categories.length) % categories.length;
    setTab(wrapped);
    focusTab(wrapped);
  };

  return (
    // Full header height, so the pointer never leaves the item on its way down to the panel.
    <li ref={root} className="flex h-full items-center" onMouseEnter={show} onMouseLeave={hideSoon}>
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={PANEL_ID}
        onClick={() => (open ? close() : show())}
        onKeyDown={onButtonKey}
        className={cn(NAV_LINK, 'inline-flex items-center gap-1', isActive || open ? 'font-medium text-berry' : 'text-ink')}
      >
        {label}
        <ChevronDown aria-hidden className={cn('size-3.5 transition-transform duration-200', open && 'rotate-180')} />
        {isActive && underline}
      </button>

      {open && (
        <>
          {/* Dims the page under the panel; the header stays clear. A tap closes the menu. */}
          <div aria-hidden onClick={close} onMouseEnter={hideSoon} className="absolute inset-x-0 top-full h-screen bg-ink/30" />
          <m.div
            id={PANEL_ID}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute inset-x-0 top-full border-t border-ink/10 bg-cream shadow-lift"
          >
            <div className="container-site grid max-h-[80vh] grid-cols-[13rem_1fr] gap-10 overflow-y-auto py-7">
              <div role="tablist" aria-orientation="vertical" aria-label="Service categories" className="flex flex-col gap-1 border-r border-ink/10 pr-6">
                {categories.map((entry, i) => {
                  const Icon = ICONS[entry.icon];
                  const selected = i === tab;
                  return (
                    <button
                      key={entry.key}
                      type="button"
                      role="tab"
                      id={`services-tab-${entry.key}`}
                      aria-selected={selected}
                      aria-controls={`${PANEL_ID}-panel`}
                      tabIndex={selected ? 0 : -1}
                      onClick={() => setTab(i)}
                      onMouseEnter={() => setTab(i)}
                      onKeyDown={(e) => onTabKey(e, i)}
                      className={cn(
                        'flex min-h-11 items-center gap-3 rounded-xl px-3 text-left text-sm font-medium transition-colors',
                        selected ? 'bg-berry text-cream' : 'text-ink hover:bg-blush',
                      )}
                    >
                      <Icon aria-hidden className="size-5 shrink-0" strokeWidth={1.5} />
                      {entry.title}
                    </button>
                  );
                })}
              </div>
              <div role="tabpanel" id={`${PANEL_ID}-panel`} aria-labelledby={`services-tab-${category.key}`} tabIndex={0} className="min-w-0 outline-none">
                <ServiceLinks category={category} onNavigate={close} />
              </div>
            </div>
            <div className="border-t border-ink/10">
              <div className="container-site flex items-center justify-between gap-6 py-3.5">
                <a href={category.path} onClick={close} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-berry underline-offset-4 hover:underline">
                  View all {category.title}
                  <ArrowRight aria-hidden className="size-4" />
                </a>
                <a
                  href={bookingWhatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink hover:text-berry"
                >
                  <WhatsAppIcon className="size-4 text-whatsapp" />
                  Free consultation · Book on WhatsApp
                </a>
              </div>
            </div>
          </m.div>
        </>
      )}
    </li>
  );
}
