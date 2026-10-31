import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/cn';

const variants = {
  primary: 'bg-berry text-cream hover:bg-berrydark',
  outline: 'border border-berry text-berry hover:bg-berry hover:text-cream',
  light: 'bg-cream text-berry hover:bg-blush',
  outlineLight: 'border border-cream/50 text-cream hover:bg-cream hover:text-ink',
} as const;

const sizes = {
  sm: 'min-h-11 px-4 py-2 text-xs md:min-h-0',
  md: 'min-h-11 px-6 py-3 text-xs sm:text-sm',
} as const;

interface ButtonProps {
  children: ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  /** Kept for older call sites: every button is pill-shaped now. */
  pill?: boolean;
  arrow?: boolean;
  /** Let a long label wrap onto two lines instead of forcing one. */
  wrap?: boolean;
  href?: string;
  /** Open `href` in a new tab. */
  external?: boolean;
  /** For external links; defaults to "noopener noreferrer". */
  rel?: string;
  type?: 'button' | 'submit';
  onClick?: () => void;
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  arrow = true,
  wrap = false,
  href,
  external = false,
  rel = 'noopener noreferrer',
  type = 'button',
  onClick,
  className,
}: ButtonProps) {
  const classes = cn(
    'group/btn inline-flex items-center justify-center gap-2 font-medium',
    wrap ? 'text-center' : 'whitespace-nowrap',
    'transition duration-200 active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100',
    'rounded-full',
    variants[variant],
    sizes[size],
    className,
  );
  const content = (
    <>
      {children}
      {arrow && (
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform duration-200 group-hover/btn:translate-x-1 motion-reduce:transition-none"
        />
      )}
    </>
  );

  return href ? (
    <a href={href} onClick={onClick} className={classes} {...(external && { target: '_blank', rel })}>
      {content}
    </a>
  ) : (
    <button type={type} onClick={onClick} className={classes}>
      {content}
    </button>
  );
}

interface ArrowLinkProps {
  children: ReactNode;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  className?: string;
}

/** Inline text link with a sliding arrow, e.g. "View All Services →". */
export function ArrowLink({ children, href, external, onClick, className }: ArrowLinkProps) {
  const classes = cn(
    'group/link inline-flex min-h-11 items-center gap-2 text-sm font-medium text-berry underline-offset-4 hover:underline md:min-h-0',
    className,
  );
  const content = (
    <>
      {children}
      <ArrowRight
        aria-hidden
        className="size-4 transition-transform duration-200 group-hover/link:translate-x-1 motion-reduce:transition-none"
      />
    </>
  );

  return href ? (
    <a href={href} onClick={onClick} className={classes} {...(external && { target: '_blank', rel: 'noopener noreferrer' })}>
      {content}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
