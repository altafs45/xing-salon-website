import { serviceHero } from '../content';
import type { ServicePageContent } from './types';

// TODO (owner to confirm before publishing):
//   1. The exact seven steps. `process.steps` below is a typical hydra facial sequence, not a confirmed one.
//   2. Whether the hydra facial is offered to men. If not, remove the "available for men" FAQ.
export const hydraFacial: ServicePageContent = {
  slug: 'hydra-facial',
  order: ['intro', 'menu', 'process', 'benefits', 'compare', 'combo', 'audience', 'aftercare', 'bridal', 'offers', 'locations', 'faq', 'related'],
  bridalCare: { cards: ['hair-styling', 'body-polish', 'nails'] },
  seo: {
    title: '7-Step Hydra Facial in Bangalore | Bestseller – Xing Salon',
    description:
      'Deep-cleansing, hydrating 7-step hydra facial for glowing skin at Xing Salon, Sarjapur Road, HSR Layout & Brookfield. Buy 3, get 1 free. Book now.',
    keyword: 'hydra facial Bangalore',
    serviceType: 'Hydra Facial',
    areaServed: ['Bengaluru', 'Sarjapur Road', 'HSR Layout', 'Brookfield'],
  },
  hero: {
    eyebrow: 'Skin & Body · Bestseller',
    h1: '7-Step Hydra Facial in Bangalore for Instantly Glowing Skin',
    sub: 'Deep cleansing, gentle exfoliation and intense hydration in one relaxing session, for skin that looks fresh, plump and glowing from the very first visit.',
    cta: 'Book Hydra Facial on WhatsApp',
    chips: [
      { icon: 'star', label: 'Bestseller' },
      { icon: 'award', label: '5K+ hydra facials delivered' },
      { icon: 'offer', label: 'Buy 3, get 1 free' },
    ],
    image: serviceHero('hydra-facial', 'Hydra facial treatment with a skin device for deep cleansing and hydration'),
  },
  whatsappText: 'Hi, I’d like to book the 7-Step Hydra Facial at Xing',
  whatsappSuffix: '. My skin concern is ___',
  intro: {
    eyebrow: 'Skin Care',
    title: 'The Most-Loved Facial in Sarjapur Road, HSR Layout & Brookfield',
    paragraphs: [
      'Pollution, sun, stress and late nights can leave your skin dull, congested and dehydrated. Our 7-Step Hydra Facial is Xing’s bestselling facial in Bangalore, with more than 5,000 treatments delivered. It combines deep cleansing, exfoliation, gentle extraction and intense hydration in one soothing session.',
      'The result is skin that looks clearer, smoother and visibly radiant, often right after your first session. It’s a great choice before an event, as a monthly skin reset or as part of your regular skin-care routine. Your therapist starts with a quick skin check and adapts the treatment to your skin’s needs.',
    ],
  },
  menu: {
    eyebrow: 'Signature Facial',
    title: 'What’s Included in the 7-Step Hydra Facial',
    moreLink: {
      slug: 'facial-cleanup',
      text: 'Looking for a clean-up or classic facial?',
      label: 'Explore Facials & Clean-ups',
    },
  },
  process: {
    title: 'Your 7 Steps to Glowing Skin',
    // TODO: confirm these seven steps with the owner.
    steps: [
      { title: 'Skin consultation & cleanse' },
      { title: 'Exfoliation' },
      { title: 'Gentle peel or resurfacing' },
      { title: 'Extraction (pore cleansing)' },
      { title: 'Hydrating serum infusion' },
      { title: 'Nourishing mask' },
      { title: 'Moisturise & sun protection' },
    ],
  },
  benefits: {
    title: 'Benefits of a Hydra Facial',
    items: [
      { icon: 'sparkles', title: 'Instant glow & radiance' },
      { icon: 'droplets', title: 'Deep hydration' },
      { icon: 'layers', title: 'Cleaner-looking pores' },
      { icon: 'heart', title: 'Smoother, softer skin' },
      { icon: 'clock', title: 'Little to no downtime' },
      { icon: 'calendar', title: 'Event-ready skin' },
    ],
  },
  compare: {
    title: 'Hydra Facial vs Regular Facial vs Clean-up',
    columns: ['Facial', 'Focus', 'Best for', 'Result'],
    rows: [
      {
        name: 'Hydra Facial',
        cells: [
          'Cleanse + exfoliate + extract + hydrate',
          'Dull, dehydrated or congested skin; events',
          'Visible glow and hydration',
        ],
        current: true,
      },
      {
        name: 'Regular Facial',
        cells: ['Relaxation & nourishment', 'Pampering and regular skin care', 'Refreshed, relaxed skin'],
        slug: 'facial-cleanup',
      },
      {
        name: 'Clean-up',
        cells: ['Quick cleansing', 'Quick freshen-up between facials', 'Cleaner, fresher skin'],
        slug: 'facial-cleanup',
      },
    ],
  },
  combo: {
    badge: 'Offer',
    title: 'Buy 3 Hydra Facials, Get 1 Free',
    text: 'For best results, we recommend at least 3 sessions every 3–4 weeks. Book a set of three and your fourth hydra facial is on us.',
    includes: ['Visible glow from session one', 'Builds results over time', 'Perfect before weddings & events'],
    cta: 'Start my glow plan',
  },
  audience: {
    title: 'Is the Hydra Facial Right for You?',
    items: [
      'Dull or tired-looking skin',
      'Dehydrated, tight skin',
      'Congested pores and blackheads',
      'Uneven-looking texture',
      'Preparing for a wedding, party or photoshoot',
      'Anyone wanting a regular skin reset',
    ],
    note: 'Have very sensitive skin, active breakouts, a skin condition, or recent cosmetic or skin procedures, or are you pregnant? Tell your therapist before your session.',
  },
  aftercare: {
    title: 'Aftercare Tips for Lasting Glow',
    tips: [
      'Avoid makeup for the rest of the day if you can.',
      'Skip scrubs, peels and strong actives for a few days.',
      'Wear sunscreen daily, especially after exfoliation.',
      'Drink plenty of water and keep your skin moisturised.',
      'Avoid saunas, steam rooms and heavy workouts on the same day.',
      'Book your next session in 3–4 weeks to build results.',
    ],
  },
  offerBand: {
    title: 'Hydra Facial Offers',
    text: 'Pick the offer that fits your visit. Your salon will confirm which one applies when you book.',
  },
  locationsTitle: 'Hydra Facial Near You in Bangalore',
  faqTitle: 'Hydra Facial FAQs',
  faqs: [
    {
      q: 'What is a 7-step hydra facial?',
      a: 'It’s a multi-step facial that cleanses, exfoliates, clears pores and deeply hydrates your skin in one session, giving a fresh, glowing look.',
    },
    {
      q: 'How often should I get a hydra facial?',
      a: 'For best results, we recommend at least 3 sessions every 3–4 weeks, then regular maintenance. That’s why we offer Buy 3, Get 1 Free.',
    },
    {
      q: 'Will I see results after one session?',
      a: 'Most people notice brighter, smoother, more hydrated-looking skin right after their first session. Results build with regular treatments.',
    },
    {
      q: 'Is there any downtime?',
      a: 'There’s typically little to no downtime, so most people can go about their day. Follow our aftercare tips for the best results.',
    },
    {
      q: 'Is a hydra facial good before a wedding or event?',
      a: 'Yes. It’s a popular pre-event facial. Book a few days before your event, and start a series of sessions a few weeks earlier for the best glow.',
    },
    // TODO: confirm with the owner that the hydra facial is offered to men; remove this entry if it is not.
    {
      q: 'Is the hydra facial available for men?',
      a: 'Yes. Our hydra facial is available for both men and women at all Xing salons.',
    },
    {
      q: 'How is the price decided?',
      a: 'Message us on WhatsApp for the latest pricing and ongoing offers, including Buy 3, Get 1 Free.',
    },
    {
      q: 'Where can I get a hydra facial in Bangalore?',
      a: 'At Xing Premium Unisex Salon in Sarjapur Road, HSR Layout and Brookfield.',
    },
  ],
  related: {
    title: 'Complete Your Glow',
    items: [
      { slug: 'facial-cleanup', text: 'Clean-ups and classic facials for a regular skin-care routine.' },
      { slug: 'threading-detan', text: 'Eyebrow threading and tan removal for face, arms and legs.' },
      { slug: 'body-polish', text: 'Scrub and polish for smooth, soft skin.' },
      { slug: 'waxing', text: 'Flavored, cartridge and stripless wax for face and body.' },
    ],
  },
  cta: 'Ready for your glow-up? Book your 7-Step Hydra Facial at Xing today.',
};
