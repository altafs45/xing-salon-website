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

export function Logo({ tone = 'light', className }: { tone?: 'light' | 'dark'; className?: string }) {
  return (
    <a
      href={isHome ? '#home' : '/'}
      aria-label={`${site.name} ${site.tagline} — home`}
      className={cn('inline-flex min-h-11 shrink-0 items-center', className)}
    >
      <img
        src={tone === 'light' ? site.logo.src : site.logo.lightSrc}
        alt=""
        width={site.logo.width}
        height={site.logo.height}
        className="h-11 w-auto"
      />
    </a>
  );
}

/** Brand glyphs that Lucide does not ship. */
export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.200 8.200 0 0 1-4.200-1.150l-.3-.18-2.970.78.800-2.900-.200-.300A8.200 8.200 0 1 1 12 20.200Zm4.500-6.140c-.250-.120-1.460-.720-1.690-.800-.230-.080-.390-.120-.560.120-.160.250-.640.800-.780.970-.140.160-.290.180-.530.060a6.700 6.700 0 0 1-1.980-1.220 7.400 7.400 0 0 1-1.370-1.700c-.140-.250-.020-.380.110-.500.110-.110.250-.290.370-.430.120-.140.160-.250.250-.410.080-.160.040-.310-.020-.430-.060-.120-.560-1.340-.760-1.830-.200-.480-.400-.420-.560-.420h-.470a.900.900 0 0 0-.660.310c-.230.250-.860.840-.860 2.050s.880 2.380 1 2.540c.120.160 1.740 2.650 4.210 3.720.590.250 1.050.400 1.400.520.590.190 1.130.160 1.550.100.470-.070 1.460-.600 1.670-1.170.200-.580.200-1.070.140-1.170-.060-.110-.220-.170-.470-.290Z" />
    </svg>
  );
}

export function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M8.5 20.500 11.500 9" />
      <path d="M10.700 14c.440 1 1.250 1.500 2.300 1.500 2.200 0 3.500-2.100 3.500-4.300A4.200 4.200 0 0 0 12 7c-2.700 0-4.500 1.900-4.500 4.100 0 .900.300 1.700.900 2.200" />
    </svg>
  );
}
