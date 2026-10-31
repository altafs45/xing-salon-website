// /faq gathers the questions answered across the site. Nothing is copied: every answer still has one home, in
// the file it is imported from here.
// Keep this file free of React/asset imports: vite.config.ts also reads it to build SEO tags.
import { about } from './about';
import { locations } from './branches';
import { branchPages } from './branchPages';
import { faq } from './content';
import { faqs as gmFaqs, membershipPath } from './giftMembership';
import { novemberOffersPage } from './novemberOffersPage';
import { campaignNow, isCampaignOpen, novemberCampaign, offersPath, withCampaignFaq } from './offers';
import { offersPage } from './offersPage';
import { servicePages } from './pages';

export interface FaqItem {
  q: string;
  a: string;
  /** The page the answer comes from. */
  href: string;
}

export interface FaqGroup {
  id: string;
  label: string;
  title: string;
  /** One block, except Our salons: one per salon. */
  blocks: Array<{ title: string; items: FaqItem[] }>;
}

export const faqPage = {
  seo: {
    // Up to 60 and 155 characters, so search results show them in full.
    title: 'Salon FAQs | Prices, Offers, Booking – Xing Bangalore',
    description: 'Answers on booking, offers, hair colour, treatments, skin, nails, gift cards and all 3 Xing salons in Bangalore: Sarjapur Road, HSR Layout and Brookfield.',
    crumb: 'FAQ',
  },
  hero: {
    eyebrow: 'Help',
    h1: 'Salon FAQs – Xing Bangalore',
    text: 'Quick answers on booking, offers, services and our 3 salons.',
    searchLabel: 'Search the questions',
    searchPlaceholder: 'Search, e.g. keratin or timings',
    noResults: 'No questions match that. Try another word, or ask us on WhatsApp.',
  },
  still: { title: 'Still have a question?', text: 'Message or call your nearest salon and we’ll help.', whatsapp: 'Ask on WhatsApp', call: 'Call a salon' },
  cta: { title: 'Ready when you are.', book: 'Book a Slot' },
  moreLabel: 'Learn more',
  allLabel: 'All FAQs',
};

const fromPage = (slug: string, count?: number): FaqItem[] =>
  servicePages[slug].faqs.slice(0, count).map(({ q, a }) => ({ q, a, href: `/services/${slug}` }));
const from = (items: ReadonlyArray<{ q: string; a: string }>, href: string): FaqItem[] => items.map(({ q, a }) => ({ q, a, href }));

/** Each question once, wherever it first appears. */
function withoutRepeats(groups: FaqGroup[]) {
  const seen = new Set<string>();
  return groups.map((group) => ({
    ...group,
    blocks: group.blocks.map((block) => ({
      ...block,
      items: block.items.filter((item) => {
        if (seen.has(item.q)) return false;
        seen.add(item.q);
        return true;
      }),
    })),
  }));
}

/** Every group in page order. The November questions leave when the campaign ends. */
export const faqGroups = (now = campaignNow()): FaqGroup[] =>
  withoutRepeats([
    { id: 'booking', label: 'Booking & visits', title: 'Booking & Visits', blocks: [{ title: 'Booking & Visits', items: [...from(faq.items, '/'), ...from(about.faqs, '/about')] }] },
    {
      id: 'offers',
      label: 'Offers & pricing',
      title: 'Offers & Pricing',
      blocks: [{ title: 'Offers & Pricing', items: [...from(offersPage.faqs, offersPath), ...(isCampaignOpen(now) ? from(novemberOffersPage.faqs, novemberCampaign.path) : [])] }],
    },
    { id: 'hair-colour', label: 'Hair colour', title: 'Hair Colour', blocks: [{ title: 'Hair Colour', items: ['global-hair-color', 'highlights', 'balayage', 'fashion-color'].flatMap((slug) => fromPage(slug)) }] },
    {
      id: 'treatments',
      label: 'Smoothing & treatments',
      title: 'Smoothing & Treatments',
      blocks: [{ title: 'Smoothing & Treatments', items: ['keratin-treatment', 'hair-smoothening', 'hair-straightening', 'hair-botox', 'nanoplastia-cysteine', 'hair-spa'].flatMap((slug) => fromPage(slug)) }],
    },
    {
      id: 'skin-nails',
      label: 'Skin, nails & grooming',
      title: 'Skin, Nails & Grooming',
      blocks: [
        {
          title: 'Skin, Nails & Grooming',
          items: ['hydra-facial', 'facial-cleanup', 'manicure', 'pedicure', 'nail-extensions', 'nail-art', 'waxing', 'mens-haircut-beard-grooming'].flatMap((slug) => fromPage(slug, 3)),
        },
      ],
    },
    { id: 'gifts', label: 'Gift cards & membership', title: 'Gift Cards & Membership', blocks: [{ title: 'Gift Cards & Membership', items: from(gmFaqs, membershipPath) }] },
    {
      id: 'salons',
      label: 'Our salons',
      title: 'Our Salons',
      blocks: locations.map((salon) => ({ title: `Xing ${salon.name}`, items: from(withCampaignFaq(branchPages[salon.id].faqs, now).slice(0, 4), salon.path) })),
    },
  ]);

/** Every question on the page, in one list: what the schema sends. */
export const allFaqs = (groups: FaqGroup[]) => groups.flatMap((group) => group.blocks.flatMap((block) => block.items));
