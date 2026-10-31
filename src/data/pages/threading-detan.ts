import { footer, serviceHero, servicePhotos } from '../content';
import type { ServicePageContent } from './types';

// TODO (owner to confirm before publishing):
//   1. Is threading offered to men (e.g. eyebrow shaping)? If yes, add the FAQ "Is threading available for men?"
//      (with the confirmed answer) and add "eyebrow threading for men Bangalore" to the keywords.
//   2. A real treatment photo to replace the hero. When added, use the alt
//      "Eyebrow threading at Xing Premium Salon Bangalore" (or "De-tan treatment for face and neck in HSR Layout").
const instagram = footer.socials.find((social) => social.icon === 'instagram')!;

export const threadingDetan: ServicePageContent = {
  slug: 'threading-detan',
  // Threading and de-tan get their own anchored sections (#threading, #detan) so other pages can deep-link to them.
  order: [
    'intro',
    'gallery',
    'menu:threading',
    'compare',
    'menu:detan',
    'combo',
    'benefits',
    'aftercare',
    'offers',
    'locations',
    'faq',
    'related',
  ],
  seo: {
    title: 'Eyebrow Threading & De-tan in Bangalore | Xing Premium Salon',
    description:
      'Precise eyebrow & face threading plus face, arms, legs & foot de-tan for brighter-looking skin at Xing Salon, Sarjapur Road, HSR Layout & Brookfield.',
    keyword: 'eyebrow threading Bangalore',
    areaServed: ['Bengaluru', 'Sarjapura', 'HSR Layout', 'Brookfield'],
    providerType: 'BeautySalon',
    splitServices: [
      { name: 'Eyebrow and Face Threading', serviceType: 'Eyebrow and Face Threading', list: 'Threading', anchor: 'threading' },
      { name: 'De-tan Treatment', serviceType: 'De-tan Treatment', list: 'De-tan', anchor: 'detan' },
    ],
  },
  hero: {
    eyebrow: 'Skin & Body',
    // Headings use a non-breaking hyphen (U+2011) so "De-tan" never splits across lines.
    h1: 'Eyebrow Threading & De‑tan Treatment in Bangalore',
    sub: 'Perfectly shaped brows, smooth facial skin and a brighter, more even-looking glow with quick threading and de-tan treatments.',
    chips: [
      { icon: 'brush', label: 'Precise brow shaping' },
      { icon: 'sun', label: 'Face, arms, legs & foot de-tan' },
      { icon: 'pin', label: '3 salons across Bengaluru' },
    ],
    jumps: [
      { label: 'Threading', href: '#threading' },
      { label: 'De-tan', href: '#detan' },
    ],
    image: serviceHero('threading-detan', 'Eyebrow threading to shape the brows'),
  },
  whatsappText: 'Hi, I’d like to book threading/de-tan (___) at Xing',
  intro: {
    eyebrow: 'Face & Skin Essentials',
    title: 'Threading & De‑tan in Sarjapur Road, HSR Layout & Brookfield',
    paragraphs: [
      'Some of the smallest services make the biggest difference. Well-shaped eyebrows frame your face, and smooth, hair-free facial skin makes makeup sit better. A de-tan treatment helps reduce the look of tan from Bangalore’s strong sun, so skin looks brighter and more even.',
      'At Xing Premium Unisex Salon, our therapists offer precise threading for brows and face, and de-tan treatments for your face and neck, underarms, arms, legs and feet. They’re quick, affordable add-ons you can book on their own or pair with a facial, waxing or body polish, at any of our salons across Bangalore.',
    ],
  },
  gallery: {
    eyebrow: 'Gallery',
    title: 'Threading & De‑tan, Up Close',
    text: 'Precise brow shaping and de-tan treatments for brighter, more even-looking skin.',
    items: servicePhotos('threading-detan', [
      ['Clean brow line', 'Close-up of eyebrow threading for a clean brow line'],
      ['Brow shaping', 'Eyebrow shaping with threading'],
      ['Men’s threading', 'Eyebrow threading for men'],
      ['Gentle brow threading', 'Relaxed eyebrow threading on a treatment bed'],
      ['Under-eye care', 'Under-eye patch during a de-tan facial'],
      ['De-tan pack', 'De-tan pack applied to the face'],
      ['Charcoal de-tan', 'Charcoal de-tan mask with cooling eye pads'],
      ['De-tan application', 'De-tan pack being applied with a brush'],
    ]),
    more: { href: instagram.href, label: 'See our clients’ results on Instagram @xingpremiumsalons' },
  },
  // Unused: this page shows its services in the two sections below instead of tabs.
  menu: { title: 'Threading & De‑tan Services' },
  menuSections: [
    {
      id: 'threading',
      list: 'Threading',
      eyebrow: 'Threading',
      title: 'Eyebrow & Face Threading',
      compact: true,
      steps: ['Discuss brow shape', 'Cleanse', 'Precise threading', 'Soothing toner'],
    },
    {
      id: 'detan',
      list: 'De-tan',
      eyebrow: 'De-tan',
      title: 'De-tan Treatments',
      steps: ['Cleanse', 'De-tan pack applied', 'Rest', 'Remove & moisturise'],
    },
  ],
  compare: {
    title: 'Threading vs Waxing for Your Face',
    columns: ['Method', 'How it works', 'Best for', 'Precision'],
    rows: [
      {
        name: 'Threading',
        cells: ['A twisted cotton thread lifts hair from the root', 'Precise brow shaping, small areas', 'Very high, line by line'],
        current: true,
      },
      {
        name: 'Stripless Waxing',
        cells: ['Stripless wax applied and removed', 'Larger facial areas, very fine hair', 'Good for broader areas'],
        link: { slug: 'waxing', label: 'Explore face waxing' },
      },
    ],
  },
  combo: {
    badge: 'Combos',
    title: 'Threading & De‑tan in Our Combos',
    text: 'Save time with combos: the women’s Get a Face Lift includes O3+ de-tan and eyebrow threading, the men’s Get a Face Lift includes a face de-tan, and the Waxing Combo includes threading. All at special combo pricing.',
    includes: [
      'Women’s Get a Face Lift: O3+ De-tan & Eyebrow Threading',
      'Men’s Get a Face Lift: Face De-tan',
      'Waxing Combo: Threading',
    ],
    actions: [
      { label: 'Women’s combo', slug: 'womens-haircut-styling' },
      { label: 'Men’s combo', slug: 'mens-haircut-beard-grooming' },
      { label: 'Waxing combo', slug: 'waxing' },
    ],
  },
  benefits: {
    title: 'Why Book Threading & De‑tan',
    items: [
      { icon: 'brush', title: 'Beautifully framed brows' },
      { icon: 'sparkles', title: 'Smooth, makeup-ready skin' },
      { icon: 'sun', title: 'Brighter, more even-looking skin after sun' },
      { icon: 'zap', title: 'Quick add-ons to any visit' },
      { icon: 'camera', title: 'Great before events and photos' },
    ],
  },
  aftercare: {
    title: 'Aftercare Tips',
    groups: [
      {
        title: 'After threading',
        tips: [
          'Avoid makeup, heavy creams and sun on the area for a few hours.',
          'Don’t touch or rub freshly threaded skin.',
          'Book brow threading every 2–4 weeks to keep the shape neat.',
        ],
      },
      {
        title: 'After de-tan',
        tips: [
          'Wear sunscreen daily and reapply when outdoors.',
          'Cover up in strong sun to keep results longer.',
          'Moisturise regularly.',
          'Have sensitive skin, active breakouts or a skin condition? Tell your therapist first.',
        ],
      },
    ],
  },
  offerBand: {
    title: 'Offers',
    text: 'Pick the offer that fits your visit. Your salon will confirm which one applies when you book.',
  },
  locationsTitle: 'Threading & De‑tan Near You in Bangalore',
  faqTitle: 'Threading & De‑tan FAQs',
  faqs: [
    {
      q: 'How often should I get my eyebrows threaded?',
      a: 'Most people book every 2–4 weeks, depending on how fast their hair grows and how defined they like their brows.',
    },
    {
      q: 'Does threading hurt?',
      a: 'You may feel a quick pinching sensation, but it’s fast. Our therapists work precisely to keep it as comfortable as possible.',
    },
    {
      q: 'Is threading or waxing better for the face?',
      a: 'Threading is best for precise brow shaping and small areas. Stripless waxing works well for larger facial areas. Your therapist can recommend what suits your skin.',
    },
    {
      q: 'What does a de-tan treatment do?',
      a: 'A de-tan helps reduce the look of tan from sun exposure, leaving skin looking brighter and more even. Results vary with skin type and sun exposure.',
    },
    {
      q: 'Which areas can be de-tanned?',
      a: 'Face and neck, underarms, arms (half or full), legs (half or full) and feet.',
    },
    {
      q: 'Do you offer de-tan for men?',
      a: 'Yes. Face de-tan is part of our men’s Get a Face Lift combo, and de-tan treatments are available for men and women.',
    },
    // TODO: add "Is threading available for men?" here once the owner confirms the answer.
    {
      q: 'How is pricing decided?',
      a: 'It depends on the areas you choose. Message us on WhatsApp for current pricing and offers.',
    },
    {
      q: 'Where can I get threading and de-tan in Bangalore?',
      a: 'At Xing Premium Unisex Salon in Sarjapur Road, HSR Layout and Brookfield.',
    },
  ],
  related: {
    title: 'Pair It With',
    items: [
      { slug: 'waxing', text: 'Flavored, roll-on and stripless wax for face, body and bikini.' },
      { slug: 'facial-cleanup', text: 'Clean-ups and classic facials for a regular skin-care routine.' },
      { slug: 'hydra-facial', text: 'Our bestselling facial for deep cleansing and hydration.' },
      { slug: 'body-polish', text: 'Scrub and polish for soft, glowing skin. Women only.' },
    ],
  },
  cta: 'Quick, precise and glowing. Book threading or de-tan at Xing today.',
};
