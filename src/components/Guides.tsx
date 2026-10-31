import { useRef, useCallback, useState, type MouseEvent } from 'react';
import { ArrowRight, Check, Clock, X } from 'lucide-react';
import { useBooking } from '../context/booking';
import { guidePath, guides } from '../data/content';
import { services } from '../data/services';
import { useAutoSlide } from '../hooks/useAutoSlide';
import { cn } from '../lib/cn';
import { hasBlog } from '../lib/route';
import { whatsappLink } from '../lib/whatsapp';
import { ArrowLink, Button } from './ui/Button';
import { Floral, WhatsAppIcon } from './ui/Decor';
import { Modal } from './ui/Modal';
import { Eyebrow, Picture, Reveal } from './ui/Primitives';

type Guide = (typeof guides.items)[number];

const WORDS_PER_MINUTE = 200;
/** Minutes to read a guide's summary, counted the same way as a blog post's read time. */
const readTime = (guide: Guide) =>
  Math.max(1, Math.ceil([guide.title, guide.excerpt, ...guide.points].join(' ').split(/\s+/).length / WORDS_PER_MINUTE));

const featured = guides.items.find((guide) => guide.featured) ?? guides.items[0];
const others = guides.items.filter((guide) => guide !== featured);

// Phones show body text at 16px; the smaller size starts at tablet width.
const SMALL_TEXT = 'text-sm md:text-xs';
// Lift and zoom on hover from desktop width up only, so a tap on a phone doesn't leave a card raised.
const LIFT = 'transition duration-300 motion-reduce:transition-none lg:hover:-translate-y-1 motion-reduce:lg:hover:translate-y-0';
const ZOOM =
  'transition-transform duration-700 motion-reduce:transition-none lg:group-hover:scale-105 motion-reduce:lg:group-hover:scale-100';

function ReadTime({ guide, className }: { guide: Guide; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5', SMALL_TEXT, className)}>
      <Clock aria-hidden className="size-3.5" />
      {readTime(guide)} min read
    </span>
  );
}

interface GuideLinkProps {
  guide: Guide;
  /** Opens the guide's summary; receives the click so new-tab clicks can pass through. */
  onOpen: (e: MouseEvent<HTMLAnchorElement>, guide: Guide) => void;
}

/** The large card: photo on top, then the teaser and a "Read the guide" button. */
function FeaturedGuide({ guide, onOpen }: GuideLinkProps) {
  const href = guidePath(guide);
  return (
    <article className={cn('group flex h-full flex-col overflow-hidden rounded-card bg-cream shadow-lift', LIFT)}>
      {/* The photo fills whatever height is left on desktop; its box has a fixed shape on phones, so nothing shifts. */}
      <div className="relative aspect-guide overflow-hidden lg:aspect-auto lg:min-h-56 lg:flex-1">
        <Picture image={guide.image} className={cn('absolute inset-0 size-full object-cover', ZOOM)} />
        <span className={cn('absolute left-4 top-4 rounded-full bg-gold px-3 py-1 font-semibold text-ink', SMALL_TEXT)}>
          {guides.featuredBadge}
        </span>
      </div>
      <div className="p-5 sm:p-7">
        <p className={cn('flex flex-wrap items-center gap-x-4 gap-y-1 font-medium text-berry', SMALL_TEXT)}>
          <span className="uppercase tracking-wide">{guide.category}</span>
          <ReadTime guide={guide} className="font-normal text-muted" />
        </p>
        <h3 className="mt-2 font-display text-2xl font-medium leading-snug text-ink sm:text-3xl">
          <a
            href={href}
            title={`${guides.readLabel}: ${guide.title}`}
            aria-haspopup="dialog"
            onClick={(e) => onOpen(e, guide)}
            className="inline-flex min-h-11 items-center underline-offset-4 hover:underline"
          >
            {guide.title}
          </a>
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{guide.teaser ?? guide.excerpt}</p>
        <a
          href={href}
          aria-haspopup="dialog"
          onClick={(e) => onOpen(e, guide)}
          className="group/btn mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-berry px-6 py-3 text-sm font-medium text-cream transition duration-200 hover:bg-berrydark active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100 sm:w-auto"
        >
          {guides.readLabel}
          <span className="sr-only">: {guide.title}</span>
          <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover/btn:translate-x-1 motion-reduce:transition-none" />
        </a>
      </div>
    </article>
  );
}

/** A compact card: photo above the text in the phone carousel, beside it from tablet up. One link covers it. */
function GuideCard({ guide, onOpen }: GuideLinkProps) {
  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-card border border-cream/10 bg-cream/5 hover:border-gold/50 md:flex-row md:items-center md:gap-4 md:p-3',
        LIFT,
      )}
    >
      <div className="relative aspect-guide shrink-0 overflow-hidden md:aspect-photo md:w-32 md:rounded-lg xl:w-36">
        <Picture image={guide.image} className={cn('absolute inset-0 size-full object-cover', ZOOM)} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-4 md:p-0">
        <p className={cn('font-medium uppercase tracking-wide text-gold', SMALL_TEXT)}>{guide.category}</p>
        <h3 className="mt-1 line-clamp-2 font-display text-xl font-medium leading-snug text-cream">
          {/* The link's ::after covers the card, so the whole card is one tap target. */}
          <a href={guidePath(guide)} aria-haspopup="dialog" onClick={(e) => onOpen(e, guide)} className="after:absolute after:inset-0">
            {guide.title}
          </a>
        </h3>
        <p className="mt-auto flex items-center justify-between gap-3 pt-3 text-cream/75 md:pt-2">
          <ReadTime guide={guide} />
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-cream/10 text-gold transition-colors duration-300 lg:group-hover:bg-gold lg:group-hover:text-ink">
            <ArrowRight aria-hidden className="size-4" />
          </span>
        </p>
      </div>
    </article>
  );
}

export function Guides() {
  const booking = useBooking();
  const [openGuide, setOpenGuide] = useState<Guide | null>(null);
  // Keep the last guide rendered while the dialog animates out.
  const [shownGuide, setShownGuide] = useState<Guide>(featured);
  const close = useCallback(() => setOpenGuide(null), []);
  // Phones: the guide cards slide on by themselves until the visitor swipes them.
  const guideRow = useRef<HTMLUListElement>(null);
  useAutoSlide(guideRow, 4500);
  // A plain click opens the summary here; a new-tab click (or no JavaScript) follows the link instead.
  const open = (e: MouseEvent<HTMLAnchorElement>, guide: Guide) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    setShownGuide(guide);
    setOpenGuide(guide);
  };

  return (
    <section data-gallery id="guides" className="section on-dark bg-ink">
      <Floral className="-left-12 top-6 hidden h-72 text-gold/40 md:block" />
      <Floral flip className="-right-12 bottom-0 hidden h-72 text-gold/40 md:block" />

      <div className="container-site relative">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
          <div>
            <Eyebrow tone="dark">{guides.eyebrow}</Eyebrow>
            <h2 className="heading mt-3 text-balance text-cream">{guides.title}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cream/75 md:text-base">{guides.text}</p>
          </div>
          {hasBlog && (
            <a
              href="/blog"
              className="group/link inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-medium text-gold underline-offset-4 hover:underline"
            >
              {guides.cta}
              <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover/link:translate-x-1 motion-reduce:transition-none" />
            </a>
          )}
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
          <Reveal>
            <FeaturedGuide guide={featured} onOpen={open} />
          </Reveal>

          {/* Swipeable row on phones, two columns on tablets, one column beside the featured guide on desktop. */}
          <ul ref={guideRow} className="no-scrollbar relative -mx-4 flex min-w-0 snap-x snap-mandatory gap-4 overflow-x-auto px-4 py-1 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:p-0 lg:grid-cols-1">
            {others.map((guide, i) => (
              <li key={guide.title} className="w-3/4 shrink-0 snap-center md:w-auto">
                <Reveal delay={i * 0.06} className="h-full">
                  <GuideCard guide={guide} onOpen={open} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <Reveal className="mt-10 flex flex-col gap-5 border-t border-cream/15 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-display text-2xl font-medium text-cream">{guides.consultTitle}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="light" onClick={() => booking.open('Consultation')} className="max-md:!text-sm">
              {guides.bookLabel}
            </Button>
            <Button variant="outlineLight" href={whatsappLink(guides.whatsappText)} external arrow={false} className="max-md:!text-sm">
              <WhatsAppIcon className="size-4" />
              {guides.whatsappLabel}
            </Button>
          </div>
        </Reveal>
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
          <p className="text-eyebrow font-medium uppercase text-berry">{shownGuide.category}</p>
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
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <Button
              onClick={() => {
                close();
                booking.open('Consultation');
              }}
            >
              Book a Consultation
            </Button>
            <ArrowLink href={guidePath(shownGuide)}>More about {services[shownGuide.page].label}</ArrowLink>
          </div>
        </div>
      </Modal>
    </section>
  );
}
