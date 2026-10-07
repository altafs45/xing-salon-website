import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Menu, Phone, X } from 'lucide-react';
import { useBooking } from '../context/booking';
import { hero, nav, primaryLocation, site } from '../data/content';
import { serviceGroups, servicesHubPath } from '../data/services';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { cn } from '../lib/cn';
import { currentPage, homeHref, isHome, serviceHref } from '../lib/route';

// A page about a separate venue (the tattoo studio) puts that venue's phone and WhatsApp in the header.
const contact = currentPage?.contact;
import { bookingWhatsappHref } from '../lib/whatsapp';
import { Button } from './ui/Button';
import { Logo, WhatsAppIcon } from './ui/Decor';
import { Modal } from './ui/Modal';

const NAV_IDS = nav.map((item) => item.id);
const SHRINK_AFTER_PX = 24;
const HIDE_AFTER_PX = 200;
const SCROLL_JITTER_PX = 6;
const SERVICES_ID = 'services';

const NAV_LINK = 'relative py-2 text-sm transition-colors hover:text-berry';
const UNDERLINE = (
  <motion.span
    layoutId="nav-underline"
    className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-berry"
    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
  />
);

/** Dropdown link to a service page, highlighted when it is the page being viewed. */
function ServiceLink({
  slug,
  label,
  badge,
  tag,
  onClick,
  className,
}: {
  slug: string;
  label: string;
  badge?: string;
  /** Quiet note beside the name, e.g. "Women only". */
  tag?: string;
  onClick?: () => void;
  className?: string;
}) {
  const isCurrent = currentPage?.slug === slug;
  return (
    <a
      href={serviceHref(slug)}
      onClick={onClick}
      aria-current={isCurrent ? 'page' : undefined}
      className={cn('transition-colors hover:text-berry', isCurrent ? 'font-medium text-berry' : 'text-ink', className)}
    >
      {label}
      {badge && <span className="ml-2 rounded-full bg-gold px-2 py-0.5 text-xs font-semibold text-ink">{badge}</span>}
      {tag && <span className="ml-2 rounded-full border border-berry/30 px-2 py-0.5 text-xs text-muted">{tag}</span>}
    </a>
  );
}

/** Desktop "Services" item: a mega-menu with one column per service group. */
function ServicesMenu({ label, isActive }: { label: string; isActive: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    // Full header height, so the pointer never leaves the item on its way down to the panel.
    <li
      className="flex h-full items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
      onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls="services-menu"
        onClick={() => setOpen(true)}
        className={cn(NAV_LINK, 'inline-flex items-center gap-1', isActive ? 'font-medium text-berry' : 'text-ink')}
      >
        {label}
        <ChevronDown aria-hidden className={cn('size-3.5 transition-transform duration-200', open && 'rotate-180')} />
        {isActive && UNDERLINE}
      </button>
      {open && (
        <div id="services-menu" className="absolute inset-x-0 top-full border-t border-ink/10 bg-cream shadow-soft">
          <div className="container-site grid grid-cols-4 gap-8 py-8">
            {serviceGroups.map((group) => (
              <div key={group.id}>
                <p className="text-eyebrow font-medium uppercase text-berry">{group.label}</p>
                <ul className="mt-3 space-y-2.5">
                  {group.services.map((service) => (
                    <li key={service.slug}>
                      <ServiceLink slug={service.slug} label={service.label} badge={service.badge} tag={service.tag} className="text-sm" />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-ink/10">
            <div className="container-site flex items-center gap-8 py-4">
              <a href={servicesHubPath} className="text-sm font-medium text-berry underline-offset-4 hover:underline">
                View all services
              </a>
              <a href={homeHref('#offers')} className="text-sm font-medium text-berry underline-offset-4 hover:underline">
                Offers & memberships
              </a>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}

/** Mobile "Services" item: one accordion per service group. */
function ServicesAccordion({ label, isActive, onNavigate }: { label: string; isActive: boolean; onNavigate: () => void }) {
  const [open, setOpen] = useState(!isHome);
  const [openGroup, setOpenGroup] = useState<string | null>(
    serviceGroups.find((group) => group.services.some((service) => service.slug === currentPage?.slug))?.id ?? null,
  );

  return (
    <li>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={cn(
          'flex w-full items-center justify-between py-4 text-left font-display text-2xl',
          isActive ? 'italic text-berry' : 'text-ink',
        )}
      >
        {label}
        <ChevronDown aria-hidden className={cn('size-5 transition-transform duration-200', open && 'rotate-180')} />
      </button>
      {open && (
        <ul className="pb-3">
          {serviceGroups.map((group) => {
            const expanded = openGroup === group.id;
            return (
              <li key={group.id}>
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setOpenGroup(expanded ? null : group.id)}
                  className="flex min-h-11 w-full items-center justify-between text-left text-eyebrow font-medium uppercase text-berry"
                >
                  {group.label}
                  <ChevronDown aria-hidden className={cn('size-4 transition-transform duration-200', expanded && 'rotate-180')} />
                </button>
                {expanded && (
                  <ul className="pb-2 pl-3">
                    {group.services.map((service) => (
                      <li key={service.slug}>
                        <ServiceLink
                          slug={service.slug}
                          label={service.label}
                          badge={service.badge} tag={service.tag}
                          onClick={onNavigate}
                          className="flex min-h-11 items-center text-sm"
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
          <li>
            <a href={servicesHubPath} onClick={onNavigate} className="flex min-h-11 items-center text-sm font-medium text-berry">
              View all services
            </a>
          </li>
        </ul>
      )}
    </li>
  );
}

export function Header() {
  const booking = useBooking();
  const spied = useScrollSpy(NAV_IDS);
  // Service pages have no landing sections to spy on: they sit under Services.
  const active = isHome ? spied : SERVICES_ID;
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > SHRINK_AFTER_PX);
      // Small screens: slide away while reading down the page, come back on the first scroll up.
      if (Math.abs(y - lastY) > SCROLL_JITTER_PX) {
        setHidden(y > lastY && y > HIDE_AFTER_PX);
        lastY = y;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sticky rows (the service tabs) read this to move up into the space the header leaves.
  useEffect(() => {
    document.documentElement.classList.toggle('header-hidden', hidden);
  }, [hidden]);

  return (
    <>
      <header
        className={cn(
          'safe-top fixed inset-x-0 top-0 z-40 transition-all duration-300 motion-reduce:transition-none',
          scrolled ? 'bg-cream/80 shadow-soft backdrop-blur-md' : 'bg-cream',
          hidden && !menuOpen && 'max-lg:-translate-y-full',
        )}
      >
        <div
          className={cn(
            'container-site flex h-header-sm items-center justify-between gap-4 transition-all duration-300',
            !scrolled && 'lg:h-header',
          )}
        >
          <Logo className={cn('origin-left transition-transform duration-300', scrolled && 'lg:scale-90')} />

          <nav aria-label="Primary" className="hidden h-full lg:block">
            <ul className="flex h-full items-center gap-6 xl:gap-8">
              {nav.map((item) => {
                const isActive = active === item.id;
                if (item.id === SERVICES_ID) return <ServicesMenu key={item.id} label={item.label} isActive={isActive} />;
                return (
                  <li key={item.id}>
                    <a
                      href={homeHref(`#${item.id}`)}
                      aria-current={isActive ? 'true' : undefined}
                      className={cn(NAV_LINK, isActive ? 'font-medium text-berry' : 'text-ink')}
                    >
                      {item.label}
                      {isActive && UNDERLINE}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1 md:gap-5">
            <a
              href={contact?.phoneHref ?? primaryLocation.phoneHref}
              className="hidden items-center gap-2 text-sm font-medium text-ink hover:text-berry md:inline-flex lg:hidden xl:inline-flex"
            >
              <Phone aria-hidden className="size-4 text-berry" />
              {contact?.phone ?? primaryLocation.phone}
            </a>
            <Button size="sm" onClick={() => booking.open()} className="hidden md:inline-flex">
              {hero.primaryCta}
            </Button>
            <a
              href={contact?.whatsappHref ?? bookingWhatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Chat with ${site.name} on WhatsApp`}
              className="grid size-11 place-items-center rounded-full text-berry hover:bg-blush md:hidden"
            >
              <WhatsAppIcon className="size-6" />
            </a>
            <button
              type="button"
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
              className="-mr-2 grid size-11 place-items-center rounded-md text-ink hover:text-berry lg:hidden"
            >
              <Menu aria-hidden className="size-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Outside <header>: its backdrop-filter would otherwise trap the fixed drawer. */}
      <Modal open={menuOpen} onClose={closeMenu} label="Site menu" layout="drawer">
        <div className="safe-top safe-bottom flex min-h-full flex-col p-6">
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              aria-label="Close menu"
              onClick={closeMenu}
              className="-mr-2 grid size-11 place-items-center rounded-md text-ink hover:text-berry"
            >
              <X aria-hidden className="size-6" />
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-6">
            <ul className="divide-y divide-ink/10">
              {nav.map((item) =>
                item.id === SERVICES_ID ? (
                  <ServicesAccordion key={item.id} label={item.label} isActive={active === item.id} onNavigate={closeMenu} />
                ) : (
                  <li key={item.id}>
                    <a
                      href={homeHref(`#${item.id}`)}
                      onClick={closeMenu}
                      aria-current={active === item.id ? 'true' : undefined}
                      className={cn('block py-4 font-display text-2xl', active === item.id ? 'italic text-berry' : 'text-ink')}
                    >
                      {item.label}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </nav>
          <div className="mt-auto space-y-3 pt-8">
            <Button href={contact?.whatsappHref ?? bookingWhatsappHref} external arrow={false} className="w-full">
              <WhatsAppIcon className="size-5" />
              Book on WhatsApp
            </Button>
            <Button variant="outline" href={contact?.phoneHref ?? site.phoneHref} arrow={false} className="w-full">
              <Phone aria-hidden className="size-4" />
              Call
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
