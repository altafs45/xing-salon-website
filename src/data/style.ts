// House style: one brand, one vocabulary, one set of button labels. CONTENT_STYLE.md explains it for writers, and
// scripts/consistency-audit.mjs enforces `VOCABULARY` across the source and the built pages.
// Keep this file free of imports: vite.config.ts and the audit scripts read it too.

export const BRAND = 'Xing';
export const BRAND_FULL = 'Xing Premium Unisex Salon';
export const CITY = 'Bangalore';
export const TITLE_SUFFIX = ' – Xing Salon';

/** The one description of the business. Organization schema, About, the footer and llms.txt all use it word for word. */
export const ENTITY_DESCRIPTION =
  'Xing Premium Unisex Salon is a Bangalore salon group founded in 2020, with salons on Sarjapur Road, in HSR Layout and in Brookfield, offering hair, skin, nail and grooming services.';

export const CTA = {
  book: 'Book Appointment',
  whatsapp: 'Chat on WhatsApp',
  claimWhatsapp: 'Claim on WhatsApp',
  claim: 'Claim Offer',
  reserve: 'Reserve a November Slot',
  call: 'Call',
  directions: 'Directions',
  details: 'View Details',
  allServices: 'See All Services',
  allOffers: 'See All Offers',
  allArticles: 'See All Articles',
} as const;

export interface VocabularyRule {
  check: string;
  wrong: string;
  flags?: string;
  use: string;
}

/** Wrong forms, as regular expression source. URLs, classes and imports are never scanned in the built text. */
export const VOCABULARY: VocabularyRule[] = [
  { check: 'brand', wrong: '\\bXING\\b', use: 'Xing' },
  { check: 'brand', wrong: 'Xing Premium Salons?\\b(?! Bangalore)', use: 'Xing Premium Unisex Salon' },
  { check: 'brand', wrong: 'Xing Salons\\b', use: 'Xing' },
  { check: 'city', wrong: '\\bBengaluru\\b', use: 'Bangalore, except in postal addresses' },
  { check: 'spelling', wrong: '\\b(color|colors|colored|coloring|colorist|colorists|colorful)\\b', flags: 'i', use: 'colour' },
  { check: 'spelling', wrong: '\\b(personalized|favorite|favorites|center|centers|program|programs)\\b', flags: 'i', use: 'British spelling' },
  { check: 'whatsapp', wrong: '\\bWhatsapp\\b|\\bwhatsapp\\b', use: 'WhatsApp' },
  { check: 'time', wrong: '\\d\\s?(am|pm|a\\.m\\.|p\\.m\\.)\\b|\\d:00 ?(AM|PM)', use: '10 AM – 9:30 PM' },
  { check: 'money', wrong: '\\bRs\\.? ?\\d|₹ \\d|\\bINR \\d', use: '₹3,999' },
  { check: 'salon-label', wrong: 'Sarjapura Road', use: 'Sarjapur Road, except in the exact Google name' },
];

/** Button labels that must not appear: each has a house form in `CTA`. */
export const WRONG_CTA = ['Book now', 'Book Now', 'Book a slot', 'Book a Slot', 'Book Your Visit', 'WhatsApp us', 'WhatsApp Us', 'Message us', 'Claim', 'Get offer', 'Learn more', 'Learn More', 'Click here', 'Reserve a November slot'];
