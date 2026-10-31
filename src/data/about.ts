// Copy for the About page (/about). Salon details come from locations.ts.
// Keep this file free of React/asset imports: vite.config.ts also reads it to build SEO tags.
//
// TODO (owner to confirm before adding):
//   1. An optional founder note and photo for "Our Story". Nothing is invented in the meantime.
//   2. Walk-in policy and parking per salon. Both FAQs are left out until confirmed.
import { hero as landingHero } from './content';
import type { IconKey } from './pages/types';

export const about = {
  seo: {
    title: 'About Xing Premium Unisex Salon | 3 Salons in Bangalore',
    description:
      'Xing Premium Unisex Salon, est. 2020: expert hair, skin & nail care at 3 Bangalore salons in Sarjapur Road, HSR Layout & Brookfield. Find your salon.',
    keyword: 'unisex salon Bangalore',
  },
  hero: {
    eyebrow: 'About Us',
    h1: 'About Xing Premium Unisex Salon — Premium Hair, Skin & Nail Care in Bangalore',
    sub: 'Since 2020, Xing has helped Bangalore look and feel its best with precision haircuts, expert hair colour, advanced hair treatments, glowing facials and beautiful nails across three salons.',
    chips: [
      { icon: 'calendar' as IconKey, label: 'Since 2020' },
      { icon: 'pin' as IconKey, label: '3 salons in Bangalore' },
      { icon: 'sparkles' as IconKey, label: 'Hair · Skin · Nails' },
    ],
    image: { ...landingHero.image, alt: 'Xing Premium Unisex Salon interior, HSR Layout, Bangalore' },
  },
  finder: {
    title: 'Which Xing Salon Is Closest to You?',
    tattoo: 'Looking for tattoos?',
  },
  story: {
    eyebrow: 'Our Story',
    title: 'A Premium Salon Built Around You',
    paragraphs: [
      'Xing began in 2020 with a simple idea: premium salon care should feel personal. Every service should start with listening, use genuine professional products and finish with a result you love.',
      'Today, Xing Premium Unisex Salon has three salons across Bangalore, on Sarjapur Road, in HSR Layout and in Brookfield, plus a dedicated tattoo studio. Our skilled stylists and therapists use international techniques and authentic salon products to deliver precision haircuts, global colour, balayage, keratin, nanoplastia, hair botox, hair spas, facials, waxing and nail services for women, men and kids.',
    ],
  },
  // Figures as published on the service pages.
  numbers: [
    { value: 10, suffix: 'K+', label: 'Advanced haircuts' },
    { value: 10, suffix: 'K+', label: 'Hair treatments' },
    { value: 5, suffix: 'K+', label: 'Hydra facials' },
    { value: 3, suffix: '', label: 'Salons in Bangalore' },
  ],
  founded: 2020,
  why: {
    eyebrow: 'Why Xing',
    title: 'Why Clients Choose Xing',
    items: [
      { icon: 'users' as IconKey, title: 'Personalised consultation before every service' },
      { icon: 'scissors' as IconKey, title: 'Skilled, professional stylists' },
      { icon: 'star' as IconKey, title: 'International techniques' },
      { icon: 'award' as IconKey, title: 'Authentic, professional products' },
      { icon: 'shield' as IconKey, title: 'High hygiene standards' },
      { icon: 'crown' as IconKey, title: 'Premium quality, exceptional value' },
    ],
  },
  specialities: {
    title: 'Our Specialities',
    items: [
      { slug: 'global-hair-color', label: 'Hair Colour & Balayage', text: 'Global colour, highlights and soft balayage.' },
      { slug: 'keratin-treatment', label: 'Keratin, Nanoplastia & Hair Botox', text: 'Smooth, frizz-free, manageable hair.' },
      { slug: 'hair-spa', label: 'Hair Spa & Olaplex', text: 'Deep conditioning and bond repair.' },
      { slug: 'mens-haircut-beard-grooming', label: 'Men’s Grooming', text: 'Haircuts, beard grooming and colour.' },
      { slug: 'hydra-facial', label: '7-Step Hydra Facial', text: 'Our bestselling facial for instant glow.' },
      { slug: 'nail-art', label: 'Nails & Nail Art', text: 'Extensions, manicures and nail art.' },
    ],
    cta: 'View all services',
  },
  commitment: 'Your satisfaction is our commitment. Every Visit. Every Service. Every Time.',
  locations: { eyebrow: 'Visit Us', title: 'Our Salons in Bangalore' },
  gallery: { title: 'Inside Xing' },
  offers: { title: 'Offers at Every Xing Salon', cta: 'See all offers' },
  faqTitle: 'About Xing — FAQs',
  faqs: [
    {
      q: 'Where are Xing salons located in Bangalore?',
      a: 'We have three salons, on Sarjapura Road (Samvit Greens, Kasavanahalli), in HSR Layout (24th Main Road) and in Brookfield (SV Plaza, AECS Layout).',
    },
    { q: 'What are your opening hours?', a: 'All three salons are open from 10:00 AM to 9:30 PM.' },
    {
      q: 'Is Xing a unisex salon?',
      a: 'Yes. Xing Premium Unisex Salon offers hair, skin and nail services for women, men and kids.',
    },
    { q: 'Since when has Xing been operating?', a: 'Xing was established in 2020.' },
    {
      q: 'How do I book an appointment?',
      a: 'WhatsApp or call your nearest salon. Each branch has its own number, listed above.',
    },
    {
      q: 'Do you have a tattoo studio?',
      a: 'Yes. Xing Premium Tattoo Studio is in the same building as our Brookfield salon.',
    },
  ],
  cta: 'Visit your nearest Xing salon today.',
};
