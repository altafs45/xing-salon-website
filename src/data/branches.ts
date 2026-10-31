// Single source of truth for the three salons. The home page's branch cards, the /salons pages, the header,
// the footer, the branch picker, the sticky bar and the schema all read from here. Name, address and phone
// must match each Google Business Profile exactly, so copy them from the profile rather than retyping.
// Each salon's own page copy (FAQs, area notes, SEO) lives in data/branchPages and reads these details.
// Keep this file free of React/asset imports: vite.config.ts also reads it to build SEO tags.
//
// Where the facts come from:
//   - Name, address, phone, email, hours: the owner (confirmed in the brief of 21 Oct 2026).
//   - `lat`/`lng` and `mapUrl`: each salon's Google Maps share link, which resolves to its pin.
//   - `rating`: the per-salon Google figures published on xingsalons.com (checked 21 Oct 2026). Re-check
//     them against each Google Business Profile before launch.
//
// TODO (owner to confirm):
//   1. Brookfield: the Google Maps share link, its coordinates, and the exact Google Business Profile name and
//      address. Until then Directions falls back to a Maps search and the schema has no geo.
//      xingsalons.com books Brookfield on WhatsApp at +91 76699 99012 in one place and +91 81471 11344 in
//      another; this site uses 81471 11344 for both calls and WhatsApp until the owner says otherwise.
//   2. Parking, wheelchair access and payment methods for each salon (from Google). None is shown until then.
//   3. HSR Layout's nearest landmark, and any landmark near Samvit Greens, for the "How to reach us" notes.
import type { Img } from './content';

/** All three salons keep the same hours. Also drives the "Open now" badge, booking slots and schema. */
export const SALON_HOURS = {
  opens: '10:00',
  closes: '21:30',
  label: '10:00 AM – 9:30 PM',
  opensLabel: '10:00 AM',
  closesLabel: '9:30 PM',
  days: 'Mon – Sun',
  /** The owner confirmed every salon opens all seven days. */
  daysConfirmed: true,
  dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  timeZone: 'Asia/Kolkata',
};

/** Escalations only: shown in the footer as "Grievances", never on booking buttons. */
export const GRIEVANCES = { phone: '+91 70047 08826', phoneHref: 'tel:+917004708826' };

/** Where the salon pages live. `/salons` lists all three. */
export const salonsPath = '/salons';
export const salonPath = (id: string) => `${salonsPath}/${id}`;

const mapDirections = (place: string) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place)}`;
const mapSearch = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

/** Google Maps embed (no API key) centred on a named place. Share links like maps.app.goo.gl cannot be embedded. */
export const mapEmbed = (place: string) => `https://www.google.com/maps?q=${encodeURIComponent(place)}&output=embed`;

interface SalonInput {
  /** URL slug (/salons/<id>), page anchor and schema id, e.g. "hsr-layout". */
  id: string;
  /** Short branch name used in buttons, tabs, the picker and WhatsApp messages. */
  name: string;
  /** Exactly as on the Google Business Profile. */
  fullName: string;
  /** The neighbourhood, shown as a chip on the branch card. */
  area: string;
  street: string;
  postalCode: string;
  /** 10-digit Indian mobile number, no country code. */
  phone: string;
  /** WhatsApp number when it differs from the phone. */
  whatsapp?: string;
  email?: string;
  /** Google Business Profile share link; Directions falls back to a Maps search without it. */
  mapUrl?: string;
  /**
   * What the embedded map searches for, when the name plus address doesn't pin the salon itself.
   * Check the map on the salon's page after changing it: Google should show one pin with the salon's name.
   */
  mapQuery?: string;
  /** Neighbourhoods the salon serves. Real place names only. */
  areasServed: string[];
  /** From the salon's Google Maps pin. Leave out until known; never estimated. */
  lat?: number;
  lng?: number;
  /** Google rating and review count for this salon. */
  rating?: { value: number; count: number };
  /** Short local introduction, used on /about and the home page. */
  intro: string;
  landmark?: string;
  /** Verified places nearby, shown as chips under the map. */
  nearbyLandmarks: string[];
  /** What the salon looks like inside, for the "Inside XING" showcase; `intro` is used without it. Real features only. */
  inside?: string;
  /** Longer description for the schema. */
  description: string;
  /** File prefix in /public/images: photos are `<prefix>-1.webp`, `<prefix>-2.webp`… each with a `-480` version. */
  imagePrefix: string;
  /** One description per photo, in file order, written to read after "…" in "<description> at Xing …". */
  photos: string[];
}

const salon = (input: SalonInput) => {
  const { phone, whatsapp = input.phone, street, postalCode } = input;
  const address = `${street}, Bengaluru, Karnataka ${postalCode}`;
  // What Google should look up for this salon, for the embedded map and for directions.
  const place = input.mapQuery ?? `${input.fullName}, ${address}`;
  const mapUrl = input.mapUrl ?? mapSearch(place);
  return {
    ...input,
    city: 'Bengaluru',
    region: 'Karnataka',
    address,
    path: salonPath(input.id),
    phone: `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`,
    phoneHref: `tel:+91${phone}`,
    whatsappHref: `https://wa.me/91${whatsapp}`,
    mapUrl,
    /** True when `mapUrl` is the salon's own Google Business Profile, not a search. */
    hasProfile: !!input.mapUrl,
    mapEmbedUrl: mapEmbed(place),
    /** Opens turn-by-turn directions, in the Maps app on phones. */
    directionsUrl: mapDirections(place),
    hours: SALON_HOURS,
    photos: input.photos.map((description, i): Img => {
      const file = `/images/${input.imagePrefix}-${i + 1}`;
      return {
        src: `${file}.webp`,
        srcSet: `${file}-480.webp 480w, ${file}.webp 800w`,
        alt: `${description.charAt(0).toUpperCase()}${description.slice(1)} at Xing Salon, ${input.name}, Bangalore`,
        width: 800,
        height: 600,
      };
    }),
  };
};

/** The order salons appear in, everywhere. Never hardcode a salon list: use `locations` or `bySalonOrder`. */
export const SALON_ORDER = ['sarjapur-road', 'hsr-layout', 'brookfield'] as const;
/** Sorts salons (or anything with a salon's `id`) into SALON_ORDER. */
export const bySalonOrder = (a: { id: string }, b: { id: string }) =>
  SALON_ORDER.indexOf(a.id as (typeof SALON_ORDER)[number]) - SALON_ORDER.indexOf(b.id as (typeof SALON_ORDER)[number]);

export const locations = [
  salon({
    id: 'sarjapur-road',
    name: 'Sarjapura Road',
    fullName: 'Xing Premium Unisex Salon, Sarjapura Road',
    area: 'Kasavanahalli',
    street: '1st Floor, Samvit Greens, 71/1A, Sarjapur - Marathahalli Rd, Kasavanahalli, Kaikondrahalli',
    postalCode: '560035',
    phone: '8970007440',
    email: 'xing.sarjapura@gmail.com',
    mapUrl: 'https://maps.app.goo.gl/nfXT59udL4KKSHCB6',
    areasServed: ['Sarjapur Road', 'Kasavanahalli', 'Kaikondrahalli', 'Sarjapur–Marathahalli Road'],
    lat: 12.9133092,
    lng: 77.6789381,
    rating: { value: 4.8, count: 319 },
    landmark: 'First floor of Samvit Greens, on Sarjapur–Marathahalli Road',
    nearbyLandmarks: ['Samvit Greens', 'Sarjapur–Marathahalli Road'],
    intro:
      'Find us at Samvit Greens on Sarjapur–Marathahalli Road, convenient for Kasavanahalli and Kaikondrahalli, for premium hair, skin and grooming services.',
    inside: 'Teal styling chairs, sculpted mirrors on a navy-and-gold wall and a glass front looking out over Sarjapur Road.',
    description:
      'Xing Salon is a premium, quality-driven and customer-centric salon on Sarjapur Road, Bangalore, offering exceptional hair, beauty and grooming services. Our expert stylists use international techniques and authentic professional products to deliver personalized, high-quality results. From precision haircuts, global hair color, balayage and highlights to Keratin, Nanoplastia, Hair Botox, hair spa, skincare and beauty services, every experience is designed around you.',
    imagePrefix: 'loc-sarjapur',
    photos: [
      'reception desk and illuminated XING sign',
      'styling floor with teal chairs and sculpted mirrors',
      'styling stations along a backlit mirror wall',
      'reception counter beside teal styling chairs and wavy mirrors on a navy-and-gold wall',
      'waiting sofa and reception desk by the glass front overlooking Sarjapur Road',
      'hair wash station with a teal chair beside a wood-panelled wall',
    ],
  }),
  salon({
    id: 'hsr-layout',
    name: 'HSR Layout',
    fullName: 'Xing Premium Unisex Salon, HSR Layout',
    area: '24th Main Rd',
    street: '150/3, GSR Arcade, 9th Cross, 24th Main Rd, HSR Layout',
    postalCode: '560102',
    phone: '9380812348',
    email: 'hsrxing@gmail.com',
    mapUrl: 'https://maps.app.goo.gl/pPwNQUbv8cZuUS7Y9',
    // With the full address Google shows several salons; the name alone pins this one.
    mapQuery: 'Xing Premium Unisex Salon HSR Layout',
    areasServed: ['HSR Layout Sector 1', 'Sector 2', 'Sector 3', 'Sector 4', 'Sector 6'],
    lat: 12.9186477,
    lng: 77.6491593,
    rating: { value: 4.9, count: 393 },
    nearbyLandmarks: ['GSR Arcade', '24th Main Road', '9th Cross'],
    intro:
      'Our HSR Layout salon on 24th Main Road serves clients across Sectors 1, 2, 3, 4 and 6 for haircuts, colour, keratin, nanoplastia, hair spas, facials and more.',
    description:
      'Xing Salon is a premium hair and beauty salon in HSR Layout, Bangalore, serving clients across HSR Layout, Sector 1, Sector 2, Sector 3, Sector 4, Sector 6 and nearby areas. Known for quality, personalized care and expert service, our professional stylists use international techniques and authentic salon products. Visit Xing Salon HSR for women’s and men’s haircuts, global hair color, highlights, balayage, Keratin, Nanoplastia, Hair Botox, hair spa, scalp treatments, facials, skincare and beauty services.',
    inside: 'Pastel interiors, gold-framed mirrors, a dedicated Nail Bar, a pedicure lounge and a kids’ corner — a space designed for you to relax.',
    imagePrefix: 'loc-hsr',
    photos: [
      'reception desk with the illuminated XING sign',
      'styling stations with round lit mirrors',
      'the Nail Bar with its neon signs',
      'pedicure lounge with armchairs under the “Just Relax” sign',
      'hair wash stations beside the professional product wall',
      'reception and salon floor',
    ],
  }),
  salon({
    id: 'brookfield',
    name: 'Brookfield',
    fullName: 'Xing Premium Unisex Salon, Brookfield',
    area: 'AECS Layout',
    street: '1st Floor, SV Plaza, No. 267, 60 Feet Rd, AECS Layout, Brookfield',
    postalCode: '560037',
    phone: '8147111344',
    email: 'xing.aecs@gmail.com',
    areasServed: ['AECS Layout', 'Brookfield', 'Kundalahalli', 'Whitefield', 'Marathahalli'],
    rating: { value: 4.9, count: 1552 },
    landmark: 'Near DMart Ready, in the same building as Xing Premium Tattoo Studio',
    nearbyLandmarks: ['DMart Ready', 'Xing Premium Tattoo Studio (same building)', 'Xing Fitness Club, VV Arcade'],
    intro:
      'Our Brookfield salon at SV Plaza, AECS Layout, near DMart Ready, is easy to reach from Kundalahalli, Whitefield and Marathahalli, and our tattoo studio is in the same building.',
    inside: 'Teal lounge seating, a green plant wall, a dedicated treatment room and garden-facing windows on the first floor of SV Plaza.',
    description:
      'Xing Salon in AECS Layout, Brookfield is a premium unisex salon serving Brookfield, Kundalahalli, Marathahalli and Whitefield with expert haircuts, hair colour, balayage, Keratin, Nanoplastia, hair spa, skincare, nails and beauty services, delivered by skilled professionals using authentic products.',
    imagePrefix: 'loc-brookfield',
    photos: [
      'reception desk and teal lounge sofa',
      'retail display with professional hair products',
      'hair wash stations',
      'treatment room with two beds',
      'lounge and salon floor with garden-facing windows',
      'styling floor with grey chairs beside a green plant wall and wood-panelled product shelves',
    ],
  }),
];

export type Salon = (typeof locations)[number];

export const salonById = (id: string) => locations.find((loc) => loc.id === id);

/** Default salon for the booking form. Booking buttons ask the visitor to choose instead. */
export const primaryLocation = salonById('hsr-layout')!;

/** "4.9 ★ · 1,552 Google reviews" */
export const ratingLabel = (rating: { value: number; count: number }) =>
  `${rating.value.toFixed(1)} ★ · ${rating.count.toLocaleString('en-IN')} Google reviews`;
