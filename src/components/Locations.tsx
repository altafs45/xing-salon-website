import { useState } from 'react';
import { Camera, ChevronLeft, ChevronRight, Clock, Mail, Phone } from 'lucide-react';
import { locations, locationsSection, site, type Img } from '../data/content';
import { useOpenNow } from '../hooks/useOpenNow';
import { cn } from '../lib/cn';
import { useBooking } from '../context/booking';
import { ArrowLink, Button } from './ui/Button';
import { Eyebrow, Picture, Reveal } from './ui/Primitives';

const ARROW_CLASSES =
  'absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-cream/90 text-berry shadow-soft transition hover:bg-berry hover:text-cream active:scale-90';

/** Photo gallery for a location card; falls back to a "coming soon" panel when a salon has no photos yet. */
function Gallery({ photos, name }: { photos: Img[]; name: string }) {
  const [index, setIndex] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="flex aspect-photo flex-col items-center justify-center gap-2 bg-gradient-to-br from-blush to-cream text-muted">
        <Camera aria-hidden className="size-7 text-berry/60" strokeWidth={1.5} />
        <p className="text-xs">{locationsSection.photosPending}</p>
      </div>
    );
  }

  const step = (delta: number) => setIndex((index + delta + photos.length) % photos.length);

  return (
    <div role="group" aria-roledescription="carousel" aria-label={`${name} salon photos`} className="relative aspect-photo overflow-hidden">
      {photos.map((photo, i) => (
        <div
          key={photo.src}
          aria-hidden={i !== index}
          className={cn(
            'absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none',
            i === index ? 'opacity-100' : 'opacity-0',
          )}
        >
          <Picture image={photo} className="size-full object-cover" />
        </div>
      ))}
      {photos.length > 1 && (
        <>
          <button type="button" aria-label={`Previous ${name} photo`} onClick={() => step(-1)} className={cn(ARROW_CLASSES, 'left-2')}>
            <ChevronLeft aria-hidden className="size-4" />
          </button>
          <button type="button" aria-label={`Next ${name} photo`} onClick={() => step(1)} className={cn(ARROW_CLASSES, 'right-2')}>
            <ChevronRight aria-hidden className="size-4" />
          </button>
          <p aria-live="polite" className="absolute bottom-2 right-2 rounded-full bg-ink/70 px-2.5 py-0.5 text-xs tabular-nums text-cream">
            <span className="sr-only">Photo </span>
            {index + 1} / {photos.length}
          </p>
        </>
      )}
    </div>
  );
}

export function Locations() {
  const openNow = useOpenNow();
  const booking = useBooking();

  return (
    <section id="locations" className="section bg-blush">
      <div className="container-site">
        <Reveal className="flex flex-wrap items-center justify-between gap-4">
          <Eyebrow as="h2">{locationsSection.eyebrow}</Eyebrow>
          <ArrowLink href={locationsSection.allUrl} external>
            {locationsSection.cta}
          </ArrowLink>
        </Reveal>

        <ul className="mt-6 grid gap-6 md:grid-cols-3">
          {locations.map((loc, i) => (
            <li key={loc.id}>
              <Reveal delay={i * 0.08} className="h-full">
                <article className="flex h-full flex-col overflow-hidden rounded-card bg-cream shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                  <div className="relative">
                    <Gallery photos={loc.photos} name={loc.name} />
                    <span
                      className={cn(
                        'absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-cream',
                        openNow ? 'bg-success' : 'bg-ink/80',
                      )}
                    >
                      <span aria-hidden className={cn('size-1.5 rounded-full bg-cream', openNow && 'motion-safe:animate-pulse')} />
                      {openNow ? 'Open now' : 'Closed'}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-base font-semibold text-ink">{loc.name}</h3>
                    <address className="mt-1 text-sm not-italic text-muted">{loc.address}</address>
                    <ul className="mt-3 flex-1 space-y-1.5 text-sm text-muted">
                      <li className="flex items-start gap-2">
                        <Clock aria-hidden className="mt-0.5 size-3.5 shrink-0 text-berry" />
                        Open {site.hours.label}, {site.hours.days}
                      </li>
                      <li>
                        <a href={loc.phoneHref} className="inline-flex min-h-11 items-center gap-2 text-ink hover:text-berry md:min-h-0">
                          <Phone aria-hidden className="size-3.5 shrink-0 text-berry" />
                          {loc.phone}
                        </a>
                      </li>
                      {loc.email && (
                        <li>
                          <a href={`mailto:${loc.email}`} className="inline-flex min-h-11 items-center gap-2 break-all text-ink hover:text-berry md:min-h-0">
                            <Mail aria-hidden className="size-3.5 shrink-0 text-berry" />
                            {loc.email}
                          </a>
                        </li>
                      )}
                    </ul>
                    <Button size="sm" onClick={() => booking.open('', loc.name)} className="mt-4 w-full">
                      {locationsSection.bookLabel} {loc.name}
                    </Button>
                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-ink/10 pt-4 text-xs">
                      <ArrowLink href={loc.whatsappHref} external className="text-xs">
                        {locationsSection.whatsappLabel}
                        <span className="sr-only"> — {loc.name}</span>
                      </ArrowLink>
                      <ArrowLink href={loc.mapUrl} external className="text-xs">
                        {locationsSection.viewLabel}
                        <span className="sr-only"> — {loc.name}</span>
                      </ArrowLink>
                      <ArrowLink href={loc.directionsUrl} external className="text-xs">
                        {locationsSection.directionsLabel}
                        <span className="sr-only"> to {loc.name}</span>
                      </ArrowLink>
                    </div>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
