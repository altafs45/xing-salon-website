// Nail care: Manicure, Pedicure, Nail Cutting & Filing, Nail Polish and Quick Nail Care, one page each (manicure,
// pedicure and the quick services were one "Manicure & Pedicure" page). No prices.
//
// TODO (owner to confirm), carried over from the old page:
//   1. What each ritual includes (D-Lux, Crystal, Alga, Tango, Detox). The cards present them as an ascending
//      ladder; replace with the real steps.
//   2. Are manicures and pedicures offered to men? If yes, add an FAQ with the confirmed answer.
//   3. Tool hygiene. The menu and search copy now say "hygienic, sterilised tools" (from the Oct 2026 brief);
//      confirm the practice, or remove the claim from `catalogue` and `categories` in services.ts.
//   4. "Walk-ins welcome" (search copy for manicure, nail cutting and quick nail care): confirm.
import { footer, serviceHero } from '../content';
import { h1For, seoFor } from './catalogue';
import type { ServicePageContent } from './types';

const instagram = footer.socials.find((social) => social.icon === 'instagram')!;

/** A photo from the manicure & pedicure gallery: /images/gal-manicure-pedicure-<n>.webp (600 × 600). */
const photo = (n: number, design: string, alt: string) => ({
  src: `/images/gal-manicure-pedicure-${n}.webp`,
  srcSet: `/images/gal-manicure-pedicure-${n}-400.webp 400w, /images/gal-manicure-pedicure-${n}.webp 600w`,
  alt: `${alt} at Xing Premium Salon Bangalore`,
  width: 600,
  height: 600,
  design,
});

const compare: ServicePageContent['compare'] = {
  title: 'Which Ritual Is Right for You?',
  // TODO: confirm with the owner; this ladder follows the card descriptions.
  columns: ['Ritual', 'Focus', 'Best for'],
  rows: [
    { name: 'D-Lux', cells: ['Quick, classic care', 'Regular upkeep'] },
    { name: 'Crystal', cells: ['Extra softness', 'Dry skin'] },
    { name: 'Alga', cells: ['Deeper nourishment', 'Tired hands and feet'] },
    { name: 'Tango', cells: ['Premium indulgence', 'A special treat'] },
    { name: 'Detox', cells: ['Deep refresh', 'Dull, tired-looking skin'] },
  ],
};

const combo: ServicePageContent['combo'] = {
  badge: 'Combos',
  title: 'Mani-Pedi in Our Combos',
  text: 'Get a Crystal Pedicure and D-Lux Manicure with full arms, half legs and underarms waxing plus threading in our Waxing Combo. Or get a nail cut, file & polish in the women’s Get a Face Lift combo. All at special combo pricing.',
  includes: ['Waxing Combo: Crystal Pedicure & D-Lux Manicure', 'Women’s Get a Face Lift: Nail Cut, File & Polish'],
  actions: [
    { label: 'Waxing combo', slug: 'waxing' },
    { label: 'Women’s combo', slug: 'womens-haircut-styling' },
  ],
};

const aftercare: ServicePageContent['aftercare'] = {
  title: 'Keep Hands & Feet Looking Great',
  tips: [
    'Moisturise hands and feet daily, especially heels.',
    'Wear gloves for cleaning and washing dishes.',
    'Use a cuticle oil a few times a week.',
    'Let polish dry fully before slipping on closed shoes.',
    'Book a manicure or pedicure every 3–4 weeks to keep nails and cuticles neat.',
    'Have diabetes, circulation issues, cuts or a nail or skin infection? Tell your therapist before your session.',
  ],
};

const offerBand: ServicePageContent['offerBand'] = {
  title: 'Nail Care Offers',
  text: 'Pick the offer that fits your visit. Your salon will confirm which one applies when you book.',
};

const ritualOrder: ServicePageContent['order'] = ['intro', 'gallery', 'menu', 'audience', 'process', 'compare', 'combo', 'aftercare', 'offers', 'locations', 'faq', 'related'];
const quickOrder: ServicePageContent['order'] = ['intro', 'menu', 'audience', 'process', 'aftercare', 'offers', 'locations', 'faq', 'related'];

const ritualChips: ServicePageContent['hero']['chips'] = [
  { icon: 'sparkles', label: '5 rituals to choose from' },
  { icon: 'smile', label: 'Relaxing massage' },
  { icon: 'pin', label: '3 salons across Bangalore' },
];
const quickChips: ServicePageContent['hero']['chips'] = [
  { icon: 'clock', label: 'Quick visit' },
  { icon: 'star', label: 'Neat, even finish' },
  { icon: 'pin', label: '3 salons across Bangalore' },
];

export const manicure: ServicePageContent = {
  slug: 'manicure',
  order: ritualOrder,
  seo: seoFor('manicure', { serviceType: 'Manicure', providerType: 'NailSalon' }),
  hero: {
    eyebrow: 'Nail Care · Hand Care',
    h1: h1For('manicure'),
    sub: 'Clean, shaped, nourished hands with a flawless finish, from a quick refresh to a full pampering ritual.',
    cta: 'Book a Manicure on WhatsApp',
    chips: ritualChips,
    image: serviceHero('manicure-pedicure', 'Manicure with cuticle care on a soft towel'),
  },
  whatsappText: 'Hi, I’d like to book a manicure (___) at Xing',
  intro: {
    eyebrow: 'Manicure',
    title: 'Manicure in Sarjapur Road, HSR Layout & Brookfield',
    paragraphs: [
      'A manicure in Bangalore is the easiest way to make your hands look cared for. Typing, cooking, cleaning and dry weather leave cuticles rough and nails uneven. Every manicure at Xing combines nail shaping, cuticle care, exfoliation, a relaxing hand massage and a neat polished finish, so your hands look polished and feel soft.',
      'Choose from five rituals at our Sarjapur Road, HSR Layout and Brookfield salons, from the quick, classic D-Lux to our most indulgent Tango. It’s the perfect weekend treat, pre-event prep or regular self-care habit. Pair it with a pedicure for the full experience, or add nail art for a finishing touch. Clients from Koramangala, Bellandur, Whitefield and Marathahalli often book one on the way to a weekend plan or before an event.',
    ],
  },
  gallery: {
    eyebrow: 'Gallery',
    title: 'Manicures, Up Close',
    text: 'Shaping, cuticle care and a clean, glossy finish.',
    items: [
      photo(1, 'Manicure station', 'Manicure in progress at a nail station'),
      photo(2, 'Cuticle care', 'Cuticle care during a manicure'),
      photo(3, 'Soft, groomed hands', 'Soft, well-groomed hands after a manicure'),
      photo(4, 'Nude polish', 'Hands with a neat nude polish finish'),
    ],
    more: { href: instagram.href, label: 'See our clients’ results on Instagram @xingpremiumsalons' },
  },
  menu: {
    eyebrow: 'Our Rituals',
    title: 'Manicure Rituals',
    askText: 'Not sure which ritual to choose? Ask us on WhatsApp.',
    moreLink: { slug: 'pedicure', text: 'Treat your feet too?', label: 'Pedicure', also: [{ slug: 'quick-nail-care', label: 'Quick Nail Care' }] },
  },
  audience: {
    title: 'Who a Manicure Is For',
    items: ['Anyone whose hands feel dry or whose cuticles look rough', 'Pre-event prep before weddings, parties and interviews', 'A regular self-care habit every 3–4 weeks'],
    note: 'Cuts, a nail or skin infection, or diabetes? Tell your therapist before your session.',
  },
  process: {
    title: 'What to Expect',
    steps: [{ title: 'Soak & cleanse' }, { title: 'Nail shaping & cuticle care' }, { title: 'Exfoliation, mask & massage' }, { title: 'Polish & finish' }],
  },
  compare,
  combo,
  aftercare,
  offerBand,
  locationsTitle: 'Manicure Near You in Bangalore',
  faqTitle: 'Manicure FAQs',
  faqs: [
    {
      q: 'What is included in a manicure at Xing?',
      a: 'Every manicure ritual at Xing includes nail shaping, cuticle care, exfoliation, a hand massage and polish. Higher rituals like Alga and Tango add deeper nourishment and longer massages. Your therapist can help you choose the right one when you arrive at Sarjapur Road, HSR Layout or Brookfield.',
    },
    {
      q: 'How often should I get a manicure?',
      a: 'Every three to four weeks works well for most people. It keeps cuticles neat, nails evenly shaped and hands soft. If you work with your hands a lot or wear polish all the time, a quick cut, file and polish between full manicures keeps them looking fresh.',
    },
    {
      q: 'Can I get a manicure and pedicure together?',
      a: 'Yes, you can book a manicure and a pedicure in the same visit at any Xing salon. Our Waxing Combo also includes a D-Lux Manicure and a Crystal Pedicure along with waxing and threading. Ask us on WhatsApp to plan your appointment.',
    },
    {
      q: 'Where can I get a manicure in Bangalore?',
      a: 'At Xing Premium Unisex Salon in Sarjapur Road, HSR Layout and Brookfield. Book on WhatsApp or visit the salon, choose your ritual with your therapist, and leave with neat, soft, beautifully finished hands. Booking ahead on WhatsApp is the easiest way to get your preferred time, especially on weekends.',
    },
  ],
  related: {
    title: 'More Nail Care',
    items: [
      { slug: 'pedicure', text: 'Relaxing foot care that softens and refreshes.' },
      { slug: 'nail-art', text: 'Custom designs, chrome, French tips and 3D art.' },
      { slug: 'quick-nail-care', text: 'Cut, file and polish in one quick session.' },
    ],
  },
  cta: 'Treat your hands. Book your manicure at Xing today.',
};

export const pedicure: ServicePageContent = {
  slug: 'pedicure',
  order: ritualOrder,
  seo: seoFor('pedicure', { serviceType: 'Pedicure', providerType: 'NailSalon' }),
  hero: {
    eyebrow: 'Nail Care · Foot Care',
    h1: h1For('pedicure'),
    sub: 'Relaxing foot care that softens heels, cleans and shapes nails and leaves tired feet refreshed.',
    cta: 'Book a Pedicure on WhatsApp',
    chips: [
      { icon: 'sparkles', label: '5 rituals to choose from' },
      { icon: 'layers', label: 'Heel peel treatment' },
      { icon: 'pin', label: '3 salons across Bangalore' },
    ],
    image: photo(8, 'Pedicure finish', 'Pink polish painted on during a pedicure'),
  },
  whatsappText: 'Hi, I’d like to book a pedicure (___) at Xing',
  intro: {
    eyebrow: 'Pedicure',
    title: 'Pedicure in Sarjapur Road, HSR Layout & Brookfield',
    paragraphs: [
      'A pedicure in Bangalore is a reset for feet that spend all day in closed shoes, dust and heat. Every pedicure at Xing includes a warm soak, nail shaping, cuticle care, exfoliation, a relaxing foot massage and polish, leaving your feet softer, cleaner and comfortable again. Rough or cracked-looking heels get extra attention with our Heel Peel Treatment.',
      'Relax in the pedicure lounge at our Sarjapur Road, HSR Layout or Brookfield salon and choose from five rituals, from the classic D-Lux to the indulgent Tango or the deep-cleansing Detox. Add a foot massage for extra relaxation, or pair it with a manicure for the complete treat. It is a favourite with clients from Koramangala, Bellandur, Whitefield and Marathahalli after a long working week.',
    ],
  },
  gallery: {
    eyebrow: 'Gallery',
    title: 'Pedicures, Up Close',
    text: 'Filing, nail care and a neat, glossy finish for happy feet.',
    items: [
      photo(5, 'Foot filing', 'Toenails filed and shaped during a pedicure'),
      photo(6, 'Nail care', 'Toenail trimming during a pedicure'),
      photo(7, 'Toe polish', 'Polish applied with toe separators'),
      photo(8, 'Pedicure finish', 'Pink polish painted on during a pedicure'),
    ],
    more: { href: instagram.href, label: 'See our clients’ results on Instagram @xingpremiumsalons' },
  },
  menu: {
    eyebrow: 'Our Rituals',
    title: 'Pedicure Rituals & Foot Treatments',
    askText: 'Not sure which ritual to choose? Ask us on WhatsApp.',
    moreLink: { slug: 'manicure', text: 'Treat your hands too?', label: 'Manicure', also: [{ slug: 'quick-nail-care', label: 'Quick Nail Care' }] },
  },
  audience: {
    title: 'Who a Pedicure Is For',
    items: ['Tired feet after long days in closed shoes', 'Rough, dry or cracked-looking heels', 'Sandal season, holidays, weddings and events'],
    note: 'Diabetes, circulation issues, cuts or a nail infection? Tell your therapist before your session.',
  },
  process: {
    title: 'What to Expect',
    steps: [{ title: 'Warm soak & cleanse' }, { title: 'Nail shaping & cuticle care' }, { title: 'Heel & foot exfoliation, mask & massage' }, { title: 'Polish & finish' }],
  },
  compare,
  combo,
  aftercare,
  offerBand,
  locationsTitle: 'Pedicure Near You in Bangalore',
  faqTitle: 'Pedicure FAQs',
  faqs: [
    {
      q: 'How often should I get a pedicure?',
      a: 'Every three to four weeks works well for most people and keeps heels smooth and cuticles neat. If your heels are very rough or cracked-looking, a few closer visits with our Heel Peel Treatment help first, then a regular pedicure keeps them soft.',
    },
    {
      q: 'What is a heel peel treatment?',
      a: 'A heel peel is a targeted foot treatment that helps soften and smooth rough, dry or cracked-looking heels. You can add it to any pedicure ritual at Xing. Moisturising your heels daily at home helps the results last until your next visit.',
    },
    {
      q: 'Which pedicure is best for tired feet?',
      a: 'For tired feet, choose the Alga or Tango ritual for a longer, more relaxing massage, or Detox for a deep-cleansing refresh. Adding a foot massage is a great extra. Your therapist will suggest the best ritual for your feet when you arrive.',
    },
    {
      q: 'Where can I get a pedicure in Bangalore?',
      a: 'At Xing Premium Unisex Salon in Sarjapur Road, HSR Layout and Brookfield. Book on WhatsApp or visit the salon, relax in the pedicure lounge and leave with soft, refreshed, beautifully finished feet. Booking ahead on WhatsApp is the easiest way to get your preferred time, especially on weekends.',
    },
  ],
  related: {
    title: 'More Nail Care',
    items: [
      { slug: 'manicure', text: 'Clean, shaped, nourished hands.' },
      { slug: 'nail-art', text: 'Custom designs, chrome, French tips and 3D art.' },
      { slug: 'quick-nail-care', text: 'Cut, file and polish in one quick session.' },
    ],
  },
  cta: 'Give your feet a break. Book your pedicure at Xing today.',
};

const quickRelated = (exclude: string): ServicePageContent['related'] => ({
  title: 'More Nail Care',
  items: [
    { slug: 'quick-nail-care', text: 'Cut, file and polish in one quick session.' },
    { slug: 'nail-cutting-filing', text: 'Neat trimming and shaping in minutes.' },
    { slug: 'nail-polish', text: 'A fresh coat of colour, neatly applied.' },
    { slug: 'manicure', text: 'The full ritual: cuticle care, massage and polish.' },
  ]
    .filter((item) => item.slug !== exclude)
    .slice(0, 3),
});

export const nailCuttingFiling: ServicePageContent = {
  slug: 'nail-cutting-filing',
  order: quickOrder,
  seo: seoFor('nail-cutting-filing', { serviceType: 'Nail Cutting and Filing', providerType: 'NailSalon' }),
  hero: {
    eyebrow: 'Nail Care · Quick Services',
    h1: h1For('nail-cutting-filing'),
    sub: 'Neat trimming and shaping for hands or feet, in a quick visit that fits any day.',
    cta: 'Book on WhatsApp',
    chips: quickChips,
    image: photo(5, 'Nail filing', 'Toenails filed and shaped during a pedicure'),
  },
  whatsappText: 'Hi, I’d like to book nail cutting & filing at Xing',
  intro: {
    eyebrow: 'Nail Cutting & Filing',
    title: 'Nail Cutting & Filing in Sarjapur Road, HSR Layout & Brookfield',
    paragraphs: [
      'Nail cutting and filing in Bangalore, done properly, keeps nails strong, even and comfortable. At Xing our nail technicians trim your nails to the length you like and file them into a clean, even shape, square, round, oval or almond, for hands or feet. It takes only a short visit, so it fits easily into a busy day.',
      'It’s ideal between manicures, before an event, or simply when you prefer a professional shape over cutting at home. Visit our Sarjapur Road, HSR Layout or Brookfield salon. Want colour as well? Choose our Quick Nail Care combo for a cut, file and polish in one sitting. Clients across Koramangala, Bellandur, Whitefield and Marathahalli often pop in for it on the way to work or between errands.',
    ],
  },
  menu: {
    eyebrow: 'Quick Service',
    title: 'Cut & File',
    askText: 'Questions? Ask us on WhatsApp.',
    moreLink: { slug: 'quick-nail-care', text: 'Want polish too?', label: 'Quick Nail Care combo' },
  },
  audience: {
    title: 'Who It’s For',
    items: ['Anyone who wants neat, even nails without a full manicure', 'Between manicures, to keep the shape fresh', 'Toenails that are hard to trim neatly at home'],
    note: 'Ingrown or painful nails, or a nail infection? Tell your technician first.',
  },
  process: {
    title: 'What to Expect',
    steps: [{ title: 'Choose your length & shape' }, { title: 'Trim' }, { title: 'File & smooth the edges' }],
  },
  aftercare,
  offerBand,
  locationsTitle: 'Nail Cutting & Filing Near You in Bangalore',
  faqTitle: 'Nail Cutting & Filing FAQs',
  faqs: [
    {
      q: 'Can I get just my nails cut and filed?',
      a: 'Yes. Nail cutting and filing is its own quick service at Xing, for hands or feet, without a full manicure or pedicure. Your technician trims your nails to the length you like and files them into a neat, even shape. Add polish with our Quick Nail Care combo.',
    },
    {
      q: 'Which nail shape should I choose?',
      a: 'Round and squoval shapes are the easiest to maintain and suit short nails, while oval and almond make fingers look longer. Square suits a clean, modern look. Your technician will suggest a shape that suits your nail beds and lifestyle during your visit.',
    },
    {
      q: 'How often should I get my nails cut and filed?',
      a: 'Fingernails usually need shaping every two to three weeks and toenails every three to four weeks, depending on how fast they grow. Regular filing keeps edges smooth so nails are less likely to snag, split or break between appointments. Your technician can suggest how often to come back.',
    },
    {
      q: 'Where can I get nail cutting and filing in Bangalore?',
      a: 'At Xing Premium Unisex Salon in Sarjapur Road, HSR Layout and Brookfield. Book on WhatsApp or ask at the salon; it is a quick visit that fits easily before work, between errands or alongside another service. Booking ahead on WhatsApp gets you your preferred time.',
    },
  ],
  related: quickRelated('nail-cutting-filing'),
  cta: 'Neat nails in minutes. Book nail cutting & filing at Xing today.',
};

export const nailPolish: ServicePageContent = {
  slug: 'nail-polish',
  order: quickOrder,
  seo: seoFor('nail-polish', { serviceType: 'Nail Polish Application', providerType: 'NailSalon' }),
  hero: {
    eyebrow: 'Nail Care · Quick Services',
    h1: h1For('nail-polish'),
    sub: 'A fresh coat of colour in your favourite shade, neatly applied on hands or feet.',
    cta: 'Book on WhatsApp',
    chips: quickChips,
    image: photo(4, 'Nude polish', 'Hands with a neat nude polish finish'),
  },
  whatsappText: 'Hi, I’d like to book a nail polish at Xing',
  intro: {
    eyebrow: 'Nail Polish',
    title: 'Nail Polish Application in Sarjapur Road, HSR Layout & Brookfield',
    paragraphs: [
      'Nail polish application in Bangalore, done by a professional, simply looks neater: clean edges, even coats and no smudges on your cuticles. At Xing we apply regular polish in your favourite shade on hands or feet, from soft nudes and classic reds to brights and pastels, for a polished look in a quick visit.',
      'It’s perfect before a meeting, a dinner or a family function, or whenever you want a fresh colour without a full manicure. Visit our Sarjapur Road, HSR Layout or Brookfield salon. Want your nails shaped first? Choose our Quick Nail Care combo, or try gel polish for a longer-wearing finish. Clients from Koramangala, Bellandur, Whitefield and Marathahalli often drop in for a quick colour change before an evening out.',
    ],
  },
  menu: {
    eyebrow: 'Quick Service',
    title: 'Regular Nail Polish',
    askText: 'Looking for a particular shade? Ask us on WhatsApp.',
    moreLink: { slug: 'quick-nail-care', text: 'Want your nails shaped too?', label: 'Quick Nail Care combo', also: [{ slug: 'nail-art', label: 'Gel polish & nail art' }] },
  },
  audience: {
    title: 'Who It’s For',
    items: ['Anyone who wants fresh colour without a full manicure', 'Last-minute plans: meetings, dinners and functions', 'Toenails that are tricky to paint neatly yourself'],
    note: 'Prefer longer-lasting colour? Ask about gel polish on our nail art menu.',
  },
  process: {
    title: 'What to Expect',
    steps: [{ title: 'Pick your shade' }, { title: 'Clean & prep the nails' }, { title: 'Base, colour & top coat' }],
  },
  aftercare,
  offerBand,
  locationsTitle: 'Nail Polish Near You in Bangalore',
  faqTitle: 'Nail Polish FAQs',
  faqs: [
    {
      q: 'Can I get just nail polish without a manicure?',
      a: 'Yes. Regular nail polish is its own quick service at Xing, for hands or feet. Your technician cleans and preps your nails, then applies base, colour and top coat for a neat finish. Add cutting and filing with our Quick Nail Care combo.',
    },
    {
      q: 'How long does regular nail polish last?',
      a: 'Regular nail polish usually looks fresh for about a week, depending on your routine. Wearing gloves for cleaning and applying a top coat every few days helps it last longer. For two weeks or more of shine, ask about gel polish instead.',
    },
    {
      q: 'What is the difference between regular and gel polish?',
      a: 'Regular polish air-dries and is quick to change, but chips sooner. Gel polish is cured under a lamp, stays glossy for longer and needs professional removal. Both are available at Xing; regular polish is here, and gel polish is on our nail art menu.',
    },
    {
      q: 'Where can I get my nails painted in Bangalore?',
      a: 'At Xing Premium Unisex Salon in Sarjapur Road, HSR Layout and Brookfield. Book on WhatsApp or ask at the salon, pick your shade, and leave with neatly painted nails after a quick visit. Booking ahead on WhatsApp is the easiest way to get your preferred time, especially on weekends.',
    },
  ],
  related: quickRelated('nail-polish'),
  cta: 'Fresh colour, neatly done. Book a nail polish at Xing today.',
};

export const quickNailCare: ServicePageContent = {
  slug: 'quick-nail-care',
  order: quickOrder,
  seo: seoFor('quick-nail-care', { serviceType: 'Nail Cut, File and Polish', providerType: 'NailSalon' }),
  hero: {
    eyebrow: 'Nail Care · Quick Services',
    h1: h1For('quick-nail-care'),
    sub: 'Cut, file and polish in one quick session, perfect between appointments.',
    cta: 'Book on WhatsApp',
    badge: 'Combo',
    chips: quickChips,
    image: photo(3, 'Soft, groomed hands', 'Soft, well-groomed hands after a manicure'),
  },
  whatsappText: 'Hi, I’d like to book Quick Nail Care (cut, file & polish) at Xing',
  intro: {
    eyebrow: 'Quick Nail Care',
    title: 'Quick Nail Care in Sarjapur Road, HSR Layout & Brookfield',
    paragraphs: [
      'Quick nail care in Bangalore, our cut, file and polish combo, gives you neat, polished nails without booking a full manicure. Your technician trims your nails to the length you like, files them into a clean, even shape and finishes with a fresh coat of regular polish in your favourite shade, on hands or feet.',
      'It’s ideal between full manicures, before a meeting or function, or whenever you want tidy nails in one short sitting. Visit our Sarjapur Road, HSR Layout or Brookfield salon. Want more pampering? Upgrade to a manicure or pedicure ritual with cuticle care, exfoliation and massage. Clients from Koramangala, Bellandur, Whitefield and Marathahalli often pop in for it on the way to work, a meeting or an evening out, and leave with tidy nails.',
    ],
  },
  menu: {
    eyebrow: 'Combo',
    title: 'Cut, File & Polish',
    askText: 'Questions? Ask us on WhatsApp.',
    moreLink: { slug: 'manicure', text: 'Want the full treatment?', label: 'Manicure', also: [{ slug: 'pedicure', label: 'Pedicure' }] },
  },
  audience: {
    title: 'Who It’s For',
    items: ['Busy days when you want neat, polished nails fast', 'Between full manicures, to keep nails tidy', 'Before meetings, dinners and family functions'],
    note: 'Cuts, a nail infection or ingrown nails? Tell your technician first.',
  },
  process: {
    title: 'What to Expect',
    steps: [{ title: 'Choose your length, shape & shade' }, { title: 'Cut & file' }, { title: 'Base, colour & top coat' }],
  },
  aftercare,
  offerBand,
  locationsTitle: 'Quick Nail Care Near You in Bangalore',
  faqTitle: 'Quick Nail Care FAQs',
  faqs: [
    {
      q: 'What is included in Quick Nail Care?',
      a: 'Quick Nail Care includes nail cutting, filing and a coat of regular polish, for hands or feet, in one short sitting. It does not include the cuticle care, exfoliation and massage of a full manicure or pedicure, which makes it a fast way to get neat, polished nails.',
    },
    {
      q: 'Is Quick Nail Care the same as a manicure?',
      a: 'No. Quick Nail Care covers the essentials: cut, file and polish. A manicure adds a soak, cuticle care, exfoliation, a mask and a hand massage. Choose Quick Nail Care when you are short on time, and a manicure when you want the full pampering ritual.',
    },
    {
      q: 'Can I get Quick Nail Care on my toenails?',
      a: 'Yes. Quick Nail Care works for hands or feet. Your technician trims and files your toenails into a neat shape and finishes with regular polish. For rough heels or tired feet, a full pedicure ritual with exfoliation and massage is the better choice.',
    },
    {
      q: 'Where can I get a quick nail cut, file and polish in Bangalore?',
      a: 'At Xing Premium Unisex Salon in Sarjapur Road, HSR Layout and Brookfield. Book on WhatsApp or ask at the salon; it is a quick visit that fits easily before work, between errands or alongside another service. Booking ahead on WhatsApp gets you your preferred time.',
    },
  ],
  related: quickRelated('quick-nail-care'),
  cta: 'Neat, polished nails in one quick visit. Book Quick Nail Care at Xing today.',
};
