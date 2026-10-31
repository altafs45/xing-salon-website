// Building blocks shared by the gift cards & membership page sections and its lead form.
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Minus, Plus, Star } from 'lucide-react';
import { facts } from '../../data/giftMembership';
import { cn } from '../../lib/cn';
import type { LeadType } from '../../shared/leadSchema';

const PILL =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-base font-semibold transition duration-200 active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100 md:text-sm';
/** The one main action on a screen. */
export const PRIMARY = cn(PILL, 'bg-berry text-cream hover:bg-berrydark');
export const SECONDARY = cn(PILL, 'border border-berry text-berry hover:bg-berry hover:text-cream');
export const ON_DARK = cn(PILL, 'border border-cream/70 text-cream hover:bg-cream hover:text-ink');
export const WHATSAPP = cn(PILL, 'bg-success text-cream hover:brightness-110');

/** What a call to action asks the form to open with. */
export interface LeadRequest {
  type: LeadType;
  product: string;
}

const LeadFormContext = createContext<(request: LeadRequest) => void>(() => undefined);
export const LeadFormProvider = LeadFormContext.Provider;
/** Opens the lead form, prefilled. */
export const useOpenLeadForm = () => useContext(LeadFormContext);

/** Smooth-scrolls to a section, or jumps for visitors who prefer reduced motion. */
export function scrollToId(id: string) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

/**
 * Fades its content in as it scrolls into view, for sections below the fold. Content is visible by default;
 * it is hidden only after this script runs (see `.reveal-ready` in index.css), so it shows even without it.
 */
export function FadeIn({ children, className, as: Tag = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'li' }) {
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('reveal-ready');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.seen = '';
        observer.disconnect();
      },
      { rootMargin: '0px 0px -40px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <Tag ref={ref} data-reveal="" className={className}>
      {children}
    </Tag>
  );
}

/** "4.9★ · 2,264+ Google reviews", next to the calls to action. */
export function Proof({ tone = 'light', className }: { tone?: 'light' | 'dark'; className?: string }) {
  return (
    <p className={cn('flex items-center justify-center gap-1.5 text-sm', tone === 'dark' ? 'text-cream/90' : 'text-muted', className)}>
      <Star aria-hidden className={cn('size-4 fill-current', tone === 'dark' ? 'text-gold' : 'text-golddeep')} />
      {facts.proof}
    </p>
  );
}

/** A section heading block: optional eyebrow, the H2 and an optional line under it. */
export function Heading({ id, eyebrow, title, sub, align = 'center', className }: { id?: string; eyebrow?: string; title: string; sub?: string; align?: 'center' | 'left'; className?: string }) {
  return (
    <div className={cn(align === 'center' && 'mx-auto max-w-3xl text-center', className)}>
      {eyebrow && <p className="text-eyebrow font-medium uppercase text-berry">{eyebrow}</p>}
      <h2 id={id} className={cn('heading text-balance text-ink', eyebrow && 'mt-3')}>
        {title}
      </h2>
      {sub && <p className={cn('mt-4 text-base leading-relaxed text-muted', align === 'center' && 'mx-auto max-w-2xl')}>{sub}</p>}
    </div>
  );
}

interface QAListProps {
  items: ReadonlyArray<{ q: string; a: string }>;
  idPrefix: string;
  /** The item open at first; null starts with all closed. */
  defaultOpen?: number | null;
  /** Class on each answer, e.g. "faq-answer" for the speakable schema. */
  answerClass?: string;
}

/**
 * Questions and answers, one open at a time. Every answer stays in the page (closed ones are `hidden`), so
 * search engines and in-page search see them all.
 */
export function QAList({ items, idPrefix, defaultOpen = 0, answerClass }: QAListProps) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  return (
    <ul className="divide-y divide-ink/10">
      {items.map((item, i) => {
        const expanded = open === i;
        return (
          <li key={item.q}>
            <h3>
              <button
                type="button"
                id={`${idPrefix}-q-${i}`}
                aria-expanded={expanded}
                aria-controls={`${idPrefix}-a-${i}`}
                onClick={() => setOpen(expanded ? null : i)}
                className="flex min-h-14 w-full items-center gap-3 py-3 text-left text-base font-medium text-ink hover:text-berry"
              >
                <span className="flex-1">{item.q}</span>
                {expanded ? <Minus aria-hidden className="size-5 shrink-0 text-berry" /> : <Plus aria-hidden className="size-5 shrink-0 text-berry" />}
              </button>
            </h3>
            <div id={`${idPrefix}-a-${i}`} role="region" aria-labelledby={`${idPrefix}-q-${i}`} hidden={!expanded}>
              <p className={cn('pb-5 pr-8 text-base leading-relaxed text-muted', answerClass)}>{item.a}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
