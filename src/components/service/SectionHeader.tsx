import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Eyebrow, Reveal } from '../ui/Primitives';

export type Tone = 'white' | 'tint';

interface SectionProps {
  tone: Tone;
  id?: string;
  children: ReactNode;
  className?: string;
  /** A gallery or swipe row: its length isn't held to the text budget. */
  gallery?: boolean;
}

/** Service-page section: roomy padding and an alternating background. Kids pages get a wavy top edge. */
export function Section({ tone, id, children, className, gallery = false }: SectionProps) {
  return (
    <section id={id} data-gallery={gallery || undefined} className={cn('relative py-14 lg:py-24', tone === 'tint' ? 'bg-blush' : 'bg-cream', className)}>
      {/* Drawn in the colour of the section above, so the two backgrounds meet in a wave. */}
      <svg
        aria-hidden
        viewBox="0 0 1200 24"
        preserveAspectRatio="none"
        className={cn(
          'absolute inset-x-0 top-0 hidden h-6 w-full group-data-[theme=kids]/page:block',
          tone === 'tint' ? 'text-cream' : 'text-blush',
        )}
      >
        <path fill="currentColor" d="M0 0H1200V10C1100 26 1000 26 900 10S700-6 600 10 400 26 300 10 100-6 0 10Z" />
      </svg>
      <div className="container-site">{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  text?: string;
  align?: 'left' | 'center';
  /** `dark` is for headers placed on a brand-coloured panel. */
  tone?: 'light' | 'dark';
  children?: ReactNode;
  className?: string;
}

/** Longer intros stop at three lines on phones. The whole text stays in the HTML. */
const INTRO_WORDS = 25;

/** Eyebrow, H2 and an optional one-line subtitle. */
export function SectionHeader({ eyebrow, title, text, align = 'left', tone = 'light', children, className }: SectionHeaderProps) {
  const dark = tone === 'dark';
  return (
    <Reveal className={cn(align === 'center' && 'mx-auto max-w-3xl text-center', className)}>
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <h2 className={cn('heading mt-3 text-balance', dark ? 'text-cream' : 'text-ink')}>{title}</h2>
      {text && (
        <p className={cn('mt-4 max-w-2xl text-sm leading-relaxed sm:text-base', align === 'center' && 'mx-auto', dark ? 'text-cream/90' : 'text-muted', text.split(/s+/).length > INTRO_WORDS && 'max-sm:line-clamp-3')}>
          {text}
        </p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </Reveal>
  );
}
