import type { ServicePageContent, StudioContact } from './types';

// SEO bridge page for the sister tattoo studio: it ranks for tattoo searches, then sends visitors to the
// studio's own site, WhatsApp, phone and map. Every contact point on this page uses the studio, not the salons.
//
// Facts come from the owner's brief and from xingtattoo.in (checked 7 Oct 2026), reworded rather than copied.
// Where the two disagreed, the owner chose the tattoo site's figures: 1800+ tattoos, since 2021, "up to 50% off".
//
// TODO (owner to confirm before publishing):
//   1. The "up to 50% off" and 10 sq inch offers end on 31 October per xingtattoo.in/offer. Update or remove them then.
//   2. A real photo of the studio or its own work for the hero (now a branded placeholder graphic), with the alt
//      "Black and grey tattoo at Xing Premium Tattoo Studio Brookfield" or "Colour tattoo at Xing tattoo studio Bangalore".
//   3. The new styles taken from xingtattoo.in (Portrait, Minimalist & Fine-Line, Geometric, Indian Traditional,
//      Cover-ups & Rework) and the opening days and 18+ policy, also from that site.
export const studio: StudioContact = {
  name: 'Xing Premium Tattoo Studio',
  // As on the Google Business Profile, with the area spelt "Brookfield" as on the rest of the site.
  address:
    'SV Plaza, 267, 60 Feet Rd, above DMART Ready, AECS Layout - A Block, Kundalahalli Colony, Brookfield, Bengaluru, Karnataka 560037, India',
  postal: {
    street: 'SV Plaza, 267, 60 Feet Rd, above DMART Ready, AECS Layout - A Block, Kundalahalli Colony, Brookfield',
    locality: 'Bengaluru',
    city: 'Bengaluru',
    region: 'Karnataka',
    postalCode: '560037',
  },
  phone: '+91 89700 07818',
  phoneHref: 'tel:+918970007818',
  whatsappHref: 'https://wa.me/918970007818',
  email: 'xingtattoo.aecs@gmail.com',
  mapUrl: 'https://maps.app.goo.gl/Gjj493gJFLE3oJHT9',
  website: 'https://www.xingtattoo.in/',
  instagram: { href: 'https://www.instagram.com/xingtattoo_blr/', handle: '@xingtattoo_blr' },
  // Days from xingtattoo.in: closed every Tuesday.
  hours: { label: '10 AM – 9 PM, Wednesday to Monday (closed Tuesday)', days: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], opens: '10:00', closes: '21:00' },
  founded: 2021,
};

export const tattoo: ServicePageContent = {
  slug: 'tattoo',
  contact: studio,
  order: ['intro', 'menu', 'combo', 'highlight', 'process', 'aftercare', 'locations', 'faq', 'related'],
  seo: {
    title: 'Tattoo Studio in Brookfield, Bangalore | Xing Premium Tattoo',
    description:
      'Custom black & grey, colour and 3D realistic tattoos at Xing Premium Tattoo Studio, Brookfield (near Whitefield & AECS Layout). Up to 50% off on tattoos.',
    keyword: 'tattoo studio Brookfield Bangalore',
    areaServed: ['Bengaluru', 'Brookfield', 'Whitefield', 'AECS Layout', 'Kundalahalli'],
  },
  hero: {
    eyebrow: 'Tattoo · Stories on Skin',
    h1: 'Tattoo Studio in Brookfield, Bangalore — Xing Premium Tattoo',
    sub: 'Stories on Skin. Custom black & grey, colour and 3D realistic tattoos at our dedicated studio in Brookfield, Bangalore, near Whitefield and AECS Layout.',
    cta: 'Book on WhatsApp',
    secondary: { label: 'Visit Tattoo Website', href: studio.website },
    chips: [
      { icon: 'award', label: '1800+ tattoos delivered' },
      { icon: 'calendar', label: 'Since 2021' },
      { icon: 'offer', label: 'Up to 50% off on tattoos' },
    ],
    // Branded placeholder graphic, not a photo (see TODO 2).
    image: {
      src: '/images/tattoo-hero.svg',
      alt: 'Xing Premium Tattoo Studio: Stories on Skin',
      width: 1200,
      height: 750,
    },
  },
  whatsappText: 'Hi Xing Tattoo, I’d like to book a tattoo.',
  whatsappSuffix: ' Idea: ___ Size: ___ Placement: ___',
  intro: {
    eyebrow: 'Xing Tattoo Studio',
    title: 'Your Tattoo Studio in Brookfield, Bangalore',
    paragraphs: [
      'Every tattoo tells a story, and at Xing Premium Tattoo Studio we help you tell yours. Since 2021, our dedicated tattoo studio in Brookfield has created more than 1,800 tattoos for clients from Whitefield, AECS Layout, Kundalahalli and across Bangalore.',
      'Whether it’s a small, meaningful first tattoo or a detailed 3D realistic piece, our artists work with you from idea to design to finished art. We focus on hygiene, creativity and your comfort. Explore our full portfolio on our tattoo website, or message us on WhatsApp to start planning your design.',
    ],
  },
  menu: {
    eyebrow: 'Styles',
    title: 'Tattoo Styles We Create',
    askText: 'See our full portfolio',
    askButton: { label: 'Visit xingtattoo.in', href: studio.website },
  },
  combo: {
    badge: 'Offer',
    title: 'Tattoo Offers',
    text: 'Up to 50% off on tattoos, plus a special flat offer on any tattoo up to 10 sq inch. Perfect for your first tattoo.',
    includes: ['Black & grey or colour', 'Custom designs', 'Free design consultation'],
    cta: 'Claim offer on WhatsApp',
    bookText: 'Hi Xing Tattoo, I’d like to claim the tattoo offer. Idea: ___ Size: ___ Placement: ___',
  },
  highlight: {
    icon: 'heart',
    title: 'Getting Your First Tattoo in Bangalore?',
    text: 'First tattoo nerves are normal. Start with a small design in an easy placement, such as the wrist, forearm or ankle, and talk your idea through with our artist first. We’ll guide you on size, placement and aftercare so you feel confident before you begin.',
  },
  process: {
    title: 'How Getting a Tattoo at Xing Works',
    steps: [
      { title: 'Share your idea on WhatsApp' },
      { title: 'Design discussion & sizing' },
      { title: 'Book your session' },
      { title: 'Skin prep & stencil placement' },
      { title: 'Tattooing' },
      { title: 'Aftercare guidance' },
    ],
  },
  aftercare: {
    eyebrow: 'Prep & Aftercare',
    title: 'Before & After Your Tattoo',
    groups: [
      {
        title: 'Before your session',
        tips: [
          'Eat a proper meal and stay hydrated.',
          'Avoid alcohol for 24 hours before your session.',
          'Wear comfortable clothes that give easy access to the placement area.',
          'Tell your artist about allergies, skin conditions, blood-thinning medication or pregnancy.',
        ],
      },
      {
        title: 'After your tattoo',
        tips: [
          'Keep the tattoo clean and follow your artist’s aftercare instructions.',
          'Don’t scratch or pick at it while it heals.',
          'Avoid swimming, saunas and direct sun until it has healed.',
          'Use sunscreen on healed tattoos to keep colours sharp.',
        ],
      },
    ],
  },
  offerBand: { text: '' },
  locationsTitle: 'Visit Xing Premium Tattoo Studio',
  faqTitle: 'Tattoo FAQs',
  faqs: [
    {
      q: 'Where is the Xing tattoo studio located?',
      a: 'Xing Premium Tattoo Studio is at SV Plaza, 60 Feet Road, above DMART Ready, AECS Layout A Block, Kundalahalli Colony, Brookfield, Bengaluru, Karnataka 560037, near Whitefield.',
    },
    {
      q: 'What are your opening hours?',
      a: 'We’re open from 10 AM to 9 PM, Wednesday to Monday. The studio is closed on Tuesdays.',
    },
    {
      q: 'How is tattoo pricing decided?',
      a: 'It’s based on size (per square inch), detail and whether it’s black & grey or colour. We currently have up to 50% off on tattoos. Message us on WhatsApp with your idea for a quote.',
    },
    {
      q: 'Can you design a custom tattoo for me?',
      a: 'Yes. Share your idea, reference images and placement on WhatsApp, and our artist will create a design for you.',
    },
    {
      q: 'Do you do 3D or realistic tattoos?',
      a: 'Yes. We create 3D-style and photo-realistic tattoos, along with black & grey and colour work.',
    },
    {
      q: 'Is it okay to get my first tattoo here?',
      a: 'Absolutely. Many of our clients are first-timers. We’ll guide you on size, placement and aftercare.',
    },
    {
      q: 'What is the minimum age for a tattoo?',
      a: 'You need to be 18 or older, and we may ask to see a photo ID.',
    },
    {
      q: 'How do I book?',
      a: 'WhatsApp us at +91 89700 07818, call the studio, or visit xingtattoo.in.',
    },
  ],
  related: {
    title: 'Also at Xing',
    items: [
      { slug: 'mens-haircut-beard-grooming', text: 'Sharp cuts, beard trims and grooming at our salons.' },
      { slug: 'global-hair-color', text: 'Global colour, highlights and balayage.' },
      { slug: 'nail-art', text: 'Chrome, cat eye, French tips and 3D designs.' },
      { slug: 'hydra-facial', text: 'Our bestselling facial for deep cleansing and hydration.' },
    ],
  },
  cta: 'Ready to put your story on skin? Book your tattoo at Xing today.',
  ctaSecondary: { label: 'Visit Tattoo Website', href: studio.website },
};
