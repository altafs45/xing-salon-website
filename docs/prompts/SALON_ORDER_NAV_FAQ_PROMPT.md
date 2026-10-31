# Prompt: salon order (Sarjapur → HSR → Brookfield), Offers + Gifts dropdowns, FAQ page

> Paste everything below the line into your coding agent from the project root (`xing salon 1`).
> If you run it together with `NOVEMBER_OFFERS_PROMPT.md`, run this one **first**. The November page then inherits the salon order and the new Offers menu.

---

You are editing an existing Vite + React + TypeScript + Tailwind multi-page site (XING Premium Unisex Salon, 3 Bangalore salons). Make three changes efficiently: use `grep`/`sed -n` ranges, edit in place, reuse existing components, never rewrite whole files, and never open `node_modules/`, `dist/`, `server-dist/`, photo/video folders or `package-lock.json`.

## Decisions (already made by the owner)

- **Salon order everywhere:** 1. Sarjapur Road (`sarjapur-road`) 2. HSR Layout (`hsr-layout`) 3. Brookfield (`brookfield`).
- **Display name:** keep the existing `name` values in `branches.ts`. Don't rename "Sarjapura Road" unless the owner says so; just report every place the spelling differs ("Sarjapur" vs "Sarjapura").
- **Primary salon** (header phone/WhatsApp, `primaryLocation`): leave it as it is unless the owner says otherwise. This task changes **order only**.

## Task 1: one salon order across the whole site

**Single source of truth.** In `src/data/branches.ts`:
1. Reorder the `locations` array to `sarjapur-road`, `hsr-layout`, `brookfield`. Move the objects; don't edit their contents.
2. Export `export const SALON_ORDER = ['sarjapur-road', 'hsr-layout', 'brookfield'] as const;` and a helper `bySalonOrder(a, b)` for any code that orders salons from another source.
3. In `src/data/offers.ts`, set `ALL_BRANCHES` to the same order, typed from `SALON_ORDER`.

**Then make every list follow it.** Run this once and work through the hits (don't open files with no hits):

```bash
grep -rnE "brookfield|hsr-layout|sarjapur-road|Brookfield|HSR|Sarjapur" src content server vite.config.ts index.html public/robots.txt public/site.webmanifest \
  --include=*.ts --include=*.tsx --include=*.md --include=*.html --include=*.json --include=*.txt \
  | grep -vE "id: '|import |^\S+:\s*//" > /tmp/salon-hits.txt; wc -l /tmp/salon-hits.txt
```

Fix each kind of place:
- **Rendered lists** (dropdowns, tabs, branch cards, branch picker, booking-form salon select, offer "Claim at" pickers, sticky-bar picker, footer, About, `/salons`, the "Closer to one of our other salons?" block on each salon page, gift/membership salon select, the 404 page): they must render from `locations` (or sort with `bySalonOrder`), not from a hardcoded array. If a component has its own array, replace it with `locations`.
- **`BranchPicker.tsx` line ~66** moves the last-used salon to the top. Remove that reordering and keep the fixed order. Instead, **pre-select / highlight** the last-used salon. Do the same anywhere else that reorders by last use.
- **Default tab/selection** (salon tabs on home "Our Branches" and "Inside Xing", salon picker defaults): the first tab = Sarjapur Road, unless the visitor already chose a salon.
- **Text that lists salons** in copy (`content.ts`, `offersPage.ts`, `about.ts`, `giftMembership.ts`, `services.ts`, `src/data/pages/*.ts`, `branchPages/*.ts` FAQs, `seo.ts` titles/descriptions, the home `<title>`, and blog posts in `content/blog/*.md`): rewrite the listing as **"Sarjapur Road, HSR Layout and Brookfield"** (or "Sarjapur Road · HSR Layout · Brookfield" in short UI strings). Keep the sentence otherwise the same. Leave sentences about one salon alone. Titles/descriptions must stay ≤60 / ≤155 characters. Re-count after the edit. Example: the home title becomes "Xing Premium Unisex Salon in Bangalore | Sarjapur, HSR, Brookfield".
- **Schema** (`seo.ts`): the organization's `location`/`department`/`subOrganization` arrays, `OfferCatalog` providers and `areaServed` lists follow `SALON_ORDER`.
- **Server/email** (`server/`, `src/shared/leadMessages.ts`, `.env.example` comments): any salon list or select options follow the order. Env var names stay unchanged.
- **Sitemap:** the salon URLs are listed in the new order (they come from `routes`, so this should follow automatically; just check).

## Task 2: navigation (desktop header + mobile drawer)

The current nav is in `src/data/content.ts` (`nav`): Home · Services · Blogs · Offers · Gift Cards & Membership · Salons · About Us. Header logic: `src/components/Header.tsx` (`navHref`, `SalonsMenu` dropdown pattern at ~line 67), mobile drawer: `src/components/nav/MobileMenu.tsx`.

**New nav:** Home · Services · **Offers ▾** · **Gifts ▾** · Salons ▾ · Blogs · **FAQ** · About Us

1. **Offers ▾**: build it as a dropdown by copying the `SalonsMenu` pattern: same hover/focus/keyboard behaviour, `aria-expanded`, Esc closes, and on desktop clicking the label goes to `/offers`. Items come from `salonOffers` in `src/data/offers.ts`, so the menu updates automatically when offers change. Each item shows the title and its badge, e.g. "Hydra Facial · Flat 35% off", and links to `/offers#<id>` via `promoHref`. Leave out `membership` and `gift-card` (they go under Gifts). If `novemberCampaign` exists and `isCampaignLive()`, add a highlighted first item "November Hair Colour Offers · ends 30 Nov" → `/offers/november`. The last item is "View all offers →" `/offers`.
2. **Gifts ▾**: replaces "Gift Cards & Membership". Items: **Gift Cards** → `/membership-gift-cards#gift-cards` · **Membership Offers** → `/membership-gift-cards#membership` · "Compare options" → `/membership-gift-cards#compare`. (These ids already exist in `components/gift/OccasionGrid.tsx`, `MembershipTiers.tsx` and `Comparison.tsx`. Check them, don't add new ones.) Clicking the label goes to `/membership-gift-cards`. Gym membership is a separate business (`xingfitness.in`): only add "Gym Membership (Xing Fitness) ↗" as a last item marked external if the owner confirms. Leave it out by default.
3. **Salons ▾**: the existing dropdown, now in Sarjapur → HSR → Brookfield order (this comes from Task 1).
4. **FAQ** → `/faq` (Task 3).
5. **Active state:** add `isFaq` and highlight Offers on `/offers` and `/offers/*`, Gifts on `/membership-gift-cards`, and FAQ on `/faq` (`Header.tsx` ~line 130 has the active-item chain).
6. **Mobile drawer:** Offers, Gifts and Salons open a sub-panel. Reuse the drawer's existing Services sub-panel mechanism (`onEnter`/`onBack`), with a full-width "View all" button at the bottom. 44 px minimum tap targets.
7. Keep everything else as it is: the header shrinking/hiding on scroll, the phone and WhatsApp buttons, and the mega menu. Check that the desktop nav doesn't wrap at 1024 px; if it does, shorten "About Us" → "About" first.

## Task 3: a standalone `/faq` page

New `src/pages/FaqPage.tsx`, copy in new `src/data/faqPage.ts`. **Don't write new answers where real ones exist.** Gather and reuse the existing Q&As (same wording, so the page and the schema match the rest of the site):

| Group (tab + anchor) | Source |
|---|---|
| Booking & visits `#booking` | home FAQ in `content.ts` + `about.ts` |
| Offers & pricing `#offers` | `offersPage.faqs` (+ November FAQs if that campaign exists) |
| Hair colour `#hair-colour` | `src/data/pages/hair-color.ts` faqs |
| Smoothing & treatments `#treatments` | `smoothing.ts`, `hair-botox.ts`, `hair-spa.ts` |
| Skin, nails & grooming `#skin-nails` | `hydra-facial.ts`, `facial-cleanup.ts`, `nail-*.ts`, `waxing.ts`, `mens-haircut-beard-grooming.ts` (2–3 each) |
| Gift cards & membership `#gifts` | `giftMembership.ts` faqs |
| Our salons `#salons` | one block per salon in **Sarjapur → HSR → Brookfield** order, 3–4 Qs each from `branchPages/*.ts` |

- Import the arrays; don't copy-paste them, so every answer still has one home. Remove exact duplicates (same question).
- Layout, reusing what exists: hero (H1 **"Salon FAQs – Xing Bangalore"**, a one-line answer-first intro, and a client-side search box that filters questions), a sticky group tab bar (it scrolls sideways on mobile), the existing `FAQAccordion` per group, each answer ending with a "Learn more →" link to its source page, a "Still have a question?" block with WhatsApp/Call through the salon picker in the new order, and a final CTA. Keep it short; this page answers questions, it doesn't sell.
- SEO/AEO: add `faqPageMeta` in `seo.ts` (title ≤60 "Salon FAQs | Prices, Offers, Booking – Xing Bangalore", description ≤155) with `BreadcrumbList` + **one** `FAQPage` holding every visible Q&A. Register it in `extra()` in `vite.config.ts`, add it to the page→chunk map (`if (path === '/faq') return faqPage;`), add `isFaq` in `src/lib/route.ts` (and exclude it from `isNotFound`/`isHome`), and add a lazy import in `App.tsx`. Check it appears in `sitemap.xml`.
- Add an "All FAQs →" link under the FAQ section of the home page, `/offers` and each salon page.

## Check, then report (once, at the end)

1. `npm run build && npm test`. Fix everything. Add `tests/order.test.ts`: `locations.map(l => l.id)` equals `SALON_ORDER`; `ALL_BRANCHES` equals `SALON_ORDER`; the `/faq` FAQPage schema question count equals the questions rendered from `faqPage.ts`; no exact duplicate questions.
2. Re-run the grep from Task 1 and confirm there's no listing left in a different order. Paste the remaining hits that are intentionally single-salon.
3. `npm run dev`, then at 390 px and 1280 px check: the Offers and Gifts dropdowns (mouse, keyboard Tab/Enter/Esc, mobile sub-panels), the anchors `#gift-cards`/`#membership` land correctly, `/faq` search and tabs work, every salon dropdown/tab/picker/card on `/`, `/salons`, a salon page, `/offers`, a service page, `/membership-gift-cards` and the booking form shows **Sarjapur Road → HSR Layout → Brookfield**, and there are no console errors.
4. **Update `README.md`**: add the salon-order rule ("`SALON_ORDER` in `branches.ts`; never hardcode a salon list") to *Changing content*, describe the new nav (where the Offers/Gifts menu items come from) and add `/faq` to the **Pages** table, then add a dated **Change log** line.
5. Reply with ONLY: the files changed (one line each), the spelling mismatches found, and anything you couldn't verify.
