import type { ServicePageContent } from './types';

// TODO (owner to confirm before publishing):
//   1. What each ritual includes (D-Lux, Crystal, Alga, Tango, Detox). The card text in services.ts and the
//      "Which Ritual Is Right for You?" cards below present them as an ascending ladder; replace with the real steps.
//   2. Are manicures and pedicures offered to men? If yes, add the FAQ "Do you offer manicures and pedicures for men?"
//      (with the confirmed answer) and add "pedicure for men Bangalore" to the keywords.
//   3. Tool hygiene practice (e.g. sterilised tools, disposable files). If confirmed, add a "Hygiene" benefit;
//      until then, make no hygiene claim.
//   4. A real treatment photo to replace the hero. When added, use the alt "Spa pedicure at Xing Premium Salon Bangalore".
export const manicurePedicure: ServicePageContent = {
  slug: 'manicure-pedicure',
  order: ['intro', 'menu', 'compare', 'combo', 'benefits', 'process', 'aftercare', 'offers', 'locations', 'faq', 'related'],
  seo: {
    title: 'Manicure & Pedicure in Bangalore | Spa Pedicure | Xing Salon',
    description:
      'Relaxing manicures, spa pedicures, heel peel treatment & foot massage at Xing Salon, HSR Layout, Brookfield & Sarjapura. Soft hands, happy feet. Book now.',
    keyword: 'manicure pedicure Bangalore',
    serviceType: 'Manicure and Pedicure',
    areaServed: ['Bengaluru', 'HSR Layout', 'Brookfield', 'Sarjapura'],
    providerType: 'NailSalon',
  },
  hero: {
    eyebrow: 'Nails · Hand & Foot Care',
    h1: 'Manicure & Pedicure in Bangalore',
    sub: 'Soft hands, smooth feet and polished nails with relaxing manicures, spa pedicures and foot treatments, from a quick refresh to a full pampering ritual.',
    cta: 'Book Mani-Pedi on WhatsApp',
    chips: [
      { icon: 'sparkles', label: '5 manicure & pedicure rituals' },
      { icon: 'layers', label: 'Heel peel treatment' },
      { icon: 'pin', label: '3 salons across Bengaluru' },
    ],
    // The real pedicure lounge; replace with a treatment photo when one is available (see the TODO above).
    image: {
      src: '/images/loc-hsr-4.webp',
      alt: 'Pedicure lounge with pink armchairs at Xing Premium Salon in HSR Layout, Bangalore',
      width: 800,
      height: 600,
    },
  },
  whatsappText: 'Hi, I’d like to book a manicure/pedicure (___) at Xing',
  cardCta: 'Book this',
  intro: {
    eyebrow: 'Hand & Foot Care',
    title: 'Manicure & Pedicure Salon in HSR Layout, Brookfield & Sarjapura',
    paragraphs: [
      'Your hands and feet work hard every day. Dust, sun, closed shoes and busy routines leave them dry, rough and tired. At Xing Premium Unisex Salon, our manicures and pedicures combine nail shaping, cuticle care, exfoliation, massage and a polished finish, so your hands and feet look cared for and feel completely refreshed.',
      'Choose from five rituals, from our quick D-Lux to our most indulgent options, or target rough, dry heels with our Heel Peel Treatment. It’s the perfect weekend treat, pre-event prep or self-care habit, at any of our salons across Bangalore.',
    ],
  },
  menu: {
    eyebrow: 'Our Rituals',
    title: 'Manicure & Pedicure Services',
    askText: 'Not sure which ritual to choose? Ask us on WhatsApp.',
    // Extensions and nail art have their own pages; this page only points to them.
    moreLink: {
      slug: 'nail-extensions',
      text: 'Want longer nails or designs?',
      label: 'Nail Extensions',
      also: [{ slug: 'nail-art', label: 'Nail Art' }],
    },
  },
  compare: {
    title: 'Which Ritual Is Right for You?',
    // TODO: confirm with the owner; this ladder follows the card descriptions above.
    columns: ['Ritual', 'Focus', 'Best for'],
    rows: [
      { name: 'D-Lux', cells: ['Quick, classic care', 'Regular upkeep'] },
      { name: 'Crystal', cells: ['Extra softness', 'Dry skin'] },
      { name: 'Alga', cells: ['Deeper nourishment', 'Tired hands and feet'] },
      { name: 'Tango', cells: ['Premium indulgence', 'A special treat'] },
      { name: 'Detox', cells: ['Deep refresh', 'Dull, tired-looking skin'] },
    ],
  },
  combo: {
    badge: 'Combos',
    title: 'Mani-Pedi in Our Combos',
    text: 'Get a Crystal Pedicure and D-Lux Manicure with full arms, half legs and underarms waxing plus threading in our Waxing Combo. Or get a nail cut, file & polish in the women’s Get a Face Lift combo. All at special combo pricing.',
    includes: ['Waxing Combo: Crystal Pedicure & D-Lux Manicure', 'Women’s Get a Face Lift: Nail Cut, File & Polish'],
    actions: [
      { label: 'Waxing combo', slug: 'waxing' },
      { label: 'Women’s combo', slug: 'womens-haircut-styling' },
    ],
  },
  benefits: {
    title: 'Benefits of Regular Manicures & Pedicures',
    items: [
      { icon: 'sparkles', title: 'Neat, healthy-looking nails' },
      { icon: 'droplets', title: 'Softer hands and smoother feet' },
      { icon: 'smile', title: 'Relaxing massage' },
      { icon: 'layers', title: 'Helps with rough, dry heels' },
      { icon: 'star', title: 'Polished look for work and events' },
    ],
  },
  process: {
    title: 'What to Expect',
    steps: [
      { title: 'Soak & cleanse' },
      { title: 'Nail shaping & cuticle care' },
      { title: 'Exfoliation' },
      { title: 'Mask & massage' },
      { title: 'Polish & finish' },
    ],
  },
  aftercare: {
    title: 'Keep Hands & Feet Looking Great',
    tips: [
      'Moisturise hands and feet daily, especially heels.',
      'Wear gloves for cleaning and washing dishes.',
      'Use a cuticle oil a few times a week.',
      'Let polish dry fully before slipping on closed shoes.',
      'Book a pedicure every 3–4 weeks to keep heels smooth.',
      'Have diabetes, circulation issues, cuts or a nail or skin infection? Tell your therapist before your session.',
    ],
  },
  offerBand: {
    title: 'Mani-Pedi Offers',
    text: 'Pick the offer that fits your visit. Your salon will confirm which one applies when you book.',
  },
  locationsTitle: 'Manicure & Pedicure Near You in Bangalore',
  faqTitle: 'Manicure & Pedicure FAQs',
  faqs: [
    {
      q: 'What’s the difference between your manicure and pedicure rituals?',
      a: 'All our rituals include nail shaping, cuticle care, exfoliation, massage and polish. Higher rituals add more nourishment, longer massages and extra pampering. Your therapist can help you choose.',
    },
    {
      q: 'How often should I get a pedicure?',
      a: 'Every 3–4 weeks works well for most people and helps keep heels and cuticles in good shape.',
    },
    {
      q: 'What is a heel peel treatment?',
      a: 'It’s a targeted foot treatment that helps soften and smooth rough, dry or cracked-looking heels.',
    },
    {
      q: 'Can I get just my nails cut and polished?',
      a: 'Yes. Choose Cut & File, Normal Polish, or Cut, File & Polish for quick nail care.',
    },
    {
      q: 'Is there a combo with manicure and pedicure?',
      a: 'Yes. Our Waxing Combo includes a Crystal Pedicure and D-Lux Manicure, along with waxing and threading.',
    },
    // TODO: add "Do you offer manicures and pedicures for men?" here once the owner confirms the answer.
    {
      q: 'How is pricing decided?',
      a: 'It depends on the ritual you choose. Message us on WhatsApp for current pricing and offers.',
    },
    {
      q: 'Where can I get a manicure and pedicure in Bangalore?',
      a: 'At Xing Premium Unisex Salon in Brookfield, HSR Layout and Sarjapura.',
    },
  ],
  related: {
    title: 'Complete Your Nail Care',
    items: [
      { slug: 'nail-extensions', text: 'Gel, acrylic and poly gel extensions and overlays.' },
      { slug: 'nail-art', text: 'From French tips and chrome to 3D art.' },
      { slug: 'waxing', text: 'Flavored, roll-on and stripless wax for face, body and bikini.' },
      { slug: 'body-polish', text: 'Scrub and polish for soft, glowing skin. Women only.' },
    ],
  },
  cta: 'Treat your hands and feet. Book your manicure and pedicure at Xing today.',
};
