import type { SalonOfferId } from '../offers';
import type { IconKey } from '../pages/types';

/**
 * The copy for one salon's page (/salons/<id>). The salon's name, address, phone, hours, photos and rating come
 * from branches.ts; this file holds only what is written for the page. Each salon's copy is its own, not a
 * reworded copy of another's. No prices, no makeup services, and nothing the owner hasn't confirmed.
 */
export interface BranchPageContent {
  /** The salon's id in branches.ts. */
  id: string;
  seo: {
    /** Up to 60 characters. */
    title: string;
    /** Up to 155 characters. */
    description: string;
    keywords: string[];
  };
  hero: {
    h1: string;
    sub: string;
    /** Which of the salon's photos leads the page (0-based). */
    photo: number;
    /** Alt text for that photo here, with the page's main keyword. */
    photoAlt: string;
  };
  offers: { title: string; items: SalonOfferId[] };
  services: {
    title: string;
    text: string;
    items: Array<{ slug: string; hash?: string; label: string; text: string }>;
  };
  gallery: { title: string; text: string };
  why: { title: string; items: Array<{ icon: IconKey; title: string; text: string }> };
  reviews: { title: string };
  reach: { title: string; notes: string[] };
  areas: { title: string; paragraphs: string[] };
  faqTitle: string;
  /** Sent to search engines word for word, so keep it identical to what the page shows. */
  faqs: Array<{ q: string; a: string; campaign?: boolean }>;
  cta: string;
  /** Brookfield: the tattoo studio and the gym nearby. */
  sister?: string;
}
