import { SalonNap } from '../SalonNap';
import { ArrowRight, ArrowUpRight, Clock, Instagram, Mail, Navigation, Phone } from 'lucide-react';
import { locations, mapEmbed } from '../../data/branches';
import type { StudioContact } from '../../data/pages/types';
import { cn } from '../../lib/cn';
import { whatsappLink } from '../../lib/whatsapp';
import { Button } from '../ui/Button';
import { WhatsAppIcon } from '../ui/Decor';
import { Picture, Reveal } from '../ui/Primitives';

/** One compact card per salon, each with its own WhatsApp and Directions, linking to its full details on /about. */
export function LocationCards({ whatsappText }: { whatsappText: string }) {
  return (
    <ul data-swipe className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0">
      {locations.map((loc, i) => (
        <li key={loc.id} className="w-[84%] shrink-0 snap-start md:w-auto">
          <Reveal delay={i * 0.06} className="h-full">
            <article className="svc-card svc-card-hover flex h-full flex-col overflow-hidden">
              {loc.photos[0] ? (
                <Picture image={loc.photos[0]} className="aspect-guide w-full object-cover" />
              ) : (
                // No photo yet: show where the salon is instead.
                <MapPanel embedUrl={loc.mapEmbedUrl} label={loc.fullName} className="!aspect-guide md:!min-h-0" />
              )}
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="font-display text-xl font-medium text-ink">{loc.name}</h3>
                <SalonNap salon={loc} className="mt-2 flex-1" />
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
                <a href={loc.path} className="group mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-berry">
                  More about this salon
                  <span className="sr-only">: {loc.name}</span>
                  <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-1.5 motion-reduce:transition-none" />
                </a>
              </div>
            </article>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

/**
 * A live Google Map of one place. Google's own "Open in Maps" link sits on the map, so nothing is drawn
 * over it. The map loads lazily, only as it nears the screen, so it doesn't slow the first paint.
 */
function MapPanel({ embedUrl, label, className }: { embedUrl: string; label: string; className?: string }) {
  return (
    <div className={cn('relative aspect-video bg-blush md:aspect-auto md:min-h-80', className)}>
      <iframe
        src={embedUrl}
        title={`Map showing ${label}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="absolute inset-0 size-full border-0"
      />
    </div>
  );
}

/** A single venue with its own contact details (e.g. the tattoo studio). */
export function StudioCard({ contact, whatsappHref }: { contact: StudioContact; whatsappHref: string }) {
  return (
    <Reveal className="svc-card mt-10 grid overflow-hidden md:grid-cols-5">
      <MapPanel embedUrl={mapEmbed(`${contact.name}, ${contact.address}`)} label={contact.name} className="md:col-span-2" />
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
