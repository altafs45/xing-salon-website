import type { ServicePageContent } from './types';

export const keratinHairTreatment: ServicePageContent = {
  slug: 'keratin-hair-treatment',
  seo: {
    title: 'Keratin & Hair Smoothening in Bangalore | Xing Premium Salon',
    description:
      'Frizz-free, smooth, straight hair with keratin, smoothening & straightening at Xing Salon, HSR Layout, Brookfield & Sarjapura. Free Acai oil treatment.',
    keyword: 'keratin treatment Bangalore',
    serviceType: 'Keratin Treatment, Hair Smoothening and Hair Straightening',
    areaServed: ['Bengaluru', 'HSR Layout', 'Brookfield', 'Sarjapura'],
  },
  hero: {
    eyebrow: 'Hair · Hair Treatments',
    h1: 'Keratin Treatment, Hair Smoothening & Straightening in Bangalore',
    sub: 'Say goodbye to frizz. Get smooth, glossy, easy-to-manage hair with professional keratin, smoothening and straightening treatments.',
    cta: 'Book a Consultation on WhatsApp',
    chips: [
      { icon: 'award', label: '10K+ hair treatments delivered' },
      { icon: 'offer', label: 'Free Acai oil treatment' },
      { icon: 'sparkles', label: 'All hair lengths' },
    ],
    // Placeholder until a real photo is added as /images/keratin-hair-treatment-bangalore.webp.
    image: {
      src: '/images/loc-sarjapur-2.webp',
      alt: 'Styling floor for a keratin hair treatment at Xing Premium Salon Bangalore',
      width: 800,
      height: 600,
    },
  },
  whatsappText: 'Hi, I’d like a consultation for keratin/smoothening/straightening at Xing',
  whatsappSuffix: '. My hair length is ___',
  intro: {
    eyebrow: 'Hair Treatments',
    title: 'Frizz-Free Hair Treatments in HSR Layout, Brookfield & Sarjapura',
    paragraphs: [
      'Bangalore’s humidity, pollution and daily heat styling can leave hair frizzy, puffy and hard to manage. At Xing Premium Unisex Salon, our keratin, smoothening and straightening treatments transform unruly hair into smooth, shiny, salon-finish hair you can style in minutes.',
      'Every treatment begins with a consultation. Your stylist assesses your hair texture, previous chemical history and the look you want, from soft natural movement to sleek, poker-straight. With more than 10,000 hair treatments delivered and a complimentary Acai oil treatment with every hair treatment, you’re in experienced hands at any of our Bangalore salons.',
    ],
  },
  menu: {
    eyebrow: 'Treatments',
    title: 'Choose Your Hair Treatment',
    text: 'Available for all hair lengths, for women and men.',
    askText: 'Not sure which treatment suits your hair? Send us a photo on WhatsApp.',
    moreLink: {
      slug: 'hair-botox-nanoplastia',
      text: 'Looking for Hair Botox, Cysteine or Nanoplastia?',
      label: 'Explore our advanced hair treatments',
    },
  },
  compare: {
    title: 'Keratin vs Smoothening vs Straightening',
    columns: ['Treatment', 'Finish', 'Best for', 'How it wears', 'Maintenance'],
    rows: [
      {
        name: 'Keratin',
        cells: ['Smooth with natural volume', 'Frizzy hair, keeping volume', 'Gradually softens over time', 'Repeat as it wears off'],
      },
      {
        name: 'Smoothening',
        cells: [
          'Soft, straight, natural fall',
          'Wavy or frizzy hair',
          'Lasts longer; regrowth shows natural texture',
          'Touch-up as hair grows',
        ],
      },
      {
        name: 'Straightening',
        cells: [
          'Sleek, poker-straight',
          'Curly or very wavy hair, straightest result',
          'Treated hair stays straight; regrowth shows natural texture',
          'Touch-up as hair grows',
        ],
      },
    ],
  },
  benefits: {
    title: 'Why Choose a Professional Hair Treatment',
    items: [
      { icon: 'wind', title: 'Frizz-free in humid weather' },
      { icon: 'clock', title: 'Faster daily styling' },
      { icon: 'sparkles', title: 'Glossy, smoother hair' },
      { icon: 'users', title: 'Expert consultation for your hair type' },
    ],
  },
  combo: {
    badge: 'Included',
    title: 'Complimentary Acai Oil Treatment',
    text: 'Every keratin, smoothening and straightening treatment at Xing comes with a complimentary Acai oil treatment to nourish and add shine.',
    includes: ['Included with all hair treatments', 'Every hair length', 'Men & women'],
    cta: 'Book my treatment',
  },
  process: {
    title: 'How Your Treatment Works',
    steps: [
      { title: 'Consultation & hair assessment' },
      { title: 'Cleanse' },
      { title: 'Treatment applied section by section' },
      { title: 'Processing & blow dry' },
      { title: 'Sealing, finish & aftercare guidance' },
    ],
  },
  aftercare: {
    title: 'Aftercare for Longer-Lasting Results',
    tips: [
      'Follow your stylist’s advice on when to wash your hair for the first time.',
      'Use a sulphate-free shampoo and conditioner.',
      'Avoid tight ponytails, clips and tucking hair behind your ears in the first few days.',
      'Use a heat protectant whenever you style.',
      'Book a hair spa every few weeks to keep treated hair nourished.',
      'Tell your stylist about any recent colouring, scalp sensitivity or pregnancy before treatment.',
    ],
  },
  offerBand: {
    title: 'Hair Treatment Offers',
    text: 'Pick the offer that fits your visit. Your salon will confirm which one applies when you book.',
  },
  locationsTitle: 'Keratin & Smoothening Near You in Bangalore',
  faqTitle: 'Keratin, Smoothening & Straightening FAQs',
  faqs: [
    {
      q: 'What is the difference between keratin and smoothening?',
      a: 'Keratin smooths frizz and adds shine while keeping natural volume. Smoothening relaxes waves and curls into a softer, straighter finish. Your stylist will recommend the right one after checking your hair.',
    },
    {
      q: 'Which is better for frizzy hair in Bangalore?',
      a: 'Keratin is ideal if you mainly want frizz control with natural volume. Smoothening suits wavy hair that you want straighter and easier to style.',
    },
    {
      q: 'How long do the results last?',
      a: 'It depends on your hair type, growth and aftercare. Keratin gradually softens over time. With smoothening and straightening, the treated hair stays smooth or straight while new growth comes in with your natural texture.',
    },
    {
      q: 'Do you offer these treatments for men?',
      a: 'Yes. Keratin, smoothening and straightening are available for both men and women at all three Xing salons.',
    },
    {
      q: 'Is anything included with the treatment?',
      a: 'Yes. Every hair treatment at Xing includes a complimentary Acai oil treatment.',
    },
    {
      q: 'How is the price decided?',
      a: 'It depends on the treatment and your hair length and volume. Message us on WhatsApp with your hair length for a quick quote.',
    },
    {
      q: 'Where can I get keratin or smoothening in Bangalore?',
      a: 'At Xing Premium Unisex Salon in Brookfield, HSR Layout and Sarjapura.',
    },
  ],
  related: {
    title: 'Explore More Hair Care',
    items: [
      { slug: 'hair-botox-nanoplastia', text: 'Hair botox, cysteine and nanoplastia.' },
      { slug: 'hair-spa', text: 'Nourishing, scalp-care and Olaplex spas.' },
      { slug: 'hair-color', text: 'Global colour, highlights and balayage.' },
      { slug: 'womens-haircut-styling', text: 'Haircuts, blow dries, ironing and curls.' },
    ],
  },
  cta: 'Ready for smooth, frizz-free hair? Book your consultation at Xing today.',
};
