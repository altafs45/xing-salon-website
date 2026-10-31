import { ArrowDown, ChevronRight, Star } from 'lucide-react';
import { gmPage } from '../../data/giftMembership';
import { cn } from '../../lib/cn';
import { PRIMARY, scrollToId, SECONDARY } from './shared';

const { hero } = gmPage;
const srcSet = (ext: string) => hero.image.widths.map((w) => `${hero.image.base}-${w}.${ext} ${w}w`).join(', ');

/** Never animated in: everything here is visible from the first paint. */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-gradient-to-b from-blush to-cream pt-header-sm lg:pt-header">
      <div className="container-site grid gap-x-12 gap-y-6 pb-12 pt-4 lg:grid-cols-2 lg:items-center lg:pb-20 lg:pt-10">
        <div className="min-w-0">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1 text-sm text-muted">
              <li>
                <a href="/" className="inline-flex min-h-11 min-w-11 items-center underline-offset-4 hover:text-berry hover:underline">
                  Home
                </a>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-4" />
              </li>
              <li aria-current="page" className="font-medium text-ink">
                Gift Cards & Membership
              </li>
            </ol>
          </nav>
          <p className="mt-2 text-eyebrow font-medium uppercase text-berry">{hero.eyebrow}</p>
          <h1 id="hero-title" className="mt-3 text-balance font-display text-[2.125rem] font-medium leading-[1.1] text-ink sm:text-hero">
            {hero.h1}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">{hero.sub}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="#membership"
              onClick={(e) => {
                e.preventDefault();
                scrollToId('membership');
              }}
              className={cn(PRIMARY, 'w-full sm:w-auto')}
            >
              {hero.primary}
              <ArrowDown aria-hidden className="size-4" />
            </a>
            <a
              href="#gift-cards"
              onClick={(e) => {
                e.preventDefault();
                scrollToId('gift-cards');
              }}
              className={cn(SECONDARY, 'w-full bg-white/60 sm:w-auto')}
            >
              {hero.secondary}
              <ArrowDown aria-hidden className="size-4" />
            </a>
          </div>
          <ul aria-label="Why XING" className="mt-6 flex flex-wrap gap-2">
            {hero.trust.map((chip, i) => (
              <li key={chip} className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-berry/15 bg-white/80 px-3 text-sm font-medium text-ink">
                {i === 0 && <Star aria-hidden className="size-4 fill-current text-golddeep" />}
                {chip}
              </li>
            ))}
          </ul>
        </div>

        <picture className="mx-auto block w-full max-w-[373px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-none">
          <source type="image/avif" srcSet={srcSet('avif')} sizes={hero.image.sizes} />
          <img
            src={`${hero.image.base}-768.webp`}
            srcSet={srcSet('webp')}
            sizes={hero.image.sizes}
            alt={hero.image.alt}
            width={hero.image.width}
            height={hero.image.height}
            loading="eager"
            decoding="async"
            {...({ fetchpriority: 'high' } as Record<string, string>)}
            className="aspect-[4/3] h-auto w-full rounded-3xl object-cover shadow-lift"
          />
        </picture>

        {/* Answers "What gift cards and memberships does XING offer?" for voice assistants (speakable schema). */}
        <p id="hero-summary" className="max-w-xl text-sm leading-relaxed text-muted max-lg:line-clamp-3 lg:col-start-1">
          {hero.summary}
        </p>
      </div>
    </section>
  );
}
