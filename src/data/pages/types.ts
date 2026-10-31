import type { Img } from '../content';
import type { ComboId } from '../offers';

export type IconKey =
  | 'droplets'
  | 'sparkles'
  | 'layers'
  | 'sun'
  | 'clock'
  | 'calendar'
  | 'award'
  | 'pin'
  | 'offer'
  | 'shield'
  | 'heart'
  | 'scissors'
  | 'palette'
  | 'wind'
  | 'smile'
  | 'star'
  | 'brush'
  | 'waves'
  | 'flame'
  | 'zap'
  | 'users'
  | 'crown'
  | 'camera'
  | 'nail-square'
  | 'nail-squoval'
  | 'nail-round'
  | 'nail-oval'
  | 'nail-almond'
  | 'nail-coffin'
  | 'nail-stiletto';

export type SectionKey =
  | 'intro'
  | 'gallery'
  | 'videos'
  | 'picks'
  | 'menu'
  | 'lengthGuide'
  | 'compare'
  | 'miniCompare'
  | 'crossNote'
  | 'benefits'
  | 'combo'
  | 'highlight'
  | 'audience'
  | 'goals'
  | 'occasions'
  | 'process'
  | 'aftercare'
  | 'bridal'
  | 'offers'
  | 'locations'
  | 'faq'
  | 'guides'
  | 'related'
  /** One of `menuSections`, by id, e.g. 'menu:threading'. */
  | `menu:${string}`;

/**
 * A venue with its own contact details, e.g. the tattoo studio. When a page has one, every booking link, call
 * button, the sticky bar, the header and the location section use it instead of the salons.
 */
export interface StudioContact {
  name: string;
  /** Shown exactly as on the Google Business Profile. */
  address: string;
  /** The same address split up for the schema. */
  postal: { street: string; locality: string; city: string; region: string; postalCode: string };
  /** Display form, e.g. "+91 89700 07818". */
  phone: string;
  phoneHref: string;
  whatsappHref: string;
  email: string;
  mapUrl: string;
  website: string;
  instagram: { href: string; handle: string };
  hours: { label: string; days: string[]; opens: string; closes: string };
  founded: number;
}

/** Copy for one service page. The list of services itself comes from services.ts. No prices anywhere. */
export interface ServicePageContent {
  slug: string;
  /** `kids` gives the page rounder cards and wavy section dividers. */
  theme?: 'kids';
  /** Section order for this page; defaults to the template's order. Sections without content are skipped. */
  order?: SectionKey[];
  seo: {
    /** Full <title>. When omitted it is built from `titleLead` and the brand. */
    title?: string;
    /** First part of the <title>, e.g. "Hydra Facial in Bangalore". */
    titleLead?: string;
    /** 140–155 characters. */
    description: string;
    keyword: string;
    /** Service schema `serviceType`; defaults to the service label. */
    serviceType?: string;
    /** Service schema `areaServed`: the city first, then localities. Defaults to Bengaluru. */
    areaServed?: string[];
    /** Service schema `audience`, for a service offered to one gender only. */
    audienceGender?: 'female' | 'male';
    /**
     * One Service schema object per entry instead of one for the page, e.g. threading and de-tan.
     * `list` is the title of the services.ts list whose items go in that object's catalog.
     */
    splitServices?: Array<{ name: string; serviceType: string; list: string; anchor: string }>;
    /** Schema type of the salons in `provider`; defaults to HairSalon. */
    providerType?: 'HairSalon' | 'BeautySalon' | 'NailSalon';
  };
  /** The page is about a separate venue with its own contact details (see StudioContact). */
  contact?: StudioContact;
  hero: {
    eyebrow: string;
    h1: string;
    sub: string;
    /** Short highlighted line under the subhead, e.g. "Haircuts · Beard Grooming · Men's Colour". */
    tagline?: string;
    /** Small pill over the hero photo, e.g. "Up to 10 years". */
    badge?: string;
    /** Label of the main button; defaults to "Book on WhatsApp". */
    cta?: string;
    chips: Array<{ icon: IconKey; label: string }>;
    /** A second button, to an external site; the call button then becomes a text link. */
    secondary?: { label: string; href: string };
    /** Quick-jump pills under the chips, e.g. to '#threading'. */
    jumps?: Array<{ label: string; href: string }>;
    image: Img;
  };
  /**
   * Opening of the prefilled WhatsApp message, e.g. "Hi, I'd like to book a men's haircut at Xing".
   * The salon name is added after it. Without it, the Book buttons open the booking form.
   */
  whatsappText?: string;
  /** Added to the end of every prefilled message as written, e.g. " for my child (age __)". */
  whatsappSuffix?: string;
  /** Added after a card's name in its WhatsApp message, e.g. " nail art" for "Chrome nail art". */
  cardItemSuffix?: string;
  /** Link text on each service card; defaults to "Book this". */
  cardCta?: string;
  /** `eyebrow` defaults to the service group, e.g. "Hair". */
  intro: { eyebrow?: string; title: string; paragraphs: string[] };
  /** `askText` replaces the line in the WhatsApp strip under the cards. */
  menu: {
    eyebrow?: string;
    title: string;
    text?: string;
    askText?: string;
    /** Replaces the WhatsApp button in the strip under the cards, e.g. a link to an external portfolio. */
    askButton?: { label: string; href: string };
    /** One-line pointer to a neighbouring service page; hidden until that page exists. */
    moreLink?: { slug: string; text: string; label: string; hash?: string; also?: Array<{ slug: string; label: string }> };
  };
  /**
   * Services shown as separate anchored sections instead of tabs; place each in `order` as 'menu:<id>'.
   * `list` is the services.ts list title. `steps` adds a small "What to expect" stepper under the cards.
   */
  menuSections?: Array<{
    id: string;
    list: string;
    eyebrow: string;
    title: string;
    text?: string;
    /** Two cards per row from 390px wide. */
    compact?: boolean;
    steps?: string[];
  }>;
  benefits?: { title: string; text?: string; items: Array<{ icon: IconKey; title: string; text?: string }> };
  lengthGuide?: { title: string; text: string };
  compare?: {
    title: string;
    text?: string;
    columns: string[];
    /** `cells` fill the columns after the name. `slug` links the row; `current` highlights this page's service. */
    rows: Array<{ name: string; cells: string[]; slug?: string; current?: boolean; link?: { slug: string; label: string; hash?: string } }>;
    closing?: string;
  };
  /**
   * Photos of the salon's own work, each named by design, plus a link to see more. Real work only: with no
   * photos yet, the section shows just the link.
   */
  gallery?: {
    /** Defaults to "Inspiration". */
    eyebrow?: string;
    title: string;
    text?: string;
    items: Array<Img & { design: string }>;
    more: { href: string; label: string };
  };
  /** "Shop by occasion": cards that each suggest a few styles from the cards above, and link back to them. */
  picks?: { eyebrow: string; title: string; items: Array<{ icon: IconKey; title: string; styles: string[] }> };
  /** A second, smaller comparison, e.g. Extensions vs Overlays. Same shape as `compare`. */
  miniCompare?: ServicePageContent['compare'];
  /** A short note pointing to a neighbouring service; its link is hidden until that page exists. */
  crossNote?: { title: string; text: string; link: { slug: string; label: string } };
  /**
   * Featured card. With `id` the checklist comes from the combos config; otherwise from `includes`.
   * `linkTo` adds a link to another service page (hidden until that page exists).
   */
  combo?: {
    id?: ComboId;
    title: string;
    text: string;
    includes?: string[];
    badge?: string;
    cta?: string;
    /** Service page slug(s); each becomes an "About our …" link. */
    linkTo?: string | string[];
    /** Buttons to other pages' combos (`slug` + '#combo') in place of the booking button; hidden until the page exists. */
    actions?: Array<{ label: string; slug: string; hash?: string }>;
    /** Prefilled WhatsApp message for the booking button, in place of the generic one. */
    bookText?: string;
  };
  /** "Who is it for?": a checklist of situations, plus a line on when to speak to the therapist first. */
  audience?: { title: string; items: string[]; note: string };
  /** "Pick by goal": each goal points to the service that fits it. `slug` sends the row to that service's own page. */
  goals?: { title: string; items: Array<{ goal: string; service: string; slug?: string }>; note: string };
  /** Shows the bridal & pre-wedding section; `cards` picks a compact set of three. */
  bridalCare?: { cards?: Array<'hair-styling' | 'hair-spa' | 'glow' | 'body-polish' | 'waxing' | 'nails'> };
  /** "Perfect for": occasions shown as a wrapping row of icon chips. */
  occasions?: {
    /** Defaults to "Perfect For". */
    eyebrow?: string;
    title: string;
    items: Array<{ icon: IconKey; label: string }>;
    note?: string;
    /** One sideways-scrolling row on phones instead of wrapping. */
    scroll?: boolean;
  };
  /** A stand-out card for one message, e.g. a child's first haircut. */
  highlight?: { icon: IconKey; title: string; text: string };
  process?: { title: string; text?: string; steps: Array<{ title: string; text?: string }>; duration?: string };
  aftercare: {
    eyebrow?: string;
    title: string;
    text?: string;
    tips?: string[];
    /** Tips split into labelled groups, e.g. Before | After: accordions on phones, side by side from tablet up. */
    groups?: Array<{ title: string; tips: string[] }>;
    closing?: string;
  };
  /** Without a title, the heading is built from the first offer. `badge` and `links` (service slugs) are for a single featured offer. */
  offerBand: { title?: string; text: string; badge?: string; links?: string[] };
  locationsTitle?: string;
  faqTitle?: string;
  faqs: Array<{ q: string; a: string }>;
  /** Only services with a published page are shown. */
  related: { title: string; items: Array<{ slug: string; text: string; hash?: string }> };
  cta: string;
  /** Replaces the Call button in the closing band, e.g. with an external site. */
  ctaSecondary?: { label: string; href: string };
}
