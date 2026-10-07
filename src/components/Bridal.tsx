import { useBooking } from '../context/booking';
import { bridal } from '../data/content';
import { Button } from './ui/Button';
import { Eyebrow, Picture, Reveal } from './ui/Primitives';

export function Bridal() {
  const booking = useBooking();

  return (
    <section id="bridal" className="on-dark relative overflow-hidden bg-ink">
      {/* Image fills the right side on desktop and sits behind the copy on small screens. */}
      <div className="absolute inset-0 overflow-hidden md:left-1/3">
        <Picture image={bridal.image} className="size-full object-cover motion-safe:animate-kenburns" />
        <div className="absolute inset-0 bg-ink/70 md:bg-transparent md:bg-gradient-to-r md:from-ink md:via-ink/40 md:to-ink/20" />
      </div>

      <div className="container-site relative grid items-center gap-8 py-section md:grid-cols-12">
        <Reveal from="left" className="md:col-span-7 lg:col-span-6">
          <Eyebrow tone="dark">{bridal.eyebrow}</Eyebrow>
          <h2 className="heading mt-3 text-cream">
            {bridal.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <ul className="mt-5 flex max-w-md flex-wrap gap-x-3 gap-y-1 text-sm text-cream/90">
            {bridal.services.map((service, i) => (
              <li key={service} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden className="size-1 rounded-full bg-gold" />}
                {service}
              </li>
            ))}
          </ul>
          <Button variant="light" pill onClick={() => booking.open(bridal.bookAs)} className="mt-7">
            {bridal.cta}
          </Button>
        </Reveal>

        <Reveal from="right" className="hidden md:col-span-5 md:block lg:col-span-6">
          <p aria-hidden className="-rotate-6 text-right font-script text-5xl leading-tight text-cream drop-shadow-md lg:text-6xl">
            {bridal.script.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
