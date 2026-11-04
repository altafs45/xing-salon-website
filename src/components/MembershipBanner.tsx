import { ArrowRight, Gift } from 'lucide-react';
import { membershipBanner, membershipPath } from '../data/membershipLinks';

/** A slim band near the end of the home page that leads to the membership and gift cards page. */
export function MembershipBanner() {
  return (
    <a
      href={membershipPath}
      className="group on-dark flex min-h-14 items-center justify-center gap-3 bg-gradient-to-r from-berrydark via-berry to-berrydark px-4 py-3 text-center text-sm font-medium text-cream"
    >
      <Gift aria-hidden className="size-5 shrink-0 text-gold" />
      <span className="text-balance">{membershipBanner}</span>
      <ArrowRight aria-hidden className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
    </a>
  );
}
