import { useBooking } from '../context/booking';
import { offers } from '../data/content';
import { Button } from './ui/Button';
import { Floral } from './ui/Decor';
import { Picture, Reveal, SectionIntro } from './ui/Primitives';
import { SnapRow } from './ui/SnapRow';

export function Offers() {
  const booking = useBooking();

  return (
    <section id="offers" className="section on-dark bg-berry">
      <Floral className="-left-14 bottom-0 hidden h-72 text-cream/25 md:block" />
      <Floral flip className="-right-14 top-0 hidden h-72 text-cream/25 md:block" />

      <div className="container-site relative grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
        <SectionIntro tone="dark" eyebrow={offers.eyebrow} title={offers.title} text={offers.text} className="lg:col-span-3">
          <Button variant="light" pill href="#locations">
            {offers.cta}
          </Button>
        </SectionIntro>

        <div className="min-w-0 lg:col-span-9">
          <SnapRow tone="dark" className="md:grid-cols-4 lg:gap-5">
            {offers.items.map((offer, i) => (
                <Reveal key={offer.service} delay={i * 0.08} className="h-full">
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-card bg-cream shadow-soft transition duration-300 hover:-translate-y-1.5 hover:shadow-lift motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                    <Picture image={offer.image} className="aspect-photo w-full object-cover" />
                    {/* Shimmer sweep */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent motion-safe:group-hover:animate-shimmer"
                    />
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="text-xs font-medium text-ink sm:text-sm">{offer.service}</h3>
                      <p className="mt-1 font-display text-2xl font-medium lining-nums text-berry sm:text-3xl">{offer.deal}</p>
                      <p className="mt-1 flex-1 text-xs leading-relaxed text-muted">{offer.terms}</p>
                      <Button size="sm" onClick={() => booking.open(offer.bookAs)} className="mt-3 self-start">
                        {offers.bookLabel}
                        <span className="sr-only"> — {offer.service}</span>
                      </Button>
                    </div>
                  </article>
                </Reveal>
            ))}
          </SnapRow>
          <p className="mt-6 text-center text-sm text-cream/90">{offers.note}</p>
        </div>
      </div>
    </section>
  );
}
