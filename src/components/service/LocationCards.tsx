import { ArrowUpRight, Clock, Instagram, Mail, MapPin, Navigation, Phone } from 'lucide-react';
import { locations } from '../../data/content';
import type { StudioContact } from '../../data/pages/types';
import { whatsappLink } from '../../lib/whatsapp';
import { Button } from '../ui/Button';
import { WhatsAppIcon } from '../ui/Decor';
import { Picture, Reveal } from '../ui/Primitives';

/** One card per salon: photo (or a pin panel until photos exist), address, WhatsApp and Directions. */
export function LocationCards({ whatsappText }: { whatsappText: string }) {
  return (
    <ul className="mt-10 grid gap-5 md:grid-cols-3">
      {locations.map((loc, i) => (
        <li key={loc.id}>
          <Reveal delay={i * 0.06} className="h-full">
            <article className="svc-card svc-card-hover flex h-full flex-col overflow-hidden">
              {loc.photos[0] ? (
                <Picture image={loc.photos[0]} className="aspect-guide w-full object-cover" />
              ) : (
                <div className="grid aspect-guide place-items-center bg-gradient-to-br from-blush to-mint text-berry">
                  <MapPin aria-hidden className="size-12" strokeWidth={1} />
                </div>
              )}
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="font-display text-xl font-medium text-ink">{loc.name}</h3>
                <address className="mt-2 flex-1 text-sm not-italic leading-relaxed text-muted">{loc.address}</address>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button href={whatsappLink(`${whatsappText} ${loc.name}`, loc.whatsappHref)} external arrow={false} className="flex-1">
                    <WhatsAppIcon className="size-4" />
                    WhatsApp
                    <span className="sr-only"> {loc.name}</span>
                  </Button>
                  <Button variant="outline" href={loc.directionsUrl} external arrow={false} className="flex-1">
                    <Navigation aria-hidden className="size-4" />
                    Directions
                    <span className="sr-only"> to {loc.name}</span>
                  </Button>
                </div>
              </div>
            </article>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

/**
 * A single venue with its own contact details (e.g. the tattoo studio). The map panel is a plain link to
 * Google Maps, so no map loads until someone asks for it.
 */
export function StudioCard({ contact, whatsappHref }: { contact: StudioContact; whatsappHref: string }) {
  return (
    <Reveal className="svc-card mt-10 grid overflow-hidden md:grid-cols-5">
      <a
        href={contact.mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative grid min-h-48 place-items-center bg-gradient-to-br from-blush via-cream to-mint text-berry md:col-span-2"
      >
        {/* A simple street-grid drawing behind the pin; decorative only. */}
        <svg aria-hidden viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full text-berry/10">
          <path d="M0 30H200M0 75H200M0 105H200M40 0V120M110 0V120M165 0V120M0 0L200 120" fill="none" stroke="currentColor" strokeWidth="6" />
        </svg>
        <span className="relative flex flex-col items-center gap-3 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-berry text-cream shadow-lift transition-transform duration-200 group-hover:-translate-y-1 motion-reduce:transition-none">
            <MapPin aria-hidden className="size-8" strokeWidth={1.5} />
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium">
            Open in Google Maps
            <ArrowUpRight aria-hidden className="size-4" />
          </span>
        </span>
      </a>
      <div className="p-6 sm:p-8 md:col-span-3">
        <h3 className="font-display text-2xl font-medium text-ink">{contact.name}</h3>
        <address className="mt-3 text-sm not-italic leading-relaxed text-muted">{contact.address}</address>
        <ul className="mt-4 space-y-1 text-sm text-ink">
          <li className="flex min-h-11 items-center gap-3">
            <Clock aria-hidden className="size-4 shrink-0 text-berry" />
            {contact.hours.label}
          </li>
          <li>
            <a href={contact.phoneHref} className="flex min-h-11 items-center gap-3 hover:text-berry">
              <Phone aria-hidden className="size-4 shrink-0 text-berry" />
              {contact.phone}
            </a>
          </li>
          <li>
            <a href={`mailto:${contact.email}`} className="flex min-h-11 items-center gap-3 break-all hover:text-berry">
              <Mail aria-hidden className="size-4 shrink-0 text-berry" />
              {contact.email}
            </a>
          </li>
        </ul>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button href={whatsappHref} external arrow={false}>
            <WhatsAppIcon className="size-4" />
            WhatsApp
          </Button>
          <Button variant="outline" href={contact.phoneHref} arrow={false}>
            <Phone aria-hidden className="size-4" />
            Call
          </Button>
          <Button variant="outline" href={contact.mapUrl} external arrow={false}>
            <Navigation aria-hidden className="size-4" />
            Directions
          </Button>
          <Button variant="outline" href={contact.instagram.href} external arrow={false}>
            <Instagram aria-hidden className="size-4" />
            Instagram
            <span className="sr-only"> {contact.instagram.handle}</span>
          </Button>
          <Button variant="outline" href={contact.website} external rel="noopener" arrow={false} className="col-span-2">
            Visit tattoo website
            <ArrowUpRight aria-hidden className="size-4" />
          </Button>
        </div>
      </div>
    </Reveal>
  );
}
