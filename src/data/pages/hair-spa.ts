import { footer, serviceHero, servicePhotos } from '../content';
import type { ServicePageContent } from './types';

const instagram = footer.socials.find((social) => social.icon === 'instagram')!;

export const hairSpa: ServicePageContent = {
  slug: 'hair-spa',
  seo: {
    title: 'Hair Spa in Bangalore | Olaplex & More – Xing Salon',
    description:
      'Nourishing, anti-dandruff, anti-hairfall, Moroccan & Olaplex hair spa for men and women at Xing Salon, Sarjapur Road, HSR Layout & Brookfield. Book now.',
    keyword: 'hair spa Bangalore',
    serviceType: 'Hair Spa',
    areaServed: ['Bengaluru', 'Sarjapur Road', 'HSR Layout', 'Brookfield'],
  },
  hero: {
    eyebrow: 'Hair · Hair Spa',
    h1: 'Hair Spa in Bangalore for Healthy, Shiny Hair',
    sub: 'Deep-conditioning hair spa rituals for dry, frizzy, damaged or colour-treated hair, plus scalp care for dandruff and hair fall concerns.',
    chips: [
      { icon: 'award', label: '10K+ hair treatments delivered' },
      { icon: 'offer', label: 'Buy 3, get 1 free' },
      { icon: 'users', label: 'For men & women' },
    ],
    image: serviceHero('hair-spa', 'Relaxing hair spa wash and scalp massage at a salon backwash'),
  },
  whatsappText: 'Hi, I’d like to book a hair spa at Xing',
  whatsappSuffix: '. My hair concern is ___',
  intro: {
    eyebrow: 'Hair Spa',
    title: 'Professional Hair Spa in Sarjapur Road, HSR Layout & Brookfield',
    paragraphs: [
      'Pollution, heat styling, hard water and colouring all take a toll on your hair. A professional hair spa at Xing Premium Unisex Salon restores softness, shine and manageability with deep-conditioning treatments chosen for your hair and scalp.',
      'Each session starts with a quick hair and scalp check. Then your stylist recommends the spa that suits your needs, whether that’s intense nourishment for dry lengths, scalp care for dandruff or hair fall concerns, or Olaplex bond repair for chemically treated hair. Relax through a soothing massage and leave with hair that looks and feels healthier, at any of our Bangalore salons.',
    ],
  },
  gallery: {
    eyebrow: 'Gallery',
    title: 'The Hair Spa Experience',
    text: 'Deep cleansing, nourishing masks and a slow scalp massage, chosen for your hair and scalp.',
    items: servicePhotos('hair-spa', [
      ['Deep-cleansing wash', 'Hair spa wash with a rich lather at the backwash'],
      ['Rinse & condition', 'Hair being rinsed at a salon basin during a hair spa'],
      ['Scalp massage', 'Relaxing scalp massage during a hair spa treatment'],
      ['Nourishing treatment', 'Conditioning treatment worked through curly hair'],
    ]),
    more: { href: instagram.href, label: 'See our clients’ results on Instagram @xingpremiumsalons' },
  },
  menu: {
    eyebrow: 'Our Spas',
    title: 'Hair Spa Treatments',
    text: 'Available for all hair lengths, for men and women.',
    askText: 'Not sure which spa suits you? Tell us your hair concern on WhatsApp.',
  },
  compare: {
    title: 'Which Hair Spa Is Right for You?',
    columns: ['Concern', 'Recommended spa', 'What you’ll notice'],
    rows: [
      { name: 'Dry, dull hair', cells: ['Nourishing', 'Softness'] },
      { name: 'Frizzy, rough hair', cells: ['Moroccan', 'Smoothness'] },
      { name: 'Weak, brittle hair', cells: ['Tribond', 'Strength'] },
      { name: 'Flaky, itchy scalp', cells: ['Anti-Dandruff', 'Fresher scalp'] },
      { name: 'Hair fall from breakage', cells: ['Anti-Hairfall', 'Less breakage'] },
      { name: 'Coloured or bleached hair', cells: ['Olaplex Spa', 'Repaired feel'] },
    ],
  },
  benefits: {
    title: 'Benefits of a Regular Hair Spa',
    items: [
      { icon: 'droplets', title: 'Deep hydration' },
      { icon: 'sparkles', title: 'Less frizz, more shine' },
      { icon: 'heart', title: 'Healthier-feeling scalp' },
      { icon: 'shield', title: 'Stronger, more manageable hair' },
    ],
  },
  combo: {
    badge: 'Offer',
    title: 'Buy 3 Hair Spas, Get 1 Free',
    text: 'For best results, we recommend at least 3 sittings every 2–3 weeks. Book a set of three and your fourth spa is on us.',
    includes: ['Any hair spa', 'Any hair length', 'Men & women'],
    cta: 'Start my spa plan',
  },
  process: {
    title: 'Your Hair Spa, Step by Step',
    steps: [
      { title: 'Hair & scalp consultation' },
      { title: 'Cleanse' },
      { title: 'Treatment mask or cream applied' },
      { title: 'Massage & steam' },
      { title: 'Rinse & finish' },
    ],
  },
  aftercare: {
    title: 'Make Your Hair Spa Results Last',
    tips: [
      'Use a mild, sulphate-free shampoo after your spa.',
      'Avoid heavy heat styling for a few days.',
      'Use a heat protectant whenever you blow dry, iron or curl.',
      'Keep up 3 sittings every 2–3 weeks, then monthly maintenance.',
      'Add Olaplex to your spa if your hair is coloured or bleached.',
      'If hair fall or scalp issues persist, consult a dermatologist.',
    ],
  },
  offerBand: {
    title: 'Hair Spa Offers',
    text: 'Pick the offer that fits your visit. Your salon will confirm which one applies when you book.',
  },
  locationsTitle: 'Hair Spa Near You in Bangalore',
  faqTitle: 'Hair Spa FAQs',
  faqs: [
    {
      q: 'How often should I get a hair spa?',
      a: 'For best results, we recommend at least 3 sittings every 2–3 weeks, followed by regular maintenance. That’s why we offer Buy 3, Get 1 Free on all hair spas.',
    },
    {
      q: 'Which hair spa is best for dandruff?',
      a: 'Our Anti-Dandruff Hair Spa helps reduce flakes and itchiness and leaves your scalp feeling fresh. For persistent dandruff, we recommend also consulting a dermatologist.',
    },
    {
      q: 'Does a hair spa help with hair fall?',
      a: 'Our Anti-Hairfall Hair Spa nourishes the roots and helps reduce breakage-related hair fall. Hair loss can have many causes, so please see a dermatologist if it continues.',
    },
    {
      q: 'What is an Olaplex hair spa?',
      a: 'It uses Olaplex bond-building care to help repair hair damaged by colouring, bleaching or heat styling. You can also add Olaplex to any hair spa.',
    },
    {
      q: 'Do you offer hair spa for men?',
      a: 'Yes. All our hair spas are available for men and women, and the men’s Get a Face Lift combo includes a Schwarzkopf hair spa.',
    },
    {
      q: 'How is hair spa pricing decided?',
      a: 'It depends on the spa you choose and your hair length and volume. Message us on WhatsApp for a quick quote.',
    },
    {
      q: 'Where can I get a hair spa in Bangalore?',
      a: 'At all three Xing Premium Unisex Salons: Sarjapur Road, HSR Layout and Brookfield.',
    },
  ],
  related: {
    title: 'Pair Your Spa With',
    items: [
      { slug: 'global-hair-color', text: 'Global colour, highlights and balayage.' },
      { slug: 'keratin-treatment', text: 'Keratin, smoothening and straightening for frizz-free hair.' },
      { slug: 'womens-haircut-styling', text: 'Haircuts, blow dries, ironing and curls.' },
      { slug: 'mens-haircut-beard-grooming', text: 'Haircuts, beard grooming and colour.' },
    ],
  },
  cta: 'Give your hair the care it deserves. Book your hair spa at Xing today.',
};
