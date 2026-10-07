import { useCallback, useState } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';
import { useBooking } from '../context/booking';
import { guides } from '../data/content';
import { Button } from './ui/Button';
import { Floral } from './ui/Decor';
import { Modal } from './ui/Modal';
import { Picture, Reveal, SectionIntro } from './ui/Primitives';

type Guide = (typeof guides.items)[number];

function GuideCard({ guide, onOpen }: { guide: Guide; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="group relative block aspect-guide w-full overflow-hidden rounded-card text-left"
    >
      <Picture
        image={guide.image}
        decorative
        className="size-full object-cover transition-transform duration-700 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 transition-colors duration-300 group-hover:via-ink/50" />
      <span className="absolute bottom-3 left-3 max-w-2/3 rounded-md bg-cream px-3 py-2 text-xs font-medium leading-snug text-ink shadow-soft">
        {guide.title}
      </span>
      <span className="absolute inset-x-3 top-3 translate-y-2 text-xs leading-relaxed text-cream opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none">
        {guide.excerpt}
      </span>
      <span className="absolute bottom-3 right-3 grid size-8 place-items-center rounded-full bg-cream text-berry transition duration-300 group-hover:bg-berry group-hover:text-cream">
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform duration-300 group-hover:-rotate-45 motion-reduce:transition-none"
        />
      </span>
    </button>
  );
}

export function Guides() {
  const booking = useBooking();
  const [openGuide, setOpenGuide] = useState<Guide | null>(null);
  // Keep the last guide rendered while the dialog animates out.
  const [shownGuide, setShownGuide] = useState<Guide>(guides.items[0]);
  const close = useCallback(() => setOpenGuide(null), []);
  const show = (guide: Guide) => {
    setShownGuide(guide);
    setOpenGuide(guide);
  };

  return (
    <section id="guides" className="section on-dark bg-ink">
      <Floral className="-left-12 top-6 hidden h-72 text-gold/40 md:block" />
      <Floral flip className="-right-12 bottom-0 hidden h-72 text-gold/40 md:block" />

      <div className="container-site relative grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
        <SectionIntro
          tone="dark"
          eyebrow={guides.eyebrow}
          title={guides.title}
          text={guides.text}
          className="lg:col-span-4"
        >
          <Button variant="light" pill onClick={() => show(guides.items[0])}>
            {guides.cta}
          </Button>
        </SectionIntro>

        {/* Swipeable row on phones, 3×2 grid from tablet up. */}
        <ul className="no-scrollbar -mx-4 flex min-w-0 snap-x snap-mandatory gap-4 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 lg:col-span-8">
          {guides.items.map((guide, i) => (
            <li key={guide.title} className="w-4/5 shrink-0 snap-center xs:w-3/4 md:w-auto">
              <Reveal delay={i * 0.06}>
                <GuideCard guide={guide} onOpen={() => show(guide)} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      <Modal open={openGuide !== null} onClose={close} labelledBy="guide-title">
        <div className="relative">
          <Picture image={shownGuide.image} className="aspect-banner w-full object-cover" />
          <button
            type="button"
            aria-label="Close guide"
            onClick={close}
            className="absolute right-3 top-3 grid size-11 place-items-center rounded-full bg-cream text-ink shadow-soft hover:text-berry"
          >
            <X aria-hidden className="size-4" />
          </button>
        </div>
        <div className="p-6 sm:p-8">
          <p className="text-eyebrow font-medium uppercase text-berry">{guides.eyebrow}</p>
          <h3 id="guide-title" className="mt-2 font-display text-3xl font-medium text-ink">
            {shownGuide.title}
          </h3>
          <p className="mt-2 text-sm text-muted">{shownGuide.excerpt}</p>
          <ul className="mt-5 space-y-3">
            {shownGuide.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-ink">
                <Check aria-hidden className="mt-1 size-4 shrink-0 text-berry" />
                {point}
              </li>
            ))}
          </ul>
          <Button
            className="mt-6"
            onClick={() => {
              close();
              booking.open('Consultation');
            }}
          >
            Book a Consultation
          </Button>
        </div>
      </Modal>
    </section>
  );
}
