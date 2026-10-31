import { footer, workPhotos } from '../content';
import type { ServicePageContent } from './types';

const instagram = footer.socials.find((social) => social.icon === 'instagram')!;

export const womensHaircutStyling: ServicePageContent = {
  slug: 'womens-haircut-styling',
  bridalCare: {},
  seo: {
    title: "Women's Haircut & Styling in Bangalore – Xing Salon",
    description:
      "Expert women's haircuts, blow dries, ironing and curls at Xing Premium Unisex Salon in Sarjapur Road, HSR Layout & Brookfield, Bangalore. Book on WhatsApp today.",
    keyword: 'women’s haircut Bangalore',
    serviceType: "Women's Haircut and Hair Styling",
    areaServed: ['Bengaluru', 'Sarjapur Road', 'HSR Layout', 'Brookfield'],
  },
  hero: {
    eyebrow: 'Hair · Women’s Haircut & Styling',
    h1: 'Women’s Haircut & Hair Styling in Bangalore',
    sub: 'Precision cuts and salon-finish styling, tailored to your face, your hair and your everyday routine.',
    chips: [
      { icon: 'scissors', label: '10K+ advanced haircuts delivered' },
      { icon: 'pin', label: '3 salons across Bangalore' },
      { icon: 'sparkles', label: 'All hair lengths' },
    ],
    image: {
      src: '/images/womens-haircut-blow-dry-bangalore.webp',
      alt: 'Women’s layered haircut with a blow dry at Xing Premium Salon Bangalore',
      width: 800,
      height: 600,
    },
  },
  whatsappText: 'Hi, I’d like to book a women’s haircut/styling at Xing',
  gallery: {
    eyebrow: 'Our Work',
    title: 'Haircuts & Styling by Xing',
    text: 'Cuts and blow-dries on our own clients, photographed at our HSR Layout salon.',
    items: workPhotos(['Haircuts & Styling']),
    more: { href: instagram.href, label: 'See more on Instagram @xingpremiumsalons' },
  },
  intro: {
    title: 'A Women’s Hair Salon in Sarjapur Road, HSR Layout & Brookfield',
    paragraphs: [
      'A great haircut changes how you feel every morning. At Xing Premium Unisex Salon, every women’s haircut in Bangalore starts with a one-on-one consultation. We look at your face shape, hair texture, length goals and how much time you spend styling. Then our stylists shape a cut that grows out well and is easy to manage at home.',
      'Want a low-maintenance trim, soft face-framing layers or a complete makeover? You’ll leave with hair that looks styled and feels like you. With more than 10,000 advanced haircuts delivered, we’re a trusted choice for women across Sarjapur Road, HSR Layout and Brookfield.',
    ],
  },
  menu: {
    title: 'Women’s Haircut & Styling Services',
    text: 'Tap any service to book it at the salon nearest to you.',
  },
  lengthGuide: {
    title: 'Styling for Every Hair Length',
    text: 'We style all lengths: short, shoulder-length, below the shoulder and waist-length or longer. Longer and thicker hair takes more time and product, so your stylist will confirm the details before starting.',
  },
  compare: {
    title: 'Which Styling Is Right for You?',
    columns: ['Style', 'Finish', 'Best for'],
    rows: [
      { name: 'Blast Dry', cells: ['Natural, airy', 'Everyday freshness'] },
      { name: 'Blow Dry', cells: ['Smooth, voluminous', 'Work, dinners, meetings'] },
      { name: 'Moroccan Blow Dry', cells: ['Glossy, frizz-controlled', 'Dry or frizzy hair'] },
      { name: 'Ironing', cells: ['Sleek and straight', 'Polished events, photos'] },
      { name: 'Tongs', cells: ['Waves or curls', 'Parties, weddings, festive occasions'] },
    ],
  },
  combo: {
    id: 'womenFaceLift',
    linkTo: ['hair-spa', 'threading-detan', 'manicure'],
    title: 'Get a Face Lift — Women’s Combo',
    text: 'Haircut, nourishing hair spa, O3+ de-tan, eyebrow threading and nail cut, file & polish, all in one visit at special combo pricing.',
  },
  process: {
    title: 'What to Expect at Your Appointment',
    steps: [
      {
        title: 'Consultation',
        text: 'We talk through your face shape, hair texture, lifestyle and any reference photos.',
      },
      { title: 'Wash & condition', text: 'Your hair is washed and conditioned, ready for the cut.' },
      { title: 'Precision cut', text: 'Your stylist shapes the cut you agreed on together.' },
      { title: 'Style & finish', text: 'A salon finish, plus tips for styling it at home.' },
    ],
  },
  aftercare: {
    title: 'Keep Your Haircut & Style Looking Fresh',
    tips: [
      'Book a trim every 6–10 weeks to keep the ends healthy and the shape intact.',
      'Use a heat protectant before blow drying, ironing or curling.',
      'Sleep on a silk or satin pillowcase to make blow-dry and curls last longer.',
      'Use dry shampoo at the roots to stretch a blow dry by a day or two.',
      'Pair your haircut with a hair spa to keep lengths soft and manageable.',
    ],
  },
  offerBand: {
    title: 'Offers on Women’s Hair Services',
    text: 'Pick the offer that fits your visit. Your salon will confirm which one applies when you book.',
  },
  locationsTitle: 'Visit a Xing Salon Near You in Bangalore',
  faqTitle: 'Women’s Haircut & Styling FAQs',
  faqs: [
    {
      q: 'Do you do bridal hair styling?',
      a: 'Yes. We offer bridal and wedding-guest hair styling, including blow dries, sleek ironed looks and curls, at all three Xing salons. Book in advance on WhatsApp for your wedding date.',
    },
    {
      q: 'Which is the best salon for a women’s haircut in HSR Layout?',
      a: 'Xing Premium Unisex Salon in HSR Layout offers consultation-led women’s haircuts and professional styling, with more than 10,000 advanced haircuts delivered. We also have salons in Sarjapur Road and Brookfield.',
    },
    {
      q: 'How is pricing for a women’s haircut decided?',
      a: 'It depends on the type of cut and your hair length and volume. Message us on WhatsApp for a quick quote before your visit.',
    },
    {
      q: 'Can I bring a reference photo?',
      a: 'Yes, please do. Your stylist will tell you how the look will work with your hair texture and face shape, and adapt it if needed.',
    },
    {
      q: 'What’s the difference between a blast dry and a blow dry?',
      a: 'A blast dry is a quick rough dry with a natural finish. A blow dry uses round brushes for a smooth, voluminous, salon-finished look.',
    },
    {
      q: 'Do you do hairstyling for parties and weddings?',
      a: 'Yes. Ironing for sleek styles and tongs for waves and curls are popular choices for parties, weddings and photoshoots.',
    },
    {
      q: 'How often should I get a haircut?',
      a: 'Most women book a trim every 6–10 weeks. Shorter styles and bangs need more frequent touch-ups.',
    },
    {
      q: 'Do you style very long hair?',
      a: 'Yes. We style every length, from short to waist-length and beyond.',
    },
  ],
  related: {
    title: 'Complete Your Hair Care',
    items: [
      { slug: 'hair-spa', text: 'Nourishing spas to keep lengths soft and manageable.' },
      { slug: 'global-hair-color', text: 'Global colour, highlights and balayage.' },
      { slug: 'keratin-treatment', text: 'Keratin, smoothening and straightening for frizz-free hair.' },
      { slug: 'kids-haircut', text: 'Haircuts for boys and girls up to 10 years.' },
    ],
  },
  cta: 'Ready for your best hair yet? Book your women’s haircut at Xing today.',
};
