import type { ServicePageContent } from './types';

export const kidsHaircut: ServicePageContent = {
  slug: 'kids-haircut',
  theme: 'kids',
  seo: {
    titleLead: 'Kids Haircut in Bangalore',
    description:
      'Gentle, child-friendly kids haircuts for boys and girls up to 10 years at Xing Premium Salon in HSR Layout, Brookfield & Sarjapura. Book on WhatsApp.',
    keyword: 'kids haircut Bangalore',
    serviceType: 'Kids Haircut',
  },
  hero: {
    eyebrow: 'Hair · Kids Haircut',
    h1: 'Kids Haircut in Bangalore',
    sub: 'Patient, gentle haircuts for boys and girls, at three Xing salons across Bengaluru.',
    badge: 'Up to 10 years',
    chips: [
      { icon: 'smile', label: 'Boys & girls' },
      { icon: 'pin', label: '3 salons across Bengaluru' },
      { icon: 'star', label: 'Free on qualifying bills' },
    ],
    image: {
      src: '/images/loc-hsr-6.webp',
      alt: 'Kids’ styling corner with round mirrors for a kids haircut at Xing HSR Layout, Bangalore',
      width: 800,
      height: 600,
    },
  },
  whatsappText: 'Hi, I’d like to book a kids haircut at Xing',
  whatsappSuffix: ' for my child (age __)',
  cardCta: 'Book for my child',
  intro: {
    title: 'A Child-Friendly Salon for Kids Haircuts in HSR Layout, Brookfield & Sarjapura',
    paragraphs: [
      'A kids haircut should be quick, calm and comfortable — for your child and for you. At Xing Premium Unisex Salon, kids haircuts in Bangalore are available for boys and girls up to 10 years at all three of our salons.',
      'Tell us the look you have in mind, whether it is a tidy school cut, a simple trim or a new fringe. We’ll suggest what suits your child’s hair and is easy to manage at home. Our HSR Layout salon also has a dedicated kids’ corner.',
    ],
  },
  menu: {
    title: 'Kids Haircut Services',
    text: 'Pick a haircut and message us to book at the salon nearest to you.',
  },
  highlight: {
    icon: 'heart',
    title: 'Is It Your Child’s First Haircut?',
    text: 'A first haircut can feel like a big moment. Tell us when you book and we’ll keep things slow and gentle. You’re welcome to stay right beside your child the whole time.',
  },
  process: {
    title: 'What to Expect at Your Child’s Appointment',
    steps: [
      { title: 'Say hello', text: 'We talk through the look you want and anything your child is unsure about.' },
      { title: 'Get comfortable', text: 'Your child settles into the chair, with you close by.' },
      { title: 'Gentle cut', text: 'We work calmly and take short pauses whenever they are needed.' },
      { title: 'All done', text: 'A quick tidy-up and a look in the mirror before you go.' },
    ],
  },
  aftercare: {
    title: 'Tips for a Happy Kids Haircut',
    tips: [
      'Pick a time when your child is rested and has eaten.',
      'Bring a favourite toy or book for comfort.',
      'Show us a reference photo of the look you want.',
      'Tell your stylist about cowlicks, sensitivities or anything your child dislikes.',
      'Book a trim every 6–8 weeks to keep the shape neat.',
    ],
  },
  offerBand: {
    title: 'A Kids Haircut Offer for Family Visits',
    text: 'Book your own appointment alongside your child’s and make it a family visit.',
    badge: 'Family visit',
    links: ['mens-haircut-grooming', 'womens-haircut-styling'],
  },
  locationsTitle: 'Visit a Xing Salon Near You in Bangalore',
  faqTitle: 'Kids Haircut FAQs',
  faqs: [
    {
      q: 'Up to what age do you offer kids haircuts?',
      a: 'Kids haircuts at Xing are for children up to 10 years.',
    },
    {
      q: 'Do you cut both boys’ and girls’ hair?',
      a: 'Yes. We offer a boys haircut and a girls haircut, from simple trims to bobs, fringes, crops and gentle fades.',
    },
    {
      q: 'How is pricing for a kids haircut decided?',
      a: 'Pricing depends on the haircut; message us on WhatsApp for an instant quote.',
    },
    {
      q: 'Is there an offer on kids haircuts?',
      a: 'Yes. You get a free kids haircut on qualifying bills. Ask your salon for the details when you book.',
    },
    {
      q: 'It is my child’s first haircut. What should I do?',
      a: 'Let us know when you book. Choose a time when your child is rested, bring a favourite toy and stay beside them during the cut.',
    },
    {
      q: 'Which Xing salons offer kids haircuts?',
      a: 'All three: HSR Layout, Brookfield and Sarjapura in Bengaluru. Message us on WhatsApp to book your preferred location.',
    },
  ],
  related: {
    title: 'Make It a Family Visit',
    items: [
      { slug: 'mens-haircut-grooming', text: 'Haircuts, beard grooming and colour.' },
      { slug: 'womens-haircut-styling', text: 'Haircuts, blow dries, ironing and curls.' },
    ],
  },
  cta: 'Ready for a fresh little look? Book your child’s haircut at Xing today.',
};
