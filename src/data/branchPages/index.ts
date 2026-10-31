import { brookfield } from './brookfield';
import { hsrLayout } from './hsr-layout';
import { sarjapurRoad } from './sarjapur-road';
import type { BranchPageContent } from './types';

export type { BranchPageContent } from './types';

/** Each salon's page copy, by salon id. */
export const branchPages: Record<string, BranchPageContent> = Object.fromEntries(
  [sarjapurRoad, hsrLayout, brookfield].map((page) => [page.id, page]),
);

/** The steps of a first visit, the same at every salon. */
export const visitSteps = [
  { title: 'Message us or walk in', text: 'Send a WhatsApp, call, or just drop in. We’re open every day.' },
  { title: 'Free consultation', text: 'Your stylist talks through your hair or skin and the look you want, and confirms the price.' },
  { title: 'Your service', text: 'Relax while we work, with premium products and Olaplex if you choose it.' },
  { title: 'Aftercare plan', text: 'You leave with simple care tips and a reminder of when to come back.' },
];

/** Shown on /salons, and as the salons' summary elsewhere. */
export const salonsPage = {
  title: 'Xing salons Bangalore: Sarjapur, HSR Layout & Brookfield',
  description:
    'Find your nearest Xing salon in Bangalore: Sarjapur Road, HSR Layout and Brookfield (AECS Layout). Open daily; hours vary by salon. Walk-ins welcome.',
  h1: 'Our Salons in Bangalore',
  text: 'Three Xing salons, one standard of care. Pick yours for its offers, photos, directions and booking.',
};
