import { useEffect, useRef, useState, type ReactNode, type TouchEvent } from 'react';
import { ArrowRight, ArrowUpRight, Brush, Dumbbell, Landmark, LocateFixed, MapPin, Navigation, Phone } from 'lucide-react';
import { fitness } from '../data/fitness';
import { locations, type Salon } from '../data/branches';
import { SalonNap } from './SalonNap';
import { studio } from '../data/pages/tattoo';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { onTabKeyDown } from '../lib/a11y';
import { branchFromHash, setBranch, useBranch } from '../lib/branch';
import { cn } from '../lib/cn';
import { serviceHref } from '../lib/route';
import { whatsappLink } from '../lib/whatsapp';
import { RatingChip, StatusChip } from './branch/StatusChip';
import { SectionHeader } from './service/SectionHeader';
import { Button } from './ui/Button';
import { WhatsAppIcon } from './ui/Decor';
import { Picture, Reveal } from './ui/Primitives';

const COPY = {
  eyebrow: 'Our Branches',
  title: 'Visit Xing at 3 Salons Across Bangalore',
  text: 'Sarjapur Road · HSR Layout · Brookfield. Pick your nearest salon for offers, directions and booking.',
};

/** Serving chips shown on a card before "+N more". */
const MAX_AREAS = 4;
const SWIPE_THRESHOLD_PX = 50;
const PHOTO_SIZES = '(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw';

// "Find my nearest salon" needs every salon's coordinates; it stays hidden until the owner supplies them.
const hasCoordinates = locations.every((salon) => salon.lat != null && salon.lng != null);

/** Distance in km between two points on Earth. */
function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

const ICON_ACTION =
  'relative z-10 grid size-11 place-items-center rounded-full border border-berry/25 text-berry transition-colors duration-200 hover:border-berry hover:bg-berry hover:text-cream';

/**
 * One salon at a glance, leading to its own page. The whole card links there (through the main link, stretched
 * over the card); the WhatsApp, Call and Directions buttons sit above that link and go straight to the salon.
 */
export function BranchCard({ salon, distance, eager = false }: { salon: Salon; distance?: number; eager?: boolean }) {
  const book = whatsappLink(`Hi Xing ${salon.name}! I’d like to book an appointment. Preferred day/time: `, salon.whatsappHref);
  const extraAreas = salon.areasServed.length - MAX_AREAS;

  return (
    <article
      aria-labelledby={`${salon.id}-card-title`}
      data-branch={salon.id}
      data-cta="branch_card"
      className="svc-card svc-card-hover group relative flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-blush">
        <Picture
          image={salon.photos[0]}
          eager={eager}
          sizes={PHOTO_SIZES}
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h3 id={`${salon.id}-card-title`} className="font-display text-2xl font-medium leading-snug text-ink">
            Xing {salon.name}
          </h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-blush px-2.5 py-1 text-xs font-medium text-berrydark">
            <MapPin aria-hidden className="size-3" />
            {salon.area}
          </span>
        </div>
        {distance != null && <p className="mt-1 text-sm font-medium text-berry">≈ {distance.toFixed(1)} km away</p>}

        <div className="mt-3 flex flex-wrap gap-2">
          <StatusChip salon={salon} />
          <RatingChip salon={salon} />
        </div>

        <SalonNap salon={salon} className="mt-4" />
        {salon.landmark && (
          <p className="mt-1.5 flex items-start gap-2.5 text-sm leading-relaxed text-muted">
            <Landmark aria-hidden className="mt-1 size-4 shrink-0 text-berry" />
            {salon.landmark}
          </p>
        )}

        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-berry">Serving</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {salon.areasServed.slice(0, MAX_AREAS).map((area) => (
            <li key={area} className="rounded-full bg-blush px-3 py-1 text-xs text-berrydark">
              {area}
            </li>
          ))}
          {extraAreas > 0 && <li className="rounded-full border border-berry/20 px-3 py-1 text-xs text-muted">+{extraAreas} more</li>}
        </ul>

        <div className="mt-auto pt-6">
          {/* Stretched over the whole card, so a tap anywhere on it opens the salon's page. */}
          <a
            href={salon.path}
            data-branch-card=""
            className="group/link flex min-h-12 items-center justify-center gap-2 rounded-full bg-berry px-5 text-sm font-medium text-cream transition-colors after:absolute after:inset-0 after:content-[''] hover:bg-berrydark"
          >
            Explore {salon.name} Salon
            <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover/link:translate-x-1 motion-reduce:transition-none" />
          </a>
          <div className="mt-3 flex items-center justify-center gap-3">
            <a href={book} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp Xing ${salon.name}`} className={ICON_ACTION}>
              <WhatsAppIcon className="size-5" />
            </a>
            <a href={salon.phoneHref} aria-label={`Call Xing ${salon.name}`} className={ICON_ACTION}>
              <Phone aria-hidden className="size-5" />
            </a>
            <a href={salon.directionsUrl} target="_blank" rel="noopener noreferrer" aria-label={`Directions to Xing ${salon.name}`} className={ICON_ACTION}>
              <Navigation aria-hidden className="size-5" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

interface BranchesSectionProps {
  /** Section anchor: "branches" on the landing page, "locations" on /about and /salons. */
  id?: string;
  className?: string;
  /** Extra content under the header. */
  children?: ReactNode;
  /** The section's heading level and copy, e.g. for /salons where the page has its own H1. */
  header?: ReactNode;
}

/**
 * All three salons, each leading to its own page. Phones: pill tabs over one large card that cross-fades (or
 * swipes) between salons, with dots. Tablets: two columns. Desktop: three cards side by side. The chosen salon
 * is remembered and shared with the branch picker and the sticky bar; links like "/#branches?b=hsr-layout"
 * choose one.
 */
export function BranchesSection({ id = 'branches', className, children, header }: BranchesSectionProps) {
  const remembered = useBranch();
  const selectedIndex = Math.max(0, locations.findIndex((salon) => salon.id === remembered));
  const [distances, setDistances] = useState<Record<string, number>>({});
  const [notice, setNotice] = useState('');
  const isPhone = !useMediaQuery('(min-width: 768px)');
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // A link to a salon (#hsr-layout, ?b=…) makes it the visitor's salon.
  useEffect(() => {
    const fromLink = branchFromHash(window.location.hash);
    if (fromLink) setBranch(fromLink);
    const onHashChange = () => {
      const next = branchFromHash(window.location.hash);
      if (next) setBranch(next);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const choose = (index: number) => setBranch(locations[(index + locations.length) % locations.length].id);

  // Asks for the visitor's position only when the button is tapped, never on load.
  const findNearest = () => {
    if (!navigator.geolocation) return setNotice('Choose your area above');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const here = { lat: coords.latitude, lng: coords.longitude };
        const km = Object.fromEntries(locations.map((salon) => [salon.id, haversine(here, { lat: salon.lat!, lng: salon.lng! })]));
        setDistances(km);
        setBranch(locations.reduce((best, salon) => (km[salon.id] < km[best.id] ? salon : best)).id);
      },
      () => setNotice('Choose your area above'),
    );
  };

  const onTouchStart = (e: TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    // A sideways swipe changes salon; a mostly vertical one is just the page scrolling.
    if (Math.abs(dx) > SWIPE_THRESHOLD_PX && Math.abs(dx) > Math.abs(dy)) choose(selectedIndex + (dx < 0 ? 1 : -1));
  };

  return (
    <section id={id} data-gallery aria-labelledby={`${id}-title`} className={cn('relative bg-cream py-14 lg:py-24', className)}>
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-4">
          {header ?? (
            <div id={`${id}-title`}>
              <SectionHeader eyebrow={COPY.eyebrow} title={COPY.title} text={COPY.text} />
            </div>
          )}
          {hasCoordinates && (
            <Button variant="outline" onClick={findNearest} arrow={false}>
              <LocateFixed aria-hidden className="size-4" />
              Find my nearest salon
            </Button>
          )}
        </div>
        {children}
        {notice && (
          <p role="status" className="mt-4 text-sm text-muted">
            {notice}
          </p>
        )}

        {/* Phones only: one tab per salon. */}
        <div role="tablist" aria-label="Choose a salon" className="mt-8 flex gap-1 rounded-full bg-blush p-1 md:hidden">
          {locations.map((salon, i) => {
            const selected = i === selectedIndex;
            return (
              <button
                key={salon.id}
                type="button"
                role="tab"
                id={`${id}-tab-${salon.id}`}
                aria-selected={selected}
                aria-controls={`${id}-card-${salon.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => choose(i)}
                onKeyDown={(e) => onTabKeyDown(e, i, locations.length, choose)}
                className={cn(
                  'min-h-11 flex-1 whitespace-nowrap rounded-full px-1.5 text-[0.8125rem] font-medium transition-colors duration-200',
                  selected ? 'bg-berry text-cream shadow-soft' : 'text-ink hover:text-berry',
                )}
              >
                {salon.name}
              </button>
            );
          })}
        </div>

        {/* Phones: the cards share one grid cell and cross-fade, so the section keeps its height. */}
        <ul
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="relative mt-5 grid touch-pan-y gap-6 md:mt-10 md:grid-cols-2 lg:mt-12 lg:grid-cols-3"
        >
          {locations.map((salon, i) => {
            const hidden = isPhone && i !== selectedIndex;
            return (
              <li
                key={salon.id}
                id={`${id}-card-${salon.id}`}
                {...(isPhone && { role: 'tabpanel', 'aria-labelledby': `${id}-tab-${salon.id}` })}
                // Hidden cards stay in the page for search engines, but out of the tab order and screen readers.
                {...(hidden && { inert: '', 'aria-hidden': true })}
                className={cn(
                  'max-md:col-start-1 max-md:row-start-1 max-md:transition-opacity max-md:duration-200 max-md:ease-out motion-reduce:transition-none',
                  hidden && 'pointer-events-none opacity-0',
                )}
              >
                <Reveal delay={isPhone ? 0 : i * 0.08} className="h-full">
                  <BranchCard salon={salon} distance={distances[salon.id]} eager={i === 0} />
                </Reveal>
              </li>
            );
          })}
        </ul>

        <div aria-hidden className="mt-4 flex justify-center gap-1.5 md:hidden">
          {locations.map((salon, i) => (
            <span
              key={salon.id}
              className={cn('h-2 rounded-full bg-berry transition-all duration-300 motion-reduce:transition-none', i === selectedIndex ? 'w-6' : 'w-2 opacity-30')}
            />
          ))}
        </div>

        <SisterBusinesses />
      </div>
    </section>
  );
}

/** The tattoo studio (same building as Brookfield) and the gym (AECS Layout): separate businesses with their own sites. */
export function SisterBusinesses({ intro }: { intro?: string }) {
  return (
    <div className="mt-8">
      {intro && <p className="mb-4 font-display text-xl font-medium text-ink sm:text-2xl">{intro}</p>}
      <Reveal>
        <div className="svc-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-blush text-berry">
              <Brush aria-hidden className="size-6" strokeWidth={1.5} />
            </span>
            <div>
              <h3 className="font-display text-xl font-medium text-ink">{studio.name}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">Same building as our Brookfield salon, SV Plaza · {studio.phone}</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" href={serviceHref('tattoo')}>
              Tattoo Studio
            </Button>
            <Button variant="outline" href={studio.website} external rel="noopener" arrow={false}>
              xingtattoo.in
              <ArrowUpRight aria-hidden className="size-4" />
            </Button>
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-4">
        <div className="svc-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-blush text-berry">
              <Dumbbell aria-hidden className="size-6" strokeWidth={1.5} />
            </span>
            <div>
              <h3 className="font-display text-xl font-medium text-ink">{fitness.name}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {fitness.where} · {fitness.phone}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" href={fitness.offersUrl} external rel="noopener" arrow={false}>
              Gym Offers
              <ArrowUpRight aria-hidden className="size-4" />
            </Button>
            <Button variant="outline" href={fitness.website} external rel="noopener" arrow={false}>
              xingfitness.in
              <ArrowUpRight aria-hidden className="size-4" />
            </Button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
