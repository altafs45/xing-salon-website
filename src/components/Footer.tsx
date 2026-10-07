import { useState, type ReactNode } from 'react';
import { ArrowUp, ChevronDown, Clock, Facebook, Instagram, Navigation, Phone } from 'lucide-react';
import { useBooking } from '../context/booking';
import { cta, footer, locations, site } from '../data/content';
import { cn } from '../lib/cn';
import { homeHref } from '../lib/route';
import { Button } from './ui/Button';
import { Floral, Logo } from './ui/Decor';
import { Reveal } from './ui/Primitives';

const SOCIAL_ICONS = { instagram: Instagram, facebook: Facebook } as const;
type SocialIcon = keyof typeof SOCIAL_ICONS;

export function CtaBand() {
  const booking = useBooking();

  return (
    <section aria-labelledby="cta-title" className="on-dark relative overflow-hidden border-b border-cream/10 bg-ink py-12">
      <Floral className="-left-10 -top-10 h-56 rotate-180 text-berry" />
      <Floral flip className="-right-10 -top-10 h-56 rotate-180 text-berry" />
      <Reveal className="container-site relative flex flex-col items-center gap-6 lg:flex-row lg:justify-center lg:gap-10">
        <h2 id="cta-title" className="heading text-center text-cream">
          {cta.title}
        </h2>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
          <Button onClick={() => booking.open()}>{cta.book}</Button>
          <Button variant="outlineLight" href="#locations" arrow={false}>
            {cta.find}
          </Button>
          <Button variant="outlineLight" href={homeHref('#services')} arrow={false}>
            {cta.explore}
          </Button>
        </div>
      </Reveal>
    </section>
  );
}

/** A link column: always open from tablet up, an accordion on phones so the footer stays short. */
function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <nav aria-label={title} className="border-b border-cream/10 md:border-0">
      <h2 className="text-sm font-semibold text-cream">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="flex min-h-12 w-full items-center justify-between text-left md:hidden"
        >
          {title}
          <ChevronDown aria-hidden className={cn('size-4 transition-transform duration-200', open && 'rotate-180')} />
        </button>
        <span className="hidden md:block">{title}</span>
      </h2>
      {/* Collapsed, not removed: the links stay in the page for search engines and screen readers. */}
      <div className={cn('pb-3 md:mt-4 md:block md:pb-0', !open && 'hidden')}>{children}</div>
    </nav>
  );
}

const FOOTER_LINK = 'inline-flex min-h-11 items-center text-xs text-cream/70 transition-colors hover:text-gold md:min-h-0';

export function Footer() {
  return (
    <footer className="on-dark bg-ink pb-action-bar text-cream md:pb-0">
      <div className="container-site grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="sm:col-span-2 lg:col-span-3">
          <Logo tone="dark" />
          <ul className="mt-6 flex gap-3">
            {footer.socials.map((social) => {
              const Icon = SOCIAL_ICONS[social.icon as SocialIcon];
              return (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${site.name} on ${social.label}`}
                    className="grid size-11 place-items-center rounded-full border border-cream/30 transition-colors hover:border-gold hover:bg-gold hover:text-ink"
                  >
                    <Icon aria-hidden className="size-4" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="sm:col-span-2 md:grid md:grid-cols-4 md:gap-8 lg:col-span-5">
          {footer.columns.map((column) => (
            <FooterColumn key={column.title} title={column.title}>
              <ul className="md:space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={homeHref(link.href)} className={FOOTER_LINK}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </FooterColumn>
          ))}
        </div>

        {/* Name, address and phone for each salon, as plain text with tap-to-call and directions. */}
        <div className="sm:col-span-2 lg:col-span-4">
          <h2 className="text-sm font-semibold text-cream">{footer.contactTitle}</h2>
          <ul className="mt-4 space-y-5 text-xs text-cream/70">
            {locations.map((loc) => (
              <li key={loc.id}>
                <p className="text-sm font-medium text-cream">{loc.name}</p>
                <address className="mt-1 not-italic leading-relaxed">{loc.address}</address>
                <p className="flex flex-wrap gap-x-5">
                  <a href={loc.phoneHref} className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-gold md:min-h-8">
                    <Phone aria-hidden className="size-3.5 shrink-0 text-gold" />
                    {loc.phone}
                  </a>
                  <a
                    href={loc.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-gold md:min-h-8"
                  >
                    <Navigation aria-hidden className="size-3.5 shrink-0 text-gold" />
                    Directions
                    <span className="sr-only"> to {loc.name}</span>
                  </a>
                </p>
              </li>
            ))}
            <li className="flex items-center gap-2">
              <Clock aria-hidden className="size-3.5 text-gold" />
              {site.hours.days}: {site.hours.label}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-site flex flex-col items-center justify-between gap-1 py-5 text-xs text-cream/70 sm:flex-row sm:gap-3">
          <p>{site.copyright}</p>
          <a href="#home" className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-gold">
            {footer.backToTop}
            <ArrowUp aria-hidden className="size-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
