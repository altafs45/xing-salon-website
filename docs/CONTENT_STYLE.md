# Xing content style

For anyone writing or changing copy on the site. The rules are in `src/data/style.ts`, and `npm run consistency:audit` checks them.

## The rules

| Topic | Write |
| --- | --- |
| Brand, short | Xing |
| Brand, full | Xing Premium Unisex Salon. A specific salon's full name is `fullName` in `branches.ts`, the exact Google name |
| Title suffix | ` – Xing Salon`, unless it would push the title past 60 characters |
| City | Bangalore. Bengaluru only in postal addresses and schema |
| Spelling | Indian/British English: colour, personalised, centre, favourite, programme. URLs keep "color" |
| Salon labels | Sarjapur Road · HSR Layout · Brookfield |
| WhatsApp | WhatsApp |
| Main button | Book Appointment |
| WhatsApp buttons | Chat on WhatsApp. On offers: Claim on WhatsApp |
| Offer cards | Claim Offer |
| Other buttons | Call · Directions · View Details · See All Services / Offers / Articles |
| Headings | Title Case for statements, sentence case ending in "?" for questions, no full stop |
| Times | 10 AM – 9:30 PM |
| Ranges | 1.5–2 hours, 8–10 streaks |
| Money | ₹3,999, always through `formatPrice()` |
| Phone | +91 89700 07440, from `branches.ts` only |
| Rating | 4.8 ★ · 2,550+ Google reviews, from `ratingLabel()` |
| Dates | 30 Nov 2026 in UI, 30 November 2026 in prose, ISO in schema |
| Numbers | Digits for 10 and above and all measurements; words for one to nine in prose |
| Emoji | None in copy, headings or meta |

## Do and don't

| Do | Don't |
| --- | --- |
| Global hair colour is ₹3,999 at any length. | Amazing global color at unbelievable prices! |
| Open daily 10 AM – 10 PM | Open 10am-10pm |
| Book Appointment | Book now |
| Sarjapur Road, HSR Layout and Brookfield | Sarjapura, HSR & AECS |
| 4.8 ★ from 2,550+ Google reviews | The best salon in Bangalore |

## Titles and descriptions

- Service: `<Service> in Bangalore | <Benefit> – Xing Salon`
- Salon: `Unisex Salon in <Area>, Bangalore – Xing <Label>`
- Blog: `<Question or Topic> – Xing Salon`
- Description: the keyword, a concrete benefit and an action, up to 155 characters.

## Page structure

| Page type | Order on a phone |
| --- | --- |
| Home | Hero → Trust row → Offers → Services → Results → Salons → Reviews → FAQ → Blog → Final CTA |
| Service category | Hero → Service list → Results → Offers → Salons → FAQ → Guides → CTA |
| Service page | Hero → Quick answers → What it is → Results → Process → Aftercare → Offers → Salons → FAQ → Guides → Related services → CTA |
| Salon page | Offers strip → NAP block → Quick answers → Top services → Inside → Results → Reviews → How to reach → FAQ → Other salons → CTA |
| Blog post | Breadcrumb → H1 → Byline → Key takeaways → Body → FAQ → Service CTA → Related posts |
| About, FAQ, Gifts | Hero → Content → FAQ → CTA |

Every page but home has a visible breadcrumb. Every page has one H1, no skipped heading levels, one sticky bar on phones, and a footer with the 3 salon address blocks.
