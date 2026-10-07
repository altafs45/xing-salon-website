import type { ServicePageContent } from './types';

// TODO (owner to confirm before publishing):
//   1. Is waxing offered to men? If yes, add the FAQ "Is waxing available for men?" (with the confirmed answer) and
//      add "men's waxing Bangalore" to the keywords. If no, say "for women" in the hero and intro.
//   2. Is cartridge wax single-use per client? If yes, add a "Hygienic single-use cartridges" hero chip and benefit.
//      Until then, make no hygiene claim.
//   3. A real treatment photo (legs, arms or a spa setting, nothing intimate) to replace the hero.
export const waxing: ServicePageContent = {
  slug: 'waxing',
  order: ['intro', 'combo', 'menu', 'compare', 'benefits', 'process', 'aftercare', 'offers', 'locations', 'faq', 'related'],
  seo: {
    title: 'Waxing Salon in Bangalore | Full Body, Face & Bikini | Xing',
    description:
      'Flavored, roll-on cartridge & stripless waxing for arms, legs, face, underarms & bikini at Xing Salon, HSR Layout, Brookfield & Sarjapura. Book now.',
    keyword: 'waxing salon Bangalore',
    serviceType: 'Waxing / Hair Removal',
    areaServed: ['Bengaluru', 'HSR Layout', 'Brookfield', 'Sarjapura'],
    providerType: 'BeautySalon',
  },
  hero: {
    eyebrow: 'Skin & Body',
    h1: 'Waxing Services in Bangalore for Smooth, Hair-Free Skin',
    sub: 'Smooth, hair-free skin from face to toe with flavored, roll-on cartridge and gentle stripless waxing, done quickly and comfortably by trained therapists.',
    cta: 'Book Waxing on WhatsApp',
    chips: [
      { icon: 'layers', label: '3 wax types' },
      { icon: 'sparkles', label: 'Face, body & bikini' },
      { icon: 'offer', label: 'Waxing combo available' },
    ],
    // Placeholder until a real treatment photo is added. When it is, use the alt
    // "Waxing service at Xing Premium Salon Bangalore".
    image: {
      src: '/images/loc-sarjapur-1.webp',
      alt: 'Reception at Xing Premium Salon on Sarjapur Road, Bangalore, where waxing services are offered',
      width: 800,
      height: 600,
    },
  },
  whatsappText: 'Hi, I’d like to book waxing (areas: ___) at Xing',
  intro: {
    eyebrow: 'Hair Removal',
    title: 'Professional Waxing in HSR Layout, Brookfield & Sarjapura',
    paragraphs: [
      'Waxing removes hair from the root, so your skin stays smooth for longer than shaving. At Xing Premium Unisex Salon, you can choose the wax that suits your skin and the area being treated: classic flavored wax, quick and even roll-on cartridge wax, or stripless wax for delicate areas like the face, underarms and bikini line.',
      'Our therapists work quickly and carefully to keep you comfortable. Book a single area, go for full body waxing, or save time with our waxing combo, which includes threading, a manicure and a pedicure. Waxing is available at all our salons across Bangalore.',
    ],
  },
  combo: {
    badge: 'Combo',
    title: 'Confidence with Smooth Skin — Waxing Combo',
    text: 'Full arms, half legs and underarms waxing, plus threading, a Crystal Pedicure and a D-Lux Manicure, all in one visit at special combo pricing.',
    includes: ['Full arms wax', 'Half legs wax', 'Underarms wax', 'Threading', 'Crystal Pedicure', 'D-Lux Manicure'],
    cta: 'Book the waxing combo',
    linkTo: 'manicure-pedicure',
  },
  menu: {
    eyebrow: 'Waxing Menu',
    title: 'Waxing Services',
    askText: 'Not sure which wax to choose? Ask us on WhatsApp.',
    // Threading has its own page; this page only points to it.
    moreLink: { slug: 'threading-detan', text: 'Prefer threading for brows and face?', label: 'Threading & De-tan', hash: '#threading' },
  },
  compare: {
    title: 'Flavored vs Cartridge vs Stripless Wax',
    columns: ['Wax', 'How it’s applied', 'Best for', 'Feel'],
    rows: [
      {
        name: 'Flavored Wax',
        cells: ['Spread with a spatula, removed with strips', 'Arms, legs, body', 'Classic waxing'],
      },
      {
        name: 'Cartridge (Roll-on) Wax',
        cells: ['Rolled on evenly from a cartridge, removed with strips', 'Larger areas, quick and even application', 'Smooth, even coverage'],
      },
      {
        name: 'Stripless Wax',
        cells: ['Applied and removed without strips', 'Face, underarms, bikini (delicate areas)', 'Often gentler on sensitive areas'],
      },
    ],
  },
  benefits: {
    title: 'Why Choose Waxing',
    items: [
      { icon: 'layers', title: 'Removes hair from the root' },
      { icon: 'sparkles', title: 'Smoother skin for longer than shaving' },
      { icon: 'wind', title: 'Finer-looking regrowth over time', text: 'With regular waxing. Results vary.' },
      { icon: 'zap', title: 'Quick sessions' },
      { icon: 'heart', title: 'Pairs well with body polish and pedicures' },
    ],
  },
  process: {
    title: 'What to Expect',
    steps: [
      { title: 'Choose areas & wax type' },
      { title: 'Skin cleansed and prepped' },
      { title: 'Wax applied & removed' },
      { title: 'Stray hairs tidied' },
      { title: 'Soothing after-care applied' },
    ],
  },
  aftercare: {
    eyebrow: 'Prep & Aftercare',
    title: 'Before & After Waxing',
    groups: [
      {
        title: 'Before your appointment',
        tips: [
          'Let hair grow to about a grain of rice in length for the best grip.',
          'Avoid scrubbing, sunbathing and retinoid or acne creams on the area for a few days.',
          'Skip lotions and oils on the day of your appointment.',
        ],
      },
      {
        title: 'After waxing',
        tips: [
          'Avoid sun exposure, hot showers, saunas and heavy workouts for 24 hours.',
          'Wear loose clothing over waxed areas.',
          'Gently exfoliate after 2–3 days to help prevent ingrown hairs.',
          'Have sensitive skin, a skin condition or recent sunburn, use skin medication, or are you pregnant? Tell your therapist first.',
        ],
      },
    ],
  },
  offerBand: {
    title: 'Waxing Offers',
    text: 'Pick the offer that fits your visit. Your salon will confirm which one applies when you book.',
  },
  locationsTitle: 'Waxing Salon Near You in Bangalore',
  faqTitle: 'Waxing FAQs',
  faqs: [
    {
      q: 'Which wax is best for sensitive skin?',
      a: 'Stripless wax is often preferred for sensitive and delicate areas like the face, underarms and bikini line. Your therapist will recommend the best option for you.',
    },
    {
      q: 'What’s the difference between flavored and cartridge wax?',
      a: 'Both are removed with strips. Cartridge (roll-on) wax is applied evenly from a roller for quick, consistent coverage, while flavored wax is applied with a spatula.',
    },
    {
      q: 'How long does waxing last?',
      a: 'It varies from person to person, but because waxing removes hair from the root, smoothness typically lasts longer than shaving.',
    },
    {
      q: 'How long should my hair be before waxing?',
      a: 'Around the length of a grain of rice works best, so the wax can grip the hair properly.',
    },
    {
      q: 'Do you offer bikini waxing?',
      a: 'Yes. We offer bikini waxing with stripless wax, done gently and with complete privacy.',
    },
    {
      q: 'Is there a waxing combo?',
      a: 'Yes. The Confidence with Smooth Skin combo includes full arms, half legs and underarms waxing, threading, a Crystal Pedicure and a D-Lux Manicure.',
    },
    // TODO: add "Is waxing available for men?" here once the owner confirms the answer.
    {
      q: 'How is pricing decided?',
      a: 'It depends on the areas and wax type you choose. Message us on WhatsApp for current pricing and offers.',
    },
    {
      q: 'Where can I get waxing in Bangalore?',
      a: 'At Xing Premium Unisex Salon in Brookfield, HSR Layout and Sarjapura.',
    },
  ],
  related: {
    title: 'Pair Your Waxing With',
    items: [
      { slug: 'threading-detan', text: 'Eyebrow threading and de-tan for face, arms and legs.' },
      { slug: 'body-polish', text: 'Scrub and polish for soft, glowing skin. Women only.' },
      { slug: 'manicure-pedicure', text: 'Pampering hand and foot care to finish your look.' },
      { slug: 'hydra-facial', text: 'Our bestselling facial for deep cleansing and hydration.' },
    ],
  },
  cta: 'Get smooth, confident skin. Book your waxing at Xing today.',
};
