import type { ServicePageContent } from './types';

export const mensHaircutGrooming: ServicePageContent = {
  slug: 'mens-haircut-grooming',
  seo: {
    title: "Men's Haircut & Beard Grooming in Bangalore | Xing Salon",
    description:
      "Expert men's haircuts, beard trims, shaves and grooming combos at Xing Premium Salon in HSR Layout, Brookfield & Sarjapura. Book on WhatsApp.",
    keyword: 'men’s haircut Bangalore',
    serviceType: "Men's Haircut and Beard Grooming",
  },
  hero: {
    eyebrow: 'Hair · Men’s Grooming',
    h1: 'Men’s Haircut & Beard Grooming in Bangalore',
    sub: 'Sharp cuts, clean beards and grooming that fits your routine — at three Xing salons across Bengaluru.',
    tagline: 'Haircuts · Beard Grooming · Men’s Colour',
    chips: [
      { icon: 'scissors', label: '10K+ advanced haircuts delivered' },
      { icon: 'pin', label: '3 locations' },
      { icon: 'offer', label: 'Tuesdays: 25% off' },
    ],
    // Placeholder until a real photo is added as /images/mens-haircut-beard-grooming-bangalore.webp.
    image: {
      src: '/images/svc-men.webp',
      alt: 'Styling stations for men’s haircut and beard grooming at Xing Premium Salon Bangalore',
      width: 640,
      height: 480,
    },
  },
  whatsappText: 'Hi, I’d like to book a men’s haircut at Xing',
  intro: {
    title: 'Your Men’s Grooming Salon in HSR Layout, Brookfield & Sarjapura',
    paragraphs: [
      'Whether you need a quick clean-up before work or a complete new look, Xing Premium Unisex Salon makes men’s grooming in Bangalore simple. Our stylists start with a short consultation about your face shape, hair texture and daily styling time, then cut and shape to suit you — not a one-size-fits-all template.',
      'Choose a classic haircut, a creative cut, a sharp beard trim, a hot-towel-style clean shave, or go further with men’s hair colour and highlights. Your stylist confirms the service with you before you sit in the chair.',
    ],
  },
  menu: {
    title: 'Men’s Haircut & Grooming Services',
    text: 'Tap any service to book it at the salon nearest to you.',
  },
  compare: {
    title: 'Beard Trim vs Shave vs Styling',
    columns: ['Service', 'Best for'],
    rows: [
      { name: 'Trim', cells: ['Keeping your current beard neat'] },
      { name: 'Shave', cells: ['A clean-shaven look'] },
      { name: 'Styling', cells: ['A defined, shaped beard style'] },
    ],
  },
  combo: {
    id: 'menFaceLift',
    linkTo: ['hair-spa', 'threading-detan'],
    title: 'Get a Face Lift — Men’s Combo',
    text: 'Haircut, beard trim or shave, hair wash, Schwarzkopf hair spa and face de-tan, all in one visit at special combo pricing.',
  },
  process: {
    title: 'What to Expect at Your Appointment',
    steps: [
      { title: 'Consult', text: 'We talk through the style you want, your face shape and your routine.' },
      { title: 'Prep', text: 'A hair wash first, if you have chosen one.' },
      { title: 'Cut & Groom', text: 'A precision cut, followed by beard detailing.' },
      { title: 'Finish', text: 'Styling, plus simple tips for styling it at home.' },
    ],
  },
  aftercare: {
    title: 'Keep Your Cut & Beard Looking Sharp',
    tips: [
      'Book a trim every 3–5 weeks to keep the shape clean.',
      'Wash your beard with a gentle cleanser and use beard oil daily to soften the hair.',
      'Use a small amount of styling product — less is more.',
      'Choose ammonia-free colour if you prefer a gentler colour option.',
      'Use a colour-safe shampoo to help colour last longer.',
    ],
  },
  offerBand: {
    title: 'Save More on Men’s Grooming',
    text: 'Pick the offer that fits your visit. Coming in for a bigger session? Bring your little one along.',
  },
  locationsTitle: 'Visit Xing Near You in Bangalore',
  faqTitle: 'Men’s Haircut FAQs',
  faqs: [
    {
      q: 'How is pricing decided?',
      a: 'Pricing depends on the service and your hair; message us on WhatsApp for an instant quote.',
    },
    {
      q: 'Which beard services do you offer?',
      a: 'We offer beard trims, beard shaves, beard styling and beard colour.',
    },
    {
      q: 'Is there a men’s haircut and beard combo?',
      a: 'Yes. The Get a Face Lift combo includes a haircut, beard trim or shave, hair wash, Schwarzkopf hair spa and face de-tan, at special combo pricing.',
    },
    {
      q: 'Do you offer ammonia-free hair colour for men?',
      a: 'Yes. Global colour for men is available in both regular and ammonia-free options.',
    },
    {
      q: 'Are there any discounts on men’s grooming?',
      a: 'Every Tuesday you get a flat 25% off (minimum billing applies). You also get 30% off during your birthday week, and memberships add up to 30% extra value.',
    },
    {
      q: 'How often should I get a haircut?',
      a: 'Most men book every 3–5 weeks. Shorter styles and fades need a touch-up sooner.',
    },
    {
      q: 'Which Xing salon should I visit?',
      a: 'Men’s grooming is available at all three Xing salons: Brookfield, HSR Layout and Sarjapura. Message us on WhatsApp to book your preferred location.',
    },
  ],
  related: {
    title: 'Pair It With',
    items: [
      { slug: 'hair-spa', text: 'Nourishing and scalp-care spas to follow your cut.' },
      { slug: 'hair-color', text: 'Global colour, highlights and balayage.' },
      { slug: 'threading-detan', text: 'Face and neck de-tan to finish the look.', hash: '#detan' },
      { slug: 'kids-haircut', text: 'Haircuts for boys and girls up to 10 years.' },
    ],
  },
  cta: 'Ready for a fresh look? Book your men’s haircut at Xing today.',
};
