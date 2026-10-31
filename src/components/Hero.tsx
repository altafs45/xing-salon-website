import { useId, type MouseEvent } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { Check, MapPin, ShieldCheck, Sparkles, Star, UserRoundCheck } from 'lucide-react';
import { useBooking } from '../context/booking';
import { hero, HERO_SIZES } from '../data/content';
import { bookingWhatsappHref } from '../lib/whatsapp';
import { wasPrerendered } from '../lib/prerender';
import { Button } from './ui/Button';
import { Floral, WhatsAppIcon } from './ui/Decor';
import { Eyebrow, Picture } from './ui/Primitives';

const TRUST_ICONS = { star: Star, expert: UserRoundCheck, shield: ShieldCheck, pin: MapPin } as const;

// How far (px) each layer drifts as the pointer crosses the hero.
const PARALLAX = { image: -14, arch: 18, badge: 26 } as const;

// SVG user units inside the badge's 100×100 viewBox; the text is stretched to wrap the full circle.
const BADGE_FONT_SIZE = 7;
const BADGE_TEXT_LENGTH = 234;

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } };
// The copy only slides: it is readable from the first frame, even if the animation never runs.
const item = { hidden: { y: 16 }, show: { y: 0, transition: { duration: 0.6, ease: 'easeOut' } } };

function RotatingBadge() {
  // The badge is on the page twice (phone and desktop layouts), so each copy needs its own path id.
  const pathId = useId();
  return (
    <div className="relative grid size-badge place-items-center rounded-full border border-berry/30 bg-cream/60 text-berry backdrop-blur-sm">
      <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 motion-safe:animate-spin-slow">
        <defs>
          <path id={pathId} d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" />
        </defs>
        <text className="fill-current font-sans font-medium uppercase" fontSize={BADGE_FONT_SIZE} textLength={BADGE_TEXT_LENGTH}>
          <textPath href={`#${pathId}`}>{hero.badge}</textPath>
        </text>
      </svg>
      <Sparkles aria-hidden className="size-6" strokeWidth={1.25} />
    </div>
  );
}

export function Hero() {
  const booking = useBooking();
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 60, damping: 18 });
  const y = useSpring(pointerY, { stiffness: 60, damping: 18 });
  const imageX = useTransform(x, (v) => v * PARALLAX.image);
  const imageY = useTransform(y, (v) => v * PARALLAX.image);
  const archX = useTransform(x, (v) => v * PARALLAX.arch);
  const archY = useTransform(y, (v) => v * PARALLAX.arch);
  const badgeX = useTransform(x, (v) => v * PARALLAX.badge);
  const badgeY = useTransform(y, (v) => v * PARALLAX.badge);

  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onMouseLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section
      id="home"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative overflow-hidden bg-blush pt-header-sm lg:pt-header"
    >
      <Floral className="-left-10 bottom-0 hidden h-80 text-berry/30 lg:block" />

      {/* Portrait: stacked under the copy on small screens, bleeding off the right edge on desktop. */}
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-3/5 lg:pt-header">
        <div className="relative hidden h-full lg:block">
          <motion.div style={{ x: imageX, y: imageY }} className="absolute -inset-4">
            <Picture image={hero.image} eager sizes={HERO_SIZES} className="mask-fade-l size-full object-cover object-top" />
          </motion.div>
          <motion.div
            style={{ x: archX, y: archY }}
            initial={wasPrerendered ? false : { opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: 'easeOut' }}
            className="absolute bottom-0 right-8 h-5/6 w-52 xl:w-60"
          >
            <div className="size-full overflow-hidden rounded-t-full border-4 border-cream/80 shadow-lift">
              {/* Not eager: this arch is hidden on phones, where an eager image would still download. */}
              <Picture image={hero.archImage} className="size-full object-cover" />
              <div className="absolute inset-0 rounded-t-full bg-gradient-to-t from-ink/60 via-transparent" />
            </div>
            <p aria-hidden className="absolute -left-10 bottom-6 -rotate-6 font-script text-5xl leading-none text-cream drop-shadow-md">
              {hero.script.map((line, i) => (
                <span key={line} className="block" style={{ paddingLeft: `${i}rem` }}>
                  {line}
                </span>
              ))}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-site relative">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="pb-6 md:pb-14 lg:w-1/2 lg:py-16 xl:w-5/12"
        >
          {/* Phones and tablets: the heading sits on the photo. The photo fills the right of this band, shifted
              so the reception desk and sign show beside the text, and fades into the pink on the left, where a
              soft wash keeps the heading readable. Desktop has its own photo, placed above. */}
          <div className="relative -mx-4 flex min-h-80 flex-col justify-center overflow-hidden px-4 py-8 md:-mx-8 md:min-h-96 md:px-8 lg:mx-0 lg:block lg:min-h-0 lg:overflow-visible lg:p-0">
            <div className="absolute inset-y-0 right-0 w-[62%] lg:hidden">
              <Picture image={hero.image} eager sizes={HERO_SIZES} className="mask-fade-l size-full object-cover object-[30%_center]" />
            </div>
            <div aria-hidden className="absolute inset-y-0 left-0 w-3/5 bg-gradient-to-r from-blush via-blush/80 to-transparent lg:hidden" />
            <div className="relative max-w-[58%] sm:max-w-[50%] lg:max-w-none">
              {/* One line on every phone, even where the column itself is narrower than the label. */}
              <motion.div variants={item} className="whitespace-nowrap">
                <Eyebrow>{hero.eyebrow}</Eyebrow>
              </motion.div>
              <motion.h1 variants={item} className="mt-4 font-display text-hero font-medium text-ink">
                {hero.titleLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
                <em className="block text-berry">{hero.titleAccent}</em>
              </motion.h1>
              <motion.p variants={item} className="mt-4 max-w-xs text-sm leading-relaxed text-ink/80 sm:text-base lg:mt-5 lg:text-muted">
                {hero.text}
              </motion.p>
            </div>
          </div>
          <motion.div variants={item} className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4 lg:mt-8">
            <Button onClick={() => booking.open()}>{hero.primaryCta}</Button>
            <Button variant="outline" href={bookingWhatsappHref} external arrow={false}>
              <WhatsAppIcon className="size-4" />
              {hero.secondaryCta}
            </Button>
          </motion.div>
          <motion.ul variants={item} className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5">
            {hero.assurances.map((entry) => (
              <li key={entry} className="flex items-center gap-1.5 text-xs text-muted">
                <Check aria-hidden className="size-3.5 text-berry" />
                {entry}
              </li>
            ))}
          </motion.ul>
          <motion.ul
            variants={item}
            className="no-scrollbar -mx-4 mt-8 flex gap-x-5 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:gap-y-3 sm:overflow-visible sm:px-0"
          >
            {hero.trust.map((entry) => {
              const Icon = TRUST_ICONS[entry.icon];
              return (
                <li key={entry.label} className="flex shrink-0 items-center gap-2 whitespace-nowrap text-xs text-ink">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full border border-berry/40 text-berry">
                    <Icon aria-hidden className="size-3.5" />
                  </span>
                  {entry.label}
                </li>
              );
            })}
          </motion.ul>
        </motion.div>

        <motion.div
          style={{ x: badgeX, y: badgeY }}
          initial={wasPrerendered ? false : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="absolute left-2/5 top-1/3 hidden xl:block"
        >
          <RotatingBadge />
        </motion.div>
      </div>

    </section>
  );
}
