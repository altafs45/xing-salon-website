import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { HeartHandshake, MapPin, MessagesSquare, ShieldCheck, Sparkles } from 'lucide-react';
import { why } from '../data/content';
import { cn } from '../lib/cn';
import { Eyebrow, Picture, Reveal } from './ui/Primitives';

const FEATURE_ICONS = {
  consult: MessagesSquare,
  products: Sparkles,
  personal: HeartHandshake,
  hygiene: ShieldCheck,
  pin: MapPin,
} as const;

function Journey() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 75%', 'end 55%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  const [reached, setReached] = useState(0);

  // A step lights up once the fill line has travelled down to its marker.
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    setReached(Math.min(why.journey.length, Math.floor(progress * (why.journey.length - 1) + 1.05)));
  });

  return (
    <div>
      <Eyebrow as="h3">{why.journeyEyebrow}</Eyebrow>
      <ol ref={listRef} className="relative mt-6 space-y-5">
        <span aria-hidden className="absolute bottom-4 left-4 top-4 w-px -translate-x-1/2 bg-berry/20" />
        <motion.span
          aria-hidden
          style={{ scaleY: fill }}
          className="absolute bottom-4 left-4 top-4 w-0.5 origin-top -translate-x-1/2 bg-berry"
        />
        {why.journey.map((entry, i) => {
          const done = i < reached;
          return (
            <li key={entry.step} className="relative flex items-center gap-4">
              <span
                className={cn(
                  'grid size-8 shrink-0 place-items-center rounded-full border text-xs font-medium transition-colors duration-500',
                  done ? 'border-berry bg-berry text-cream' : 'border-berry/40 bg-mint text-berry',
                )}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="flex flex-col gap-x-4 sm:flex-row sm:items-baseline">
                <span className="w-24 shrink-0 text-sm font-semibold text-ink">{entry.step}</span>
                <span className="text-xs text-muted">{entry.text}</span>
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function WhyChoose() {
  return (
    <section id="why-xing" className="section bg-mint">
      {/* Desktop: salon photo bleeds off the right edge and fades into the section. */}
      <div className="absolute inset-y-0 right-0 hidden w-1/4 lg:block">
        <Picture image={why.image} className="mask-fade-l size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent" />
        <p aria-hidden className="absolute inset-x-0 bottom-10 -rotate-6 text-center font-script text-4xl text-cream drop-shadow-md xl:text-5xl">
          {why.script}
        </p>
      </div>

      <div className="container-site relative grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
        <div className="lg:col-span-5">
          <Reveal from="left">
            <Eyebrow>{why.eyebrow}</Eyebrow>
            <h2 className="heading mt-3 text-ink">
              {why.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </Reveal>
          <ul className="mt-8 grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-5">
            {why.features.map((feature, i) => {
              const Icon = FEATURE_ICONS[feature.icon];
              return (
                <li key={feature.label}>
                  <Reveal delay={i * 0.08} className="group flex flex-col items-center text-center">
                    <span className="grid size-14 place-items-center rounded-full border border-berry/40 text-berry transition duration-300 group-hover:-translate-y-1 group-hover:bg-berry group-hover:text-cream motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                      <Icon aria-hidden className="size-6" strokeWidth={1.5} />
                    </span>
                    <span className="mt-3 text-xs font-medium leading-snug text-ink">{feature.label}</span>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>

        <Reveal className="lg:col-span-4 lg:pl-6">
          <Journey />
        </Reveal>

        <Reveal from="right" className="relative overflow-hidden rounded-card shadow-soft lg:hidden">
          <Picture image={why.image} className="aspect-banner w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent" />
          <p aria-hidden className="absolute inset-x-0 bottom-4 -rotate-6 text-center font-script text-4xl text-cream drop-shadow-md">
            {why.script}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
