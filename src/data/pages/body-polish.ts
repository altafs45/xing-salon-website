import { footer, serviceHero, servicePhotos } from '../content';
import type { ServicePageContent } from './types';

// TODO (owner to confirm before publishing):
//   1. The menu poster shows a "Members Only" ribbon on body polish. Is it for members only, or open to all female
//      clients? If members only, add a clear note and a link to memberships in the hero, the service cards and the FAQ.
//   2. Whether every salon has the shower needed for the full body polish. If not, name the salons that do in the
//      combo card, the "Full Body vs Area Polish" cards and the FAQ.
//   3. A real treatment photo (hands, arms or shoulders in a spa setting, nothing revealing) to replace the hero.
const instagram = footer.socials.find((social) => social.icon === 'instagram')!;

export const bodyPolish: ServicePageContent = {
  slug: 'body-polish',
  order: ['intro', 'gallery', 'combo', 'menu', 'benefits', 'occasions', 'compare', 'process', 'aftercare', 'bridal', 'offers', 'locations', 'faq', 'related'],
  bridalCare: { cards: ['glow', 'waxing', 'nails'] },
  seo: {
    title: 'Body Polishing in Bangalore for Women – Xing Salon',
    description:
      'Full body polish with scrub & lotion for soft, glowing skin, plus free head massage. Women only at Xing Salon, Sarjapur Road, HSR Layout & Brookfield.',
    keyword: 'body polishing Bangalore',
    serviceType: 'Body Polishing',
    areaServed: ['Bengaluru', 'Sarjapur Road', 'HSR Layout', 'Brookfield'],
    audienceGender: 'female',
    providerType: 'BeautySalon',
  },
  hero: {
    eyebrow: 'Skin & Body · Women Only',
    h1: 'Body Polishing in Bangalore for Soft, Glowing Skin',
    sub: 'A full-body refresh of shower, scrub, polish and nourishing lotion that leaves your skin soft, smooth and glowing from head to toe.',
    cta: 'Book Body Polish on WhatsApp',
    chips: [
      { icon: 'users', label: 'Women only' },
      { icon: 'offer', label: 'Free head massage with full body polish' },
      { icon: 'pin', label: '3 salons across Bangalore' },
    ],
    image: serviceHero('body-polish', 'Body polish scrub being massaged over the back'),
  },
  whatsappText: 'Hi, I’d like to book a body polish (___ full body / area) at Xing',
  intro: {
    eyebrow: 'Body Care',
    title: 'Body Polishing for Women in Sarjapur Road, HSR Layout & Brookfield',
    paragraphs: [
      'Your skin deserves the same care below the neck. Sun, pollution and dryness can leave arms, legs and back looking dull and feeling rough. Body polishing at Xing Premium Unisex Salon gently exfoliates away dull, dry skin and follows with a polish and a nourishing lotion. Your skin is left soft, smooth and visibly glowing.',
      'Choose a full body polish for the complete experience, including a refreshing shower and a complimentary head massage, or polish just the areas you want. It’s a popular choice before weddings, holidays and celebrations, or simply as a self-care ritual. Our body polish service is for women, at our salons across Bangalore.',
    ],
  },
  gallery: {
    eyebrow: 'Gallery',
    title: 'Your Body Polish, Up Close',
    text: 'A full-body scrub, massage and nourishing wrap for smooth, glowing skin.',
    items: servicePhotos('body-polish', [
      ['Exfoliating scrub', 'Body scrub massaged across the shoulders'],
      ['Dry brushing', 'Dry brushing before a body polish'],
      ['Body scrub', 'Body polish scrub applied across the back'],
    ]),
    more: { href: instagram.href, label: 'See our clients’ results on Instagram @xingpremiumsalons' },
  },
  combo: {
    badge: 'Signature',
    title: 'Full Body Polish + Free Head Massage',
    text: 'Our signature full-body refresh: shower, scrub, polish and nourishing body lotion, followed by a complimentary relaxing head massage.',
    includes: ['Shower', 'Full-body scrub', 'Polish', 'Nourishing lotion', 'Free head massage'],
    cta: 'Book full body polish',
  },
  menu: {
    eyebrow: 'Choose Your Area',
    title: 'Body Polish Services',
    askText: 'Not sure which areas to choose? Ask us on WhatsApp.',
  },
  benefits: {
    title: 'Benefits of Body Polishing',
    items: [
      { icon: 'layers', title: 'Removes dull, dry surface skin' },
      { icon: 'droplets', title: 'Softer, smoother-feeling skin' },
      { icon: 'sparkles', title: 'Natural, healthy-looking glow' },
      { icon: 'smile', title: 'Relaxing self-care ritual' },
      { icon: 'calendar', title: 'Skin that’s ready for events and outfits' },
    ],
  },
  occasions: {
    title: 'When to Book a Body Polish',
    items: [
      { icon: 'heart', label: 'Before your wedding or pre-wedding functions' },
      { icon: 'sun', label: 'Before a beach holiday' },
      { icon: 'sparkles', label: 'Before parties and festive occasions' },
      { icon: 'camera', label: 'Before a photoshoot' },
      { icon: 'calendar', label: 'A monthly self-care treat' },
    ],
  },
  compare: {
    title: 'Full Body vs Area Polish',
    columns: ['Option', 'What you get', 'Includes', 'Best for'],
    rows: [
      {
        name: 'Full Body Polish',
        cells: ['Complete head-to-toe care', 'Shower and a free head massage', 'Events and complete pampering'],
        current: true,
      },
      {
        name: 'Area Polish',
        cells: ['Targeted care for arms, underarms, back or legs', 'Scrub, polish and lotion on the areas you choose', 'A quick refresh of specific areas'],
      },
    ],
  },
  process: {
    title: 'Your Body Polish, Step by Step',
    steps: [
      { title: 'Consultation', text: 'Choose full body or the areas you want polished.' },
      { title: 'Gentle scrub', text: 'Full body or your chosen areas.' },
      { title: 'Polish' },
      { title: 'Shower & cleanse', text: 'With the full body polish.' },
      { title: 'Nourishing body lotion', text: 'Plus a head massage with the full body polish.' },
    ],
  },
  aftercare: {
    eyebrow: 'Prep & Aftercare',
    title: 'Before & After Your Body Polish',
    tips: [
      'Avoid waxing or shaving right before or right after your polish.',
      'Wear loose, comfortable clothes to your appointment.',
      'Moisturise daily afterwards to keep skin soft.',
      'Use sunscreen on exposed areas.',
      'For events, book 1–3 days before the occasion.',
      'Have sensitive skin, cuts, sunburn or a skin condition, or are you pregnant? Let your therapist know beforehand.',
    ],
  },
  offerBand: {
    title: 'Body Polish Offers',
    text: 'Pick the offer that fits your visit. Your salon will confirm which one applies when you book.',
  },
  locationsTitle: 'Body Polishing Near You in Bangalore',
  faqTitle: 'Body Polish FAQs',
  faqs: [
    {
      q: 'What is body polishing?',
      a: 'Body polishing is a body treatment that exfoliates dull, dry skin with a scrub, then polishes and moisturises it, leaving skin soft, smooth and glowing.',
    },
    {
      q: 'What’s included in a full body polish at Xing?',
      a: 'A shower, a full-body scrub, polish and a nourishing body lotion, plus a complimentary head massage.',
    },
    {
      q: 'Is body polishing available for men?',
      a: 'Our body polish service is currently available for female clients only.',
    },
    {
      q: 'When should I get a body polish before my wedding?',
      a: 'Book your final session 1–3 days before the occasion. Many brides also start a few weeks earlier for the best glow.',
    },
    {
      q: 'Can I polish just my arms or legs?',
      a: 'Yes. Choose from underarms, full arms, back, half legs or full legs, or go for the full body.',
    },
    {
      q: 'Should I wax before or after a body polish?',
      a: 'Avoid waxing right before or right after your polish to keep your skin comfortable. Ask us about the best timing when you book.',
    },
    {
      q: 'How is pricing decided?',
      a: 'It depends on the areas you choose. Message us on WhatsApp for current pricing and offers.',
    },
    {
      q: 'Where can I get body polishing in Bangalore?',
      a: 'At Xing Premium Unisex Salon in Sarjapur Road, HSR Layout and Brookfield.',
    },
  ],
  related: {
    title: 'Complete Your Pampering',
    items: [
      { slug: 'waxing', text: 'Flavored, cartridge and stripless wax for face and body.' },
      { slug: 'threading-detan', text: 'Eyebrow threading and de-tan for face, arms and legs.' },
      { slug: 'hydra-facial', text: 'Our bestselling facial for deep cleansing and hydration.' },
      { slug: 'manicure', text: 'Pampering hand and foot care to finish your glow.' },
    ],
  },
  cta: 'Treat yourself to soft, glowing skin. Book your body polish at Xing today.',
};
