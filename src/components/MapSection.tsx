import { useState } from 'react';
import { ExternalLink, MapPin } from 'lucide-react';
import { locations } from '../data/branches';
import { CTA } from '../data/style';
import { track } from '../lib/analytics';
import { cn } from '../lib/cn';
import { StatusChip } from './branch/StatusChip';
import { SalonNap } from './SalonNap';
import { Section, SectionHeader } from './service/SectionHeader';
import { Button } from './ui/Button';
import { Picture } from './ui/Primitives';

/** One map at a time, and only once asked for: a salon photo stands in until then, so no map loads with the page. */
export function MapSection() {
  const [active, setActive] = useState(0);
  const [opened, setOpened] = useState<string[]>([]);
  const salon = locations[active];
  const open = opened.includes(salon.id);

  return (
    <Section tone="tint" id="map" gallery>
      <SectionHeader eyebrow="Our Salons" title="Find Your Nearest Xing" />
      <div role="tablist" aria-label="Choose a salon" className="mt-6 grid grid-cols-3 gap-1 rounded-full bg-white p-1 md:max-w-lg">
        {locations.map((loc, i) => (
          <button key={loc.id} type="button" role="tab" aria-selected={i === active} onClick={() => setActive(i)} className={cn('min-h-11 rounded-full px-2 text-sm font-medium', i === active ? 'bg-berry text-cream' : 'text-ink')}>
            {loc.name}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <div className="relative aspect-video overflow-hidden rounded-3xl bg-blush">
          {open ? (
            <iframe src={salon.mapEmbedUrl} title={`Map of ${salon.fullName}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen className="absolute inset-0 size-full border-0" />
          ) : (
            <>
              <Picture image={salon.photos[0]} decorative sizes="(min-width: 1024px) 50vw, 100vw" className="absolute inset-0 size-full object-cover opacity-40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
                <p className="font-display text-2xl font-medium text-ink">Xing {salon.name}</p>
                <p className="text-sm text-ink">{salon.area}</p>
                <StatusChip salon={salon} />
                <Button
                  variant="outline"
                  arrow={false}
                  onClick={() => {
                    setOpened([...opened, salon.id]);
                    track('map_open', { branch: salon.id });
                  }}
                  className="bg-white"
                >
                  <MapPin aria-hidden className="size-4" />
                  Show Map
                </Button>
              </div>
            </>
          )}
        </div>
        <div>
          <SalonNap salon={salon} />
          <div className="mt-3 flex flex-wrap gap-3">
            <Button href={salon.directionsUrl} external arrow={false}>
              {CTA.directions}
            </Button>
            <Button variant="outline" href={salon.mapsUrl} external arrow={false}>
              <ExternalLink aria-hidden className="size-4" />
              View on Google
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
