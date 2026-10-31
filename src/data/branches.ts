// Single source of truth for the three salons, and it must match each Google Business Profile (GBP) exactly. The
// header, footer, picker, sticky bar, emails and schema all read from here, and tests/gbp.test.ts locks the values
// to a copy of the profiles. When a profile changes, change this file and tests/fixtures.ts together.
// Keep this file free of React/asset imports: vite.config.ts also reads it to build SEO tags.
//
// Where the facts come from:
//   - Name, address, phone, hours, rating, category, pin, plus code, map link: each GBP, read on 31 Oct 2026.
//   - Email: the owner (brief of 21 Oct 2026).
//   - `name` is a short label for buttons and tabs. `fullName` is the exact GBP name, character for character.
//   - The Brookfield GBP spells it "Brookefield". That is a typo the owner is fixing, so the site writes "Brookfield".
//
// TODO (owner to confirm): parking, wheelchair access and payment methods for each salon (from Google). None is
// shown until then. Also HSR Layout's nearest landmark, and any landmark near Samvit Greens.
import type { Img } from './content';

/** What is true of every salon. Each salon's own times are `hours` on the salon; see `hoursFor`. */
export const SALON_HOURS = {
  label: 'Open daily · hours vary by salon',
  days: 'Mon – Sun',
  /** The owner confirmed every salon opens all seven days. */
  daysConfirmed: true,
  dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  timeZone: 'Asia/Kolkata',
};

/** "21:30" → "9:30 PM". */
const clock = (time: string) => {
  const [hour, minute] = time.split(':').map(Number);
  return `${hour % 12 || 12}${minute ? `:${String(minute).padStart(2, '0')}` : ''} ${hour >= 12 ? 'PM' : 'AM'}`;
};

/** Escalations only: shown in the footer as "Grievances", never on booking buttons. */
export const GRIEVANCES = { phone: '+91 70047 08826', phoneHref: 'tel:+917004708826' };

/** Where the salon pages live. `/salons` lists all three. */
export const salonsPath = '/salons';
export const salonPath = (id: string) => `${salonsPath}/${id}`;

const mapDirections = (place: string) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place)}`;

/** Google Maps embed (no API key) centred on a named place. Share links like maps.app.goo.gl cannot be embedded. */
export const mapEmbed = (place: string) => `https://www.google.com/maps?q=${encodeURIComponent(place)}&output=embed`;

interface SalonInput {
  /** URL slug (/salons/<id>), page anchor and schema id, e.g. "hsr-layout". */
  id: string;
  /** Short branch name used in buttons, tabs, the picker and WhatsApp messages. */
  name: string;
  /** The exact Google Business Profile name. */
  fullName: string;
  /** The neighbourhood, shown as a chip on the branch card. */
  area: string;
  /** The GBP address up to the city. */
  street: string;
  postalCode: string;
  /** The number on the GBP, for calls: 10 digits, no country code. */
  phone: string;
  /** WhatsApp number when it differs from the phone. */
  whatsapp?: string;
  /** 24-hour "HH:MM" in salon time, every day of the week. */
  hours: { opens: string; closes: string };
  /** The profile's primary category. */
  gbpCategory: 'Beauty Parlour' | 'Hairdresser';
  plusCode: string;
  email?: string;
  /** Opens this exact listing on Google Maps (its reviews too). */
  mapUrl: string;
  /**
   * What the embedded map searches for, when the name plus address doesn't pin the salon itself.
   * Check the map on the salon's page after changing it: Google should show one pin with the salon's name.
   */
  mapQuery?: string;
  /** Neighbourhoods the salon serves. Real place names only. */
  areasServed: string[];
  /** The GBP pin. */
  lat: number;
  lng: number;
  /** The exact figures on the day they were read. Show them with `reviewsLabel`, which stays true as they grow. */
  rating: { value: number; count: number; asOf: string };
  /** Short local introduction, used on /about and the home page. */
  intro: string;
  landmark?: string;
  /** Verified places nearby, shown as chips under the map. */
  nearbyLandmarks: string[];
  /** What the salon looks like inside, for the "Inside Xing" showcase; `intro` is used without it. Real features only. */
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
  return {
    ...input,
    city: 'Bengaluru',
    region: 'Karnataka',
    address,
    path: salonPath(input.id),
    phone: `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`,
    phoneHref: `tel:+91${phone}`,
    whatsappHref: `https://wa.me/91${whatsapp}`,
    gbpName: input.fullName,
    addressLine: address,
    mapsUrl: input.mapUrl,
    /** True now every salon has its listing; kept for the schema. */
    hasProfile: true,
    attributes: ['LGBTQ+ friendly', 'Women-owned'],
    mapEmbedUrl: mapEmbed(place),
    /** Opens turn-by-turn directions, in the Maps app on phones. */
    directionsUrl: mapDirections(`${input.lat},${input.lng}`),
    hours: {
      ...input.hours,
      days: 7,
      dayNames: SALON_HOURS.dayNames,
      opensLabel: clock(input.hours.opens),
      closesLabel: clock(input.hours.closes),
      label: `${clock(input.hours.opens)} – ${clock(input.hours.closes)}`,
      shortLabel: `${clock(input.hours.opens)} – ${clock(input.hours.closes)}`,
    },
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
    name: 'Sarjapur Road',
    fullName: 'Xing Premium Unisex Salon, Sarjapura Road',
    area: 'Kasavanahalli',
    street: '1st Floor, Samvit Greens, 71/1A, Sarjapur - Marathahalli Rd, Kasavanahalli, Kaikondrahalli',
    postalCode: '560035',
    phone: '8970007440',
    hours: { opens: '10:00', closes: '21:30' },
    gbpCategory: 'Beauty Parlour',
    plusCode: 'WM7H+8H',
    email: 'xing.sarjapura@gmail.com',
    mapUrl: 'https://www.google.com/maps?cid=2447554241101026298',
    areasServed: ['Sarjapur Road', 'Kasavanahalli', 'Kaikondrahalli', 'Sarjapur–Marathahalli Road'],
    lat: 12.9133092,
    lng: 77.6789381,
    rating: { value: 4.8, count: 459, asOf: '2026-10-31' },
    landmark: 'First floor of Samvit Greens, on Sarjapur–Marathahalli Road',
    nearbyLandmarks: ['Samvit Greens', 'Sarjapur–Marathahalli Road'],
    intro:
      'Find us at Samvit Greens on Sarjapur–Marathahalli Road, convenient for Kasavanahalli and Kaikondrahalli, for premium hair, skin and grooming services.',
    inside: 'Teal styling chairs, sculpted mirrors on a navy-and-gold wall and a glass front looking out over Sarjapur Road.',
    description:
      'Xing Salon is a premium, quality-driven and customer-centric salon on Sarjapur Road, Bangalore, offering exceptional hair, beauty and grooming services. Our expert stylists use international techniques and authentic professional products to deliver personalised, high-quality results. From precision haircuts, global hair colour, balayage and highlights to Keratin, Nanoplastia, Hair Botox, hair spa, skincare and beauty services, every experience is designed around you.',
    imagePrefix: 'loc-sarjapur',
    photos: [
      'reception desk and illuminated Xing sign',
      'styling floor with teal chairs and sculpted mirrors',
      'styling stations along a backlit mirror wall',
      'reception counter beside teal styling chairs and wavy mirrors on a navy-gold wall',
      'waiting sofa and reception desk by the glass front overlooking Sarjapur Road',
      'hair wash station with a teal chair beside a wood-panelled wall',
    ],
  }),
  salon({
    id: 'hsr-layout',
    name: 'HSR Layout',
    fullName: 'Xing Premium Unisex Salon - HSR Layout',
    area: '24th Main Rd',
    street: '1st Floor, 150/3, GSR Arcade, 9th Cross, 24th Main Rd',
    postalCode: '560102',
    phone: '9380812348',
    hours: { opens: '10:00', closes: '22:00' },
    gbpCategory: 'Hairdresser',
    plusCode: 'WJ9X+FM',
    email: 'hsrxing@gmail.com',
    mapUrl: 'https://www.google.com/maps?cid=17729263556490350929',
    // With the full address Google shows several salons; the name alone pins this one.
    mapQuery: 'Xing Premium Unisex Salon HSR Layout',
    areasServed: ['HSR Layout Sector 1', 'Sector 2', 'Sector 3', 'Sector 4', 'Sector 6'],
    lat: 12.9186529,
    lng: 77.6492076,
    rating: { value: 4.9, count: 493, asOf: '2026-10-31' },
    nearbyLandmarks: ['GSR Arcade', '24th Main Road', '9th Cross'],
    intro:
      'Our HSR Layout salon on 24th Main Road serves clients across Sectors 1, 2, 3, 4 and 6 for haircuts, colour, keratin, nanoplastia, hair spas, facials and more.',
    description:
      'Xing Salon is a premium hair and beauty salon in HSR Layout, Bangalore, serving clients across HSR Layout, Sector 1, Sector 2, Sector 3, Sector 4, Sector 6 and nearby areas. Known for quality, personalised care and expert service, our professional stylists use international techniques and authentic salon products. Visit Xing Salon HSR for women’s and men’s haircuts, global hair colour, highlights, balayage, Keratin, Nanoplastia, Hair Botox, hair spa, scalp treatments, facials, skincare and beauty services.',
    inside: 'Pastel interiors, gold-framed mirrors, a dedicated Nail Bar, a pedicure lounge and a kids’ corner — a space designed for you to relax.',
    imagePrefix: 'loc-hsr',
    photos: [
      'reception desk with the illuminated Xing sign',
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
    fullName: 'Xing Premium Unisex Salon - Brookfield, Whitefield',
    area: 'AECS Layout',
    street: '1st floor, Number 267, SV Plaza 60 Feet Road AECS Layout, Whitefield, Brookfield',
    postalCode: '560037',
    // OWNER: confirm 079966 66012 rings at the Brookfield salon. A landline can't take WhatsApp, so that stays on 81471 11344.
    phone: '7996666012',
    whatsapp: '8147111344',
    hours: { opens: '09:00', closes: '21:30' },
    gbpCategory: 'Beauty Parlour',
    plusCode: 'XP75+CP',
    mapUrl: 'https://www.google.com/maps?cid=3366119781327561907',
    lat: 12.9636011,
    lng: 77.7093299,
    email: 'xing.aecs@gmail.com',
    areasServed: ['AECS Layout', 'Brookfield', 'Kundalahalli', 'Whitefield', 'Marathahalli'],
    rating: { value: 4.8, count: 1638, asOf: '2026-10-31' },
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
      'styling floor with grey chairs beside a green plant wall and wooden product shelves',
    ],
  }),
];

export type Salon = (typeof locations)[number];

export const salonById = (id: string) => locations.find((loc) => loc.id === id);

/** Default salon for the booking form. Booking buttons ask the visitor to choose instead. */
export const primaryLocation = salonById('hsr-layout')!;

/** A salon's hours, for places that take the salon rather than reading it directly. */
export const hoursFor = (salon: Salon) => salon.hours;

/** A review count rounded down with a plus (1,638 → "1,600+"), so it stays true as the count grows. */
export const reviewsLabel = (count: number) => {
  const step = count >= 1000 ? 50 : 10;
  return `${(Math.floor(count / step) * step).toLocaleString('en-IN')}+`;
};

/** "4.9 ★ · 490+ Google reviews" */
export const ratingLabel = (rating: { value: number; count: number }) => `${rating.value.toFixed(1)} ★ · ${reviewsLabel(rating.count)} Google reviews`;

const allReviews = locations.reduce((sum, loc) => sum + loc.rating.count, 0);
/** The three profiles together. Always calculated, never typed. */
export const totalReviews = allReviews;
export const totalReviewsLabel = reviewsLabel(allReviews);
export const totalReviewsRounded = Number(totalReviewsLabel.replace(/\D/g, ''));
export const overallRating = Math.round((locations.reduce((sum, loc) => sum + loc.rating.value * loc.rating.count, 0) / allReviews) * 10) / 10;

/** "Open every day: Sarjapur Road 10 AM – 9:30 PM, HSR Layout 10 AM – 10 PM, Brookfield 9 AM – 9:30 PM." */
export const allHoursText = `Open every day: ${locations.map((loc) => `${loc.name} ${loc.hours.shortLabel}`).join(', ')}.`;
/** The answer to "Is Xing HSR Layout open on Sunday?". */
export const sundayAnswer = (salon: Salon) => `Yes. ${salon.fullName} is open every day, ${salon.hours.shortLabel}.`;

/** How close to opening or closing time counts as "soon", in minutes. */
const SOON = 60;
const DAY = 24 * 60;
const toMinutes = (time: string) => {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
};

export interface SalonStatus {
  /** `closing` and `opening` are the last hour before the doors close or open. */
  state: 'open' | 'closing' | 'opening' | 'closed';
  /** Minutes until the salon closes (when open) or opens (when closed). */
  minutes: number;
  /** How far through the opening hours it is, from 0 to 1. 0 while closed. */
  progress: number;
}

/** Whether a salon is open at a time of day, given in minutes after midnight, salon time. */
export function statusAt(salon: Pick<Salon, 'hours'>, now: number): SalonStatus {
  const open = toMinutes(salon.hours.opens);
  const close = toMinutes(salon.hours.closes);
  if (now >= open && now < close) {
    const minutes = close - now;
    return { state: minutes <= SOON ? 'closing' : 'open', minutes, progress: (now - open) / (close - open) };
  }
  // Before opening today, or after closing: the next opening is tomorrow's.
  const minutes = now < open ? open - now : open + DAY - now;
  return { state: minutes <= SOON ? 'opening' : 'closed', minutes, progress: 0 };
}

/** Hourly booking slots from opening, the last leaving at least an hour before closing. With no salon, the widest range. */
export function bookingSlots(salon?: Pick<Salon, 'hours'>) {
  const range = salon ? [salon] : locations;
  const open = Math.min(...range.map((loc) => toMinutes(loc.hours.opens)));
  const close = Math.max(...range.map((loc) => toMinutes(loc.hours.closes)));
  return Array.from({ length: Math.floor((close - open) / 60) }, (_, i) => {
    const hour = Math.floor(open / 60) + i;
    return `${hour > 12 ? hour - 12 : hour} ${hour >= 12 ? 'PM' : 'AM'}`;
  });
}
