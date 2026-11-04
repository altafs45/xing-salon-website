import { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { locations } from '../data/branches';
import { CTA } from '../data/style';
import { track } from '../lib/analytics';
import { cn } from '../lib/cn';
import { SalonNap } from './SalonNap';
import { Section, SectionHeader } from './service/SectionHeader';
import { Button } from './ui/Button';

/** The salons on a map, one at a time: a tab per salon, its map, its details and the ways to get there. */
export function MapSection() {
  const [active, setActive] = useState(0);
  const salon = locations[active];
  const box = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), { rootMargin: '100% 0px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Section tone="tint" id="map" gallery>
      <SectionHeader eyebrow="Our Salons" title="Find Your Nearest Xing" />
      <div role="tablist" aria-label="Choose a salon" className="mt-6 grid grid-cols-3 gap-1 rounded-full bg-white p-1 md:max-w-lg">
        {locations.map((loc, i) => (
          <button key={loc.id} type="button" role="tab" aria-selected={i === active} onClick={() => {
              setActive(i);
              track('map_open', { branch: loc.id });
            }} className={cn('min-h-11 rounded-full px-2 text-sm font-medium', i === active ? 'bg-berry text-cream' : 'text-ink')}>
            {loc.name}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        {/* The map loads by itself, with no click, once it is a screen away: it is not in the page's HTML, so it
            never slows the first paint. Only the chosen salon's map is mounted; its fixed 16:9 box keeps the page
            from moving while it loads. */}
        <div ref={box} className="relative aspect-video overflow-hidden rounded-3xl bg-blush">
          {near && (
            <iframe
              key={salon.id}
              src={salon.mapEmbedUrl}
              title={`Map of ${salon.fullName}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 size-full border-0"
            />
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
