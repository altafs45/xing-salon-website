import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { m, useAnimationControls } from 'framer-motion';
import type { Img } from '../../data/content';
import { cn } from '../../lib/cn';
import { isPrerender } from '../../lib/prerender';

interface EyebrowProps {
  children: ReactNode;
  as?: 'p' | 'h2' | 'h3';
  tone?: 'light' | 'dark';
  className?: string;
}

/** Small uppercase, letter-spaced label that sits above headings. */
export function Eyebrow({ children, as: Tag = 'p', tone = 'light', className }: EyebrowProps) {
  return (
    <Tag
      className={cn(
        'font-sans text-eyebrow font-medium uppercase',
        tone === 'light' ? 'text-berry' : 'text-gold',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

interface RevealProps {
  children: ReactNode;
  delay?: number;
  from?: 'bottom' | 'left' | 'right';
  className?: string;
}

// Side reveals rise too: starting 28px to one side pushed content past the 16px phone gutter, out of the screen.
const offsets = {
  bottom: { y: 28 },
  left: { y: 20 },
  right: { y: 20 },
} as const;

/** Fades and slides its children in the first time they scroll into view. */
export function Reveal({ children, delay = 0, from = 'bottom', className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();

  // Only what starts below the screen waits to come in: anything already in view stays put, so the prerendered
  // page doesn't blink as the app takes over.
  useLayoutEffect(() => {
    if (!isPrerender && ref.current!.getBoundingClientRect().top >= window.innerHeight) controls.set({ opacity: 0, ...offsets[from] });
  }, [controls, from]);

  return (
    <m.div
      ref={ref}
      className={className}
      initial={false}
      animate={controls}
      onViewportEnter={() => controls.start({ opacity: 1, x: 0, y: 0, transition: { duration: 0.6, delay, ease: 'easeOut' } })}
      // Vertical margin only: a card peeking in from the side of a swipeable row should already be visible.
      viewport={{ once: true, margin: '-60px 0px' }}
    >
      {children}
    </m.div>
  );
}

interface PictureProps {
  image: Img;
  eager?: boolean;
  /** Decorative images get an empty alt so screen readers skip them. */
  decorative?: boolean;
  /** Display width for images that have a `srcSet`, e.g. "100vw". */
  sizes?: string;
  /** The page's main image: fetched ahead of everything else. */
  priority?: boolean;
  className?: string;
}

/** Image with intrinsic size set (no layout shift) and lazy loading by default. */
export function Picture({ image, eager = false, decorative = false, sizes, priority = false, className }: PictureProps) {
  const img = (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={image.srcSet ? sizes : undefined}
      alt={decorative ? '' : image.alt}
      aria-hidden={decorative || undefined}
      width={image.width}
      height={image.height}
      loading={eager ? 'eager' : 'lazy'}
      // Lower-case, as React 18 passes it to the HTML unchanged.
      {...(priority && ({ fetchpriority: 'high' } as Record<string, string>))}
      decoding="async"
      draggable={false}
      className={className}
    />
  );
  if (!image.avifSrcSet) return img;
  return (
    <picture className="contents">
      <source type="image/avif" srcSet={image.avifSrcSet} sizes={sizes} />
      {img}
    </picture>
  );
}

interface SectionIntroProps {
  eyebrow: string;
  title: ReactNode;
  text?: string;
  tone?: 'light' | 'dark';
  children?: ReactNode;
  className?: string;
}

/** The eyebrow + heading + copy + CTA block used on the left of most sections. */
export function SectionIntro({ eyebrow, title, text, tone = 'light', children, className }: SectionIntroProps) {
  const dark = tone === 'dark';
  return (
    <Reveal from="left" className={className}>
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <h2 className={cn('heading mt-3 text-balance', dark ? 'text-cream' : 'text-ink')}>{title}</h2>
      {text && <p className={cn('mt-4 max-w-md text-sm leading-relaxed', dark ? 'text-cream/75' : 'text-muted')}>{text}</p>}
      {children && <div className="mt-6">{children}</div>}
    </Reveal>
  );
}
