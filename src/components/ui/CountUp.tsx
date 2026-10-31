import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

const format = (value: number, decimals: number) =>
  value.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

interface CountUpProps {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}

/** Counts from 0 to `value` the first time it scrolls into view. */
export function CountUp({ value, decimals = 0, suffix = '', className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduceMotion = useReducedMotion();
  // Starts on the final value, so the number is right even if the animation never runs.
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(0, value, { duration: 1.6, ease: 'easeOut', onUpdate: setShown });
    return () => controls.stop();
  }, [inView, reduceMotion, value]);

  return (
    <span ref={ref} className={className}>
      {/* Screen readers get the final value straight away instead of every intermediate frame. */}
      <span aria-hidden>
        {format(shown, decimals)}
        {suffix}
      </span>
      <span className="sr-only">
        {format(value, decimals)}
        {suffix}
      </span>
    </span>
  );
}
