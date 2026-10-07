import type { ServicePageContent } from './types';

export const hairColor: ServicePageContent = {
  slug: 'hair-color',
  seo: {
    title: 'Hair Colour, Highlights & Balayage in Bangalore | Xing Salon',
    description:
      'Global hair colour, ammonia-free colour, highlights, balayage & fashion colours at Xing Salon, HSR Layout, Brookfield & Sarjapura. 50% off Olaplex top-up.',
    keyword: 'hair colour Bangalore',
    serviceType: 'Hair Colouring, Highlights and Balayage',
    areaServed: ['Bengaluru', 'HSR Layout', 'Brookfield', 'Sarjapura'],
  },
  hero: {
    eyebrow: 'Hair · Hair Colour',
    h1: 'Hair Colour, Highlights & Balayage in Bangalore',
    sub: 'From seamless grey coverage to sun-kissed balayage and bold fashion shades, hair colour that’s tailored to your skin tone, style and hair health.',
    cta: 'Book a Colour Consultation on WhatsApp',
    chips: [
      { icon: 'palette', label: 'Known for our hair colour' },
      { icon: 'shield', label: 'Ammonia-free options' },
      { icon: 'offer', label: '50% off Olaplex top-up' },
    ],
    // Placeholder until real colour work is added as /images/balayage-hair-colour-bangalore.webp.
    image: {
      src: '/images/loc-hsr-1.webp',
      alt: 'Styling stations at the Xing hair colour salon in HSR Layout, Bangalore',
      width: 800,
      height: 600,
    },
  },
  whatsappText: 'Hi, I’d like a hair colour consultation at Xing',
  whatsappSuffix: '. I’m looking for ___ (global/highlights/balayage/fashion colour)',
  intro: {
    eyebrow: 'Hair Colour',
    title: 'Expert Hair Colour Salon in HSR Layout, Brookfield & Sarjapura',
    paragraphs: [
      'The right hair colour can brighten your complexion, refresh your look and boost your confidence. At Xing Premium Unisex Salon, hair colour is one of our specialities. We offer everything from rich global colour and gentle ammonia-free options to dimensional highlights, soft balayage and playful fashion shades.',
      'Every colour service starts with a consultation. Your stylist considers your skin tone, natural base, previous colour and the result you want, then creates a shade that suits you. Pair your colour with an Olaplex top-up at 50% off to protect and strengthen your hair. Visit any of our salons in Bangalore.',
    ],
  },
  menu: {
    eyebrow: 'Colour Services',
    title: 'Our Hair Colour Services',
    text: 'For all hair lengths, for women and men. Pre-lightening may be needed for some shades.',
    askText: 'Not sure which shade suits you? Send us a photo and your inspiration on WhatsApp.',
    moreLink: {
      slug: 'mens-haircut-grooming',
      text: 'Men’s hair colour, highlights & beard colour',
      label: 'Men’s Grooming',
    },
  },
  compare: {
    title: 'Global Colour vs Highlights vs Balayage',
    columns: ['Technique', 'Look', 'Best for', 'Grow-out', 'Maintenance'],
    rows: [
      {
        name: 'Global Colour',
        cells: ['One even shade', 'Grey coverage, full colour change', 'Visible root line, touch-ups needed', 'Root touch-ups'],
      },
      {
        name: 'Highlights',
        cells: ['Brighter, defined strands', 'Adding dimension and brightness', 'Gradual', 'Regular refresh'],
      },
      {
        name: 'Balayage',
        cells: ['Soft, blended, natural', 'Low-maintenance, lived-in colour', 'Softest, most blended grow-out', 'Fewer visits'],
      },
    ],
  },
  benefits: {
    title: 'Why Choose Xing for Hair Colour',
    items: [
      { icon: 'palette', title: 'Shades matched to your skin tone' },
      { icon: 'shield', title: 'Ammonia-free options' },
      { icon: 'layers', title: 'Olaplex care for stronger hair' },
      { icon: 'users', title: 'Consultation before every colour' },
    ],
  },
  combo: {
    badge: 'Offer',
    title: '50% Off Olaplex Top-Up With Any Hair Colour',
    text: 'Colouring and lightening can weaken hair. Add an Olaplex top-up to your colour service at half price to help protect, repair and strengthen your hair.',
    includes: ['Any colour service', 'All hair lengths', 'Men & women'],
    cta: 'Add Olaplex to my colour',
    linkTo: 'hair-spa',
  },
  process: {
    title: 'Your Hair Colour Appointment',
    steps: [
      { title: 'Consultation', text: 'Skin tone, base, history and inspiration.' },
      { title: 'Shade & technique plan', text: 'Including pre-lightening, if needed.' },
      { title: 'Colour application' },
      { title: 'Process & rinse' },
      { title: 'Condition, style & aftercare tips' },
    ],
  },
  aftercare: {
    title: 'How to Make Your Hair Colour Last',
    tips: [
      'Wait at least a couple of days before your first wash.',
      'Use a colour-safe, sulphate-free shampoo.',
      'Wash with cool or lukewarm water to reduce fading.',
      'Use a heat protectant before blow drying, ironing or curling.',
      'Protect your hair from strong sun and chlorinated water.',
      'Book a hair spa or Olaplex treatment to keep coloured hair healthy.',
      'First time colouring or have sensitive skin? Ask us about a patch test before your appointment.',
    ],
  },
  offerBand: {
    title: 'Hair Colour Offers',
    text: 'Pick the offer that fits your visit. Your salon will confirm which one applies when you book.',
  },
  locationsTitle: 'Hair Colour Salon Near You in Bangalore',
  faqTitle: 'Hair Colour FAQs',
  faqs: [
    {
      q: 'What is the difference between highlights and balayage?',
      a: 'Highlights are lighter strands placed for brighter, more defined dimension. Balayage is hand-painted for a softer, blended, natural look that grows out more gradually.',
    },
    {
      q: 'Do you offer ammonia-free hair colour?',
      a: 'Yes. Both global colour and root touch-up are available in ammonia-free versions at all Xing salons.',
    },
    {
      q: 'Can hair colour cover grey hair?',
      a: 'Yes. Global colour and root touch-ups are popular for covering greys. Your stylist will choose the right shade for your base.',
    },
    {
      q: 'Will colouring damage my hair?',
      a: 'Colouring and lightening can weaken hair, so we recommend adding Olaplex, now at 50% off with any colour, plus regular hair spas to keep hair strong and healthy.',
    },
    {
      q: 'Do I need pre-lightening for my shade?',
      a: 'Pre-lightening may be needed for lighter or vivid shades, especially on dark or previously coloured hair. Your stylist will confirm during your consultation.',
    },
    {
      q: 'How often do I need a root touch-up?',
      a: 'Most people book one every 4–6 weeks, depending on how fast their hair grows and how visible their greys or regrowth are.',
    },
    {
      q: 'How is hair colour pricing decided?',
      a: 'It depends on the service, technique and your hair length and volume. Message us on WhatsApp for a quick quote.',
    },
    {
      q: 'Where can I get balayage or highlights in Bangalore?',
      a: 'At Xing Premium Unisex Salon in Brookfield, HSR Layout and Sarjapura.',
    },
  ],
  related: {
    title: 'Complete Your Colour Care',
    items: [
      { slug: 'hair-spa', text: 'Nourishing and Olaplex spas for coloured hair.' },
      { slug: 'keratin-hair-treatment', text: 'Keratin, smoothening and straightening for frizz-free hair.' },
      { slug: 'womens-haircut-styling', text: 'Haircuts, blow dries, ironing and curls.' },
      { slug: 'mens-haircut-grooming', text: 'Men’s colour, highlights and beard colour.' },
    ],
  },
  cta: 'Ready for a new shade? Book your hair colour consultation at Xing today.',
};
