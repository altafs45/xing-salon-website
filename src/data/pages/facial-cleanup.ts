import type { ServicePageContent } from './types';

// TODO (owner to confirm before publishing):
//   1. What each tier includes: Masque vs Premium clean-up, and Express vs Premium vs Ultra facial.
//      The card descriptions in services.ts and the comparison below describe them as increasing levels of care.
//   2. Whether facials are offered to men. If not, remove the "available for men" FAQ.
export const facialCleanup: ServicePageContent = {
  slug: 'facial-cleanup',
  seo: {
    title: 'Facial & Face Clean-up in Bangalore | Xing Premium Salon',
    description:
      'Express, premium & ultra facials plus face clean-ups for fresh, glowing skin at Xing Salon, HSR Layout, Brookfield & Sarjapura. Book on WhatsApp.',
    keyword: 'facial in Bangalore',
    serviceType: 'Facial and Face Clean-up',
    areaServed: ['Bengaluru', 'HSR Layout', 'Brookfield', 'Sarjapura'],
  },
  hero: {
    eyebrow: 'Skin & Body · Facials & Clean-ups',
    h1: 'Facials & Face Clean-ups in Bangalore',
    sub: 'From a quick clean-up to an indulgent ultra facial, professional skin care that refreshes, nourishes and brings back your natural glow.',
    cta: 'Book a Facial on WhatsApp',
    chips: [
      { icon: 'sparkles', label: 'Known for our facials' },
      { icon: 'layers', label: 'Clean-ups to premium facials' },
      { icon: 'pin', label: '3 salons across Bengaluru' },
    ],
    // Placeholder until a real photo is added as /images/facial-treatment-bangalore.webp.
    image: {
      src: '/images/loc-hsr-4.webp',
      alt: 'Lounge at Xing Premium Salon in HSR Layout, Bangalore, where facial treatments are offered',
      width: 800,
      height: 600,
    },
  },
  whatsappText: 'Hi, I’d like to book a facial/clean-up at Xing',
  whatsappSuffix: '. My skin concern is ___',
  intro: {
    eyebrow: 'Skin Care',
    title: 'Facials & Clean-ups in HSR Layout, Brookfield & Sarjapura',
    paragraphs: [
      'City life is hard on your skin. Pollution, sun, screen time and stress can leave it dull, congested and tired-looking. At Xing Premium Unisex Salon, our facials and face clean-ups help you reset. Choose a quick clean-up to clear away grime and refresh your skin, or a full facial for deeper nourishment, relaxation and visible glow.',
      'Every session starts with a quick skin check, so your therapist can tailor the treatment to your skin’s needs. Whether you want a regular skin-care routine or glowing skin before a celebration, you’ll find the right facial at our salons across Bangalore.',
    ],
  },
  menu: {
    eyebrow: 'Treatments',
    title: 'Choose Your Facial or Clean-up',
    askText: 'Not sure which facial suits your skin? Ask us on WhatsApp.',
  },
  compare: {
    title: 'Clean-up vs Facial: Which Do You Need?',
    columns: ['Option', 'Best for', 'Includes', 'Choose if'],
    // TODO: confirm the "Includes" row against the real steps of each treatment.
    rows: [
      {
        name: 'Clean-up',
        cells: ['Quick freshen-up, regular upkeep', 'Cleansing + mask', 'Your skin feels dull or congested'],
      },
      {
        name: 'Classic Facial (Express / Premium / Ultra)',
        cells: ['Nourishment, relaxation, glow', 'Cleansing, massage, mask & nourishment', 'You want pampering plus glow'],
      },
      {
        name: 'Hydra Facial',
        cells: [
          'Deep hydration and instant radiance',
          '7-step cleanse, exfoliation, extraction & hydration',
          'You want the biggest glow, or have an event coming up',
        ],
        slug: 'hydra-facial',
      },
    ],
  },
  benefits: {
    title: 'Benefits of Regular Facials',
    items: [
      { icon: 'droplets', title: 'Cleaner-looking skin' },
      { icon: 'sparkles', title: 'Natural glow & radiance' },
      { icon: 'smile', title: 'Relaxation & stress relief' },
      { icon: 'layers', title: 'Smoother-feeling texture' },
      { icon: 'calendar', title: 'Skin that’s ready for makeup and events' },
    ],
  },
  goals: {
    title: 'Find Your Facial by Skin Goal',
    items: [
      { goal: 'Quick refresh', service: 'Masque Clean-up' },
      { goal: 'Congested, tired skin', service: 'Premium Clean-up' },
      { goal: 'Glow in less time', service: 'Express Facial' },
      { goal: 'Pamper + glow', service: 'Premium Facial' },
      { goal: 'Ultimate indulgence', service: 'Ultra Facial' },
      { goal: 'Maximum hydration', service: 'Hydra Facial', slug: 'hydra-facial' },
    ],
    note: 'Have sensitive skin, active breakouts, a skin condition, or recent skin treatments, or are you pregnant? Tell your therapist before your session.',
  },
  process: {
    title: 'What to Expect During Your Facial',
    steps: [
      { title: 'Skin check' },
      { title: 'Cleanse' },
      { title: 'Exfoliate & steam' },
      { title: 'Treatment, massage & mask' },
      { title: 'Moisturise & protect' },
    ],
  },
  aftercare: {
    title: 'Skin Care After Your Facial',
    tips: [
      'Avoid heavy makeup for the rest of the day.',
      'Skip scrubs and strong actives for a few days.',
      'Wear sunscreen daily.',
      'Drink water and keep your skin moisturised.',
      'Book a clean-up every 2–3 weeks or a facial every 3–4 weeks to maintain results.',
      'Planning for an event? Book your facial a few days before, not the same day.',
    ],
  },
  offerBand: {
    title: 'Facial Offers',
    text: 'Pick the offer that fits your visit. Your salon will confirm which one applies when you book.',
  },
  locationsTitle: 'Facial Salon Near You in Bangalore',
  faqTitle: 'Facial & Clean-up FAQs',
  faqs: [
    {
      q: 'What is the difference between a clean-up and a facial?',
      a: 'A clean-up is a quicker treatment focused on cleansing and freshening your skin. A facial goes further with massage, nourishment and masks for a deeper glow and relaxation.',
    },
    {
      q: 'Which facial is best for glowing skin?',
      a: 'For a quick glow, try our Express Facial. For deeper nourishment, choose Premium or Ultra. For maximum hydration and radiance, our bestselling 7-Step Hydra Facial is the top choice.',
    },
    {
      q: 'How often should I get a facial?',
      a: 'Most people book a facial every 3–4 weeks and a clean-up every 2–3 weeks in between. Your therapist can suggest a routine for your skin.',
    },
    {
      q: 'Can I get a facial before a wedding or party?',
      a: 'Yes. Book your facial a few days before the event so your skin has time to settle and glow.',
    },
    // TODO: confirm with the owner that facials are offered to men; remove this entry if they are not.
    {
      q: 'Are facials available for men?',
      a: 'Yes. Our clean-ups and facials are available for both men and women.',
    },
    {
      q: 'How is pricing decided?',
      a: 'It depends on the facial or clean-up you choose. Message us on WhatsApp for current pricing and offers.',
    },
    {
      q: 'Where can I get a facial in Bangalore?',
      a: 'At Xing Premium Unisex Salon in Brookfield, HSR Layout and Sarjapura.',
    },
  ],
  related: {
    title: 'Complete Your Skin Care',
    items: [
      { slug: 'hydra-facial', text: 'Our bestselling seven-step facial for deep hydration.' },
      { slug: 'threading-detan', text: 'Eyebrow threading and tan removal for face, arms and legs.' },
      { slug: 'body-polish', text: 'Scrub and polish for smooth, soft skin.' },
      { slug: 'waxing', text: 'Flavored, cartridge and stripless wax for face and body.' },
    ],
  },
  cta: 'Treat your skin to some care. Book your facial or clean-up at Xing today.',
};
