import { site } from '../../data/content';
import { cn } from '../../lib/cn';
import { isHome } from '../../lib/route';

const LEAVES: Array<[x: number, y: number, angle: number, scale: number]> = [
  [44, 350, -150, 0.9],
  [50, 318, -25, 1],
  [50, 280, -160, 1],
  [58, 236, -30, 1.15],
  [74, 196, -165, 1],
  [96, 158, -40, 1.1],
  [116, 122, -175, 0.9],
  [132, 84, -55, 1],
  [136, 44, -150, 0.8],
];

const BLOSSOMS: Array<[x: number, y: number, scale: number]> = [
  [150, 196, 1],
  [22, 232, 0.8],
  [134, 6, 0.9],
];

const PETAL_ANGLES = [0, 72, 144, 216, 288];

/** Thin floral line-art branch. Colour comes from `currentColor`; position it with className. */
export function Floral({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 400"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      className={cn('pointer-events-none absolute select-none', flip && '-scale-x-100', className)}
    >
      <path d="M40 400 C 62 320, 30 250, 80 180 S 150 80, 132 0" />
      <path d="M80 180 C 104 186, 128 190, 150 196" />
      <path d="M52 262 C 40 252, 30 242, 22 232" />
      {LEAVES.map(([x, y, angle, scale], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
          <path d="M0 0 C 14 -11, 40 -12, 56 0 C 40 12, 14 11, 0 0 Z" />
          <path d="M0 0 L 50 0" />
        </g>
      ))}
      {BLOSSOMS.map(([x, y, scale], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${scale})`}>
          {PETAL_ANGLES.map((angle) => (
            <path key={angle} transform={`rotate(${angle})`} d="M0 0 C -10 -10, -9 -26, 0 -30 C 9 -26, 10 -10, 0 0 Z" />
          ))}
          <circle r="3" />
        </g>
      ))}
    </svg>
  );
}

interface LogoProps {
  /** `dark` is for dark backgrounds, where the light version of the logo is used. */
  tone?: 'light' | 'dark';
  /** The header's logo is on the first screen, so it loads at once; others wait until they are near. */
  priority?: boolean;
  /** Height classes; the width always follows the logo's own proportions. */
  size?: string;
  className?: string;
}

/**
 * The salon's logo, linking home (to the top of the page when already there). The image's width and height
 * are set, so nothing moves when it loads, and the link is at least 44px tall to tap.
 */
export function Logo({ tone = 'light', priority = false, size = 'h-9 lg:h-11', className }: LogoProps) {
  const dark = tone === 'dark';
  return (
    <a href={isHome ? '#home' : '/'} aria-label={`${site.fullName} — Home`} className={cn('inline-flex min-h-11 shrink-0 items-center', className)}>
      <img
        src={dark ? site.logo.lightSrc : site.logo.src}
        srcSet={dark ? site.logo.lightSrcSet : site.logo.srcSet}
        alt={site.fullName}
        width={site.logo.width}
        height={site.logo.height}
        loading={priority ? 'eager' : 'lazy'}
        {...(priority && { fetchpriority: 'high' })}
        decoding="async"
        className={cn(size, 'w-auto')}
      />
    </a>
  );
}


export { WhatsAppIcon } from './WhatsAppIcon';
