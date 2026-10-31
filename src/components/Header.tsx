import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, MapPin, Menu, Phone } from 'lucide-react';
import { useBooking } from '../context/booking';
import { locations, salonsPath } from '../data/branches';
import { faqPath, hero, nav, site } from '../data/content';
import { membershipPath } from '../data/membershipLinks';
import { giftsMenu, offersMenu, salonsMenu, type NavMenu } from '../data/navMenus';
import { offersPath } from '../data/offers';
import { servicesHubPath } from '../data/services';
import { useHistoryClose } from '../hooks/useHistoryClose';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { cn } from '../lib/cn';
import { blogRoute, currentPage, currentSalon, hasBlog, homeHref, isAbout, isFaq, isHome, isMembership, isNovemberOffers, isOffers, isSalons } from '../lib/route';
import { NovBadge } from './offers/NovemberBits';
import { bookingWhatsappHref, PICK_CALL, whatsappLink } from '../lib/whatsapp';
import { StatusDot } from './branch/StatusChip';
import { Button } from './ui/Button';

/** The nav item that stays highlighted on the offers page. */
const OFFERS_ID = 'offers';

// A page about one place (the tattoo studio, or a salon) puts that place's phone and WhatsApp in the header.
const pageContact = () =>
  currentPage?.contact ??
  (currentSalon && {
    phone: currentSalon.phone,
    phoneHref: currentSalon.phoneHref,
    whatsappHref: whatsappLink(`Hi Xing ${currentSalon.name}! I’d like to book an appointment. Preferred day/time: `, currentSalon.whatsappHref),
  });
import { MobileMenu } from './nav/MobileMenu';
import { ServicesMegaMenu } from './nav/ServicesMegaMenu';
import { Logo, WhatsAppIcon } from './ui/Decor';
import { Modal } from './ui/Modal';

const NAV_IDS = nav.map((item) => item.id);
const GUIDES_ID = 'guides';
/** The "Blogs" item opens the blog once a post is live; before that it scrolls to the landing guides. */
const ABOUT_ID = 'about';
const MEMBERSHIP_ID = 'membership';
/** The "Salons" item: spied as the salons section on the home page, and a page of its own (/salons) as a link. */
const SALONS_ID = 'branches';
const FAQ_ID = 'faq';
const navHref = (id: string) =>
  id === ABOUT_ID
    ? '/about'
    : id === FAQ_ID
      ? faqPath
      : id === OFFERS_ID
        ? offersPath
        : id === MEMBERSHIP_ID
      ? membershipPath
      : id === GUIDES_ID && hasBlog
        ? '/blog'
        : id === SALONS_ID
          ? salonsPath
          : id === SERVICES_ID
            ? servicesHubPath
            : homeHref(`#${id}`);
const SHRINK_AFTER_PX = 24;
const HIDE_AFTER_PX = 200;
const SCROLL_JITTER_PX = 6;
const SERVICES_ID = 'services';

const NAV_LINK = 'relative whitespace-nowrap py-2 text-sm transition-colors hover:text-berry';
const UNDERLINE = (
  <motion.span
    layoutId="nav-underline"
    className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-berry"
    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
  />
);

/**
 * A desktop nav item with a dropdown: opens on hover or from its button, Esc closes it and returns to that button.
 * With `href` the label is a link to the section's page and the chevron is the button.
 */
function NavDropdown({ id, label, href, isActive, badge, children }: { id: string; label: string; href?: string; isActive: boolean; badge?: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const chevron = <ChevronDown aria-hidden className={cn('size-3.5 transition-transform duration-200', open && 'rotate-180')} />;
  const tone = isActive ? 'font-medium text-berry' : 'text-ink';

  return (
    <li
      className="relative flex h-full items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
      onKeyDown={(e) => {
        if (e.key !== 'Escape' || !open) return;
        setOpen(false);
        toggle.current?.focus();
      }}
    >
      {href ? (
        <>
          <a href={href} aria-current={isActive ? 'true' : undefined} className={cn(NAV_LINK, tone)}>
            {label}
            {badge}
            {isActive && UNDERLINE}
          </a>
          <button
            ref={toggle}
            type="button"
            aria-label={`${label} menu`}
            aria-expanded={open}
            aria-controls={`${id}-menu`}
            onClick={() => setOpen((value) => !value)}
            className={cn('-mr-1 ml-0.5 inline-flex h-8 w-5 items-center justify-center hover:text-berry', tone)}
          >
            {chevron}
          </button>
        </>
      ) : (
        <button
          ref={toggle}
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-menu`}
          onClick={() => setOpen(true)}
          className={cn(NAV_LINK, 'inline-flex items-center gap-1', tone)}
        >
          {label}
          {chevron}
          {isActive && UNDERLINE}
        </button>
      )}
      {open && (
        <div id={`${id}-menu`} className="absolute left-1/2 top-full w-80 -translate-x-1/2 rounded-card border border-ink/10 bg-cream p-2 shadow-lift">
          {children}
        </div>
      )}
    </li>
  );
}

/** Desktop Offers and Gifts: one row per item, then the link to the whole page. */
function LinksMenu({ id, label, href, isActive, menu, badge }: { id: string; label: string; href: string; isActive: boolean; menu: NavMenu; badge?: ReactNode }) {
  return (
    <NavDropdown id={id} label={label} href={href} isActive={isActive} badge={badge}>
      <ul>
        {menu.items.map((item) => (
          <li key={item.href}>
            <a href={item.href} className={cn('flex min-h-11 items-center rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blush', item.highlight ? 'bg-blush font-semibold text-berry' : 'text-ink')}>
              <span>
                {item.label}
                {item.note && <span className={cn('font-normal', item.highlight ? 'text-berry' : 'text-muted')}> · {item.note}</span>}
              </span>
            </a>
          </li>
        ))}
      </ul>
      <a href={menu.viewAll.href} className="mt-1 flex min-h-11 items-center justify-center border-t border-ink/10 text-sm font-medium text-berry underline-offset-4 hover:underline">
        {menu.viewAll.label} →
      </a>
    </NavDropdown>
  );
}

/** Desktop "Salons" item: a small dropdown with one row per salon and whether it is open. */
function SalonsMenu({ label, isActive }: { label: string; isActive: boolean }) {
  return (
    <NavDropdown id="salons" label={label} isActive={isActive}>
          <ul>
            {locations.map((salon) => (
              <li key={salon.id}>
                <a
                  href={salon.path}
                  aria-current={currentSalon?.id === salon.id ? 'page' : undefined}
                  className="flex min-h-14 items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-blush"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-blush text-berry">
                    <MapPin aria-hidden className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-ink">Xing {salon.name}</span>
                    <span className="block truncate text-xs text-muted">{salon.area}</span>
                  </span>
                  <StatusDot />
                </a>
              </li>
            ))}
          </ul>
          <a
            href={salonsPath}
            className="mt-1 flex min-h-11 items-center justify-center border-t border-ink/10 text-sm font-medium text-berry underline-offset-4 hover:underline"
          >
            Compare all salons
          </a>
    </NavDropdown>
  );
}

export function Header() {
  const booking = useBooking();
  const contact = pageContact();
  const spied = useScrollSpy(NAV_IDS);
  // Service pages have no landing sections to spy on: they sit under Services.
  const active = isHome
    ? spied
    : blogRoute
      ? GUIDES_ID
      : isAbout
        ? ABOUT_ID
        : isFaq
          ? FAQ_ID
        : isOffers || isNovemberOffers
          ? OFFERS_ID
          : isMembership
            ? MEMBERSHIP_ID
            : isSalons || currentSalon
              ? SALONS_ID
              : SERVICES_ID;
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Where the visitor is in the drawer: [] the main list, ['services'], then ['services', <category>].
  const [menuPath, setMenuPath] = useState<string[]>([]);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  // Back goes up a level, then closes the drawer. A link tap closes it without stepping back, so the link isn't undone.
  const menuHistory = useHistoryClose(menuOpen, closeMenu, () => setMenuPath((path) => path.slice(0, -1)));
  const navigate = useCallback(() => {
    menuHistory.leaving();
    setMenuOpen(false);
  }, [menuHistory]);
  const openMenu = () => {
    setMenuPath([]);
    setMenuOpen(true);
  };

  // Only one bar at the foot of the screen: the quick-actions bar steps aside while the drawer is open.
  useEffect(() => {
    if (!menuOpen) return;
    document.documentElement.dataset.sheetOpen = '';
    return () => {
      delete document.documentElement.dataset.sheetOpen;
    };
  }, [menuOpen]);

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
          <Logo priority className={cn('origin-left transition-transform duration-300', scrolled && 'lg:scale-90')} />

          <nav aria-label="Primary" className="hidden h-full lg:block">
            <ul className="flex h-full items-center gap-6 xl:gap-8">
              {nav.map((item) => {
                const isActive = active === item.id;
                if (item.id === SERVICES_ID) return <ServicesMegaMenu key={item.id} label={item.label} isActive={isActive} underline={UNDERLINE} />;
                if (item.id === SALONS_ID) return <SalonsMenu key={item.id} label={item.label} isActive={isActive} />;
                if (item.id === OFFERS_ID) return <LinksMenu key={item.id} id="offers" label={item.label} href={navHref(item.id)} isActive={isActive} menu={offersMenu()} badge={<NovBadge />} />;
                if (item.id === MEMBERSHIP_ID) return <LinksMenu key={item.id} id="gifts" label={item.label} href={navHref(item.id)} isActive={isActive} menu={giftsMenu} />;
                return (
                  <li key={item.id}>
                    <a
                      href={navHref(item.id)}
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
              href={contact?.phoneHref ?? PICK_CALL}
              className="hidden min-h-11 items-center gap-2 text-sm font-medium text-ink hover:text-berry md:inline-flex lg:hidden xl:inline-flex"
            >
              <Phone aria-hidden className="size-4 text-berry" />
              {contact?.phone ?? 'Call a salon'}
            </a>
            <Button size="sm" onClick={() => booking.open()} className="hidden min-h-11 md:inline-flex">
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
              onClick={openMenu}
              className="-mr-2 grid size-11 place-items-center rounded-md text-ink hover:text-berry lg:hidden"
            >
              <Menu aria-hidden className="size-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Outside <header>: its backdrop-filter would otherwise trap the fixed drawer. */}
      <Modal open={menuOpen} onClose={closeMenu} label="Site menu" layout="drawer">
        <MobileMenu
          items={nav.map((item) => ({ id: item.id, label: item.label, href: navHref(item.id), current: active === item.id }))}
          servicesId={SERVICES_ID}
          menus={{ [OFFERS_ID]: offersMenu(), [MEMBERSHIP_ID]: giftsMenu, [SALONS_ID]: salonsMenu }}
          path={menuPath}
          onEnter={(level) => {
            menuHistory.push();
            setMenuPath((path) => [...path, level]);
          }}
          onUp={menuHistory.back}
          onClose={closeMenu}
          onNavigate={navigate}
          whatsappHref={contact?.whatsappHref ?? bookingWhatsappHref}
          phoneHref={contact?.phoneHref ?? PICK_CALL}
        />
      </Modal>
    </>
  );
}
