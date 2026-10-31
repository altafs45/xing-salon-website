# Prompt: the complete Offers page (3 November offers, all 3 salons) + a mobile-first, low-text, high-converting pass across the site

> Paste everything below the line into your coding agent from the project root (`xing salon 1`).
> **This replaces `OFFERS_PAGE_NAV_PROMPT.md`.** Don't run both. Stop the dev server and any other agent or editor first, so files aren't edited from two places at once.

---

You are working on an existing Vite + React 18 + TypeScript + Tailwind + Framer Motion multi-page site for XING Premium Unisex Salon (3 salons in Bangalore). Your job has 3 parts:

1. **A complete, separate Offers page** for the 3 November offers, valid at all 3 salons, that the nav's **Offers** item opens.
2. **A mobile-first redesign of that page**: shorter, more visual, less text, built to convert.
3. **The same mobile text and conversion rules applied to every page of the site**, proven with an automated mobile audit run several times.

Accuracy matters more than speed. Measure first, change what the measurement shows, then measure again.

## 0. What already exists (measured on 31 Oct on a 375 × 812 phone; don't rebuild it from scratch)

- A page already exists at **`/offers/november`**: `src/pages/NovemberOffersPage.tsx` (377 lines), copy in `src/data/novemberOffersPage.ts`, parts in `src/components/offers/NovemberBits.tsx` (`NovemberCard`, `NovemberStrip`, `NovemberBanner`, `NovBadge`, `NovemberServiceLink`) and `NovemberHero.tsx`, data in `novemberCampaign` in `src/data/offers.ts`, route `isNovemberOffers`, meta `novemberOffersMeta`, posters `public/images/offer-nov-*-480/800.webp`.
- **Why the owner says "no offers page exists":**
  1. The nav's **Offers** item goes to `/#offers` (a home-page section), not to this page (`navHref()` in `src/components/Header.tsx`; the mobile drawer uses it too).
  2. Every embed (banner on `/offers`, strip on salon pages, home card, popup, nav badge) is gated on `isCampaignLive()`, which is false until 1 Nov. So **nothing links to the page.**
- **Why it doesn't convert on mobile yet:** it is **26 screens long, with 1,519 words** across 15 sections. The offer cards take 4 screens (252 words), each "deep-dive" section is 1.4–1.7 screens, the blog block is 2.4 screens, and the results block is 4.1 screens. The **hero has no image**: the first screen is text plus a small price line.
- Rest of the site: salon order is already Sarjapur Road → HSR Layout → Brookfield (`locations` in `branches.ts`), and the nav already has Offers / Gifts / FAQ items (`nav` in `content.ts`). `scripts/seo-audit.mjs` exists.

## 1. Rules (follow every one)

1. **Reading budget.** Read only the files named in this prompt, and only the line ranges you need (`grep -n`, `sed -n a,bp`). Never open `node_modules/`, `dist/`, `server-dist/`, photo or video folders, or `package-lock.json`. Never print whole HTML pages. Use the audit scripts' output instead.
2. **Reuse, don't duplicate.** Restructure `NovemberOffersPage.tsx` and reuse `NovemberCard` and friends. Don't create a second offers page or copies of components. Edit in place.
3. **Facts only from `novemberCampaign`** (it matches the posters in `offers for november/`):
   - Global Hair Colour, any length: ₹5,999 → ₹3,999.
   - Highlights: ₹399 per streak, 8–10 streaks recommended. Use the "was" price already set in the data.
   - Crazy Colour: ₹799 → ₹499 per streak.
   - Balayage: from ₹7,999 → ₹5,499.
   - All valid until 30 Nov 2026, at all 3 salons.

   Don't add new prices, dates, reviews, ratings or counts. **Never write "up to 50%" or "-40%".** Calculate percentages with `savingPercent()` (it rounds down), and lead with the rupee saving.
4. **Honest urgency only.** You may show a day countdown, because 30 Nov is a real end date. Don't show ticking seconds, "only N slots", viewer counts, pre-ticked extras or hidden charges (India's 2023 CCPA dark-pattern guidelines ban these).
5. **Poster models are promotional images, not clients.** Never caption them as results. "Real results" use only client media from `src/data/media.ts` and the `work-*` photos.
6. Salon order everywhere: **Sarjapur Road → HSR Layout → Brookfield** (`locations` / `SALON_ORDER`).
7. **SEO/AEO is kept while text shrinks.** Every answer cut from the visible screen moves into a closed `<details>`/accordion or a bottom sheet. It stays in the HTML, and the `FAQPage` schema text equals the FAQ text exactly. The page keeps 1 `<h1>` and h2 → h3 order.
8. After every step: `npm run build && npm test && node scripts/seo-audit.mjs && node scripts/mobile-audit.mjs` (Step 2). Fix every error before moving on. Commit per step: `git add -A && git commit -m "offers: <step>"`.

## 2. First, build the measuring tool: `scripts/mobile-audit.mjs`

Use the Playwright already installed (`require('playwright')`; don't reinstall). Start `npm run preview` (after `npm run build`) or reuse a running dev server. For each URL in `dist/sitemap.xml` **plus `/offers/november`**, load it at **360×780, 375×812, 390×844 and 412×915**, with `deviceScaleFactor: 2` and a mobile user agent. Add `?today=2026-11-10` so the campaign is in the "live" state, and `?prerender=1` if that flag exists (no popup). Measure and print **one line per problem** (`ERROR|WARN <url> <width> <check> <detail>`), then a summary table per page (words, screens, sections, CTAs above the fold).

| Check | ERROR when | WARN when |
|---|---|---|
| Sideways scroll | `scrollWidth > innerWidth` | — |
| Text size | any visible text < 12 px | body copy < 14 px |
| Tap targets | a link or button < 44×44 px (inline text links inside paragraphs are exempt) | gap < 8 px between two targets |
| First screen | no H1, or no primary CTA fully visible above the fold (above the fixed bottom bar) | — |
| Offers page, first screen | no offer price **and** saving visible above the fold | — |
| Paragraph length | a paragraph > 5 lines at 360 px | > 3 lines |
| Section length | a section (other than a gallery or swipe row) > 1.5 screens | > 1.2 screens |
| Page length | Offers page > 12 screens or > 750 visible words; any other page > 1.4 × its own "before" value | the home page > 18 screens |
| Words per section | > 120 visible words | > 80 |
| Fixed bars | the fixed bottom bar covers the last CTA or the footer links when scrolled to the end | — |
| Overlap | two fixed or sticky elements overlap (sticky bar + popup + floating buttons) | — |
| Images | a broken image, an image without width/height, or an above-the-fold image with `loading="lazy"` | an image > 200 KB on mobile |
| Layout shift | CLS > 0.1 (PerformanceObserver over 3 s of load + scroll) | CLS > 0.05 |
| Console | any `console.error` | any warning |

"Visible words" means text that is visible without opening an accordion, sheet or `<details>`. Also save a full-page screenshot per page at 390 px to `screenshots/mobile/<slug>.png` for a human to review. Save the very first run to `mobile-audit-before.txt`. Add `"mobile:audit": "node scripts/mobile-audit.mjs"` to `package.json`.

## 3. Campaign states, so links work from today

In `src/data/offers.ts`, reuse or add `campaignState(now)` with three states:
- `'upcoming'`: before 1 Nov 00:00 IST.
- `'live'`: until 30 Nov 23:59:59 IST.
- `'ended'`: after that.

Also add `isCampaignOpen() = upcoming || live`. Keep `?today=YYYY-MM-DD` support in `campaignNow()`.

Switch **every** embed and nav entry from `isCampaignLive()` to `isCampaignOpen()`. What each state shows:
- **upcoming:** "Starts 1 Nov · valid till 30 Nov". The CTA is **"Reserve a November slot"**, and its WhatsApp text says "I'd like to book for November".
- **live:** "Valid till 30 Nov · N days left". The CTA is "Claim on WhatsApp".
- **ended:** embeds hide. The page stays at the same URL with a short "These offers have ended" hero and links to `/offers` and the colour service pages. In the schema, `availability` is Discontinued.

## 4. Nav: "Offers" opens the Offers page

Edit `src/components/Header.tsx` and `src/components/nav/MobileMenu.tsx`. The nav labels stay in `content.ts`.

- **While the campaign is open**, the desktop **Offers** label links to **`/offers/november`**. Its dropdown, in this order:
  1. **"November Hair Colour Offers · from ₹399"**, with a small "Ends 30 Nov" or "Starts 1 Nov" pill.
  2. Global Hair Colour ₹3,999 → `#nov-global-colour`.
  3. Highlights ₹399/streak → `#nov-highlights`.
  4. Balayage & Crazy Colour → `#nov-colour-menu`.
  5. A divider, then "All salon offers" → `/offers`.
  6. "View November offers →".
- **After it ends**, the label links to `/offers` and the November items disappear.
- **Mobile drawer:** tapping Offers opens a sub-panel with the same items. Use the drawer's existing sub-panel pattern (`onEnter`/`onBack`). The top item is a big card showing the poster thumbnail, "From ₹399 · Save up to ₹2,500" and a full-width "See November offers" button. Every row is ≥ 56 px tall.
- **Active state:** Offers is highlighted on `/offers` and `/offers/november`. `NovBadge` ("Nov") shows on the Offers item while the campaign is open.
- Check desktop at 1024 px (no wrapping) and 1280 px. Check the keyboard: Tab, Enter and Esc work, with `aria-expanded` and focus returning to the label.

## 5. The Offers page `/offers/november`: new mobile-first structure

Target on a 375 px phone: **≤ 12 screens, ≤ 750 visible words, ≤ 80 visible words per section, one clear CTA per screen.** Desktop uses the same order in 2–3 columns. Rebuild `NovemberOffersPage.tsx` in this order (section ids in brackets; keep the existing ids where they exist, because the nav and embeds link to them):

1. **Hero `#top`. Must fit in one screen at 375 px.**
   - Show the **Global Hair Colour poster** (`offer-nov-global-colour-800.webp`, 4:5, `fetchpriority="high"`, not lazy) as a rounded image, about 55% of the screen height, with a "Save ₹2,000" sticker on it.
   - Under it: the H1 **"November Hair Colour Offers"** (short, ≤ 4 words on the visible line). Keep the SEO keyword in the `<title>` and in a visually hidden span `in Bangalore`.
   - One line: "Save up to ₹2,500 · all 3 Xing salons".
   - The **price row**: ~~₹5,999~~ **₹3,999**.
   - The state pill ("Starts 1 Nov" / "N days left").
   - The **primary CTA** "Claim on WhatsApp" (full width, 52 px tall) and a text link "Book a slot".
   - **Remove from the hero:** the long sub-paragraph, the 3 jump chips (they move to section 2) and the trust row (it moves to section 3).
   - Keep the hero in `SHELLS` (first paint) in sync with the new markup.
2. **Offer switcher + cards `#offers`. This is the heart of the page.**
   - A **sticky segmented control** (Global · Highlights · Balayage & Crazy, 44 px, sticks just under the header) scrolls to each card and highlights the card in view.
   - Each **card**:
     - Poster image (4:5, lazy except the first).
     - Title.
     - Big price in the familiar pattern ~~₹5,999~~ **₹3,999**, with a green pill "Save ₹2,000 · 33% off".
     - Unit ("per streak" / "from").
     - **Exactly 3 icon bullets** (≤ 5 words each, e.g. "Any hair length", "Premium colour + finish", "1.5–2 hours").
     - "Valid till 30 Nov · all 3 salons".
     - **Claim** (opens the existing salon picker in Sarjapur → HSR → Brookfield order, then WhatsApp prefilled with the offer name, price and salon).
     - A secondary **"Details"** button that opens the existing `OfferSheet` bottom sheet. Everything from the old deep-dive sections lives there, unchanged: who it suits, what happens, how long it lasts, aftercare, the service page link and terms.
   - **Highlights card:** add a 3-option chip row "6 / 8 / 10 streaks" that updates the total live ("8 streaks ≈ ₹3,192"), calculated from the data.
   - **Menu card:** a 4-row mini price table. It keeps the `Best value` tag only if it's true by rupee saving.
   - **Cards go one after another vertically** on mobile. Don't use a horizontal carousel for the main offers: people miss offers hidden in a carousel.
3. **Trust strip `#trust`** (one screen at most). It replaces the old "safety", "how to claim" and "genuine" sections.
   - A 2×2 icon grid: "Free consultation", "Patch test on request", "Price fixed before we start", "Pay at salon, nothing online". 2–4 words each, plus the ★ rating and review count line.
   - Below the grid, one closed accordion **"Why these offers are genuine"**, containing the old genuine text plus what's not included, plus one-offer-per-service and not-with-Tuesday terms.
   - A 3-step row "Claim → We confirm → Visit": icons with ≤ 4 words each.
4. **"Which one suits me?" `#choose`.** Keep the existing picker, but show it as 3 big tap tiles with 1 line each. The result scrolls to the matching card and briefly highlights it. ≤ 40 visible words.
5. **Real results `#results`.**
   - **One** before/after slider (the colour pair).
   - **One horizontal swipe row** of highlights/balayage reels and photos, with scroll-snap and peeking next items. Videos use `preload="none"`, a poster image, play only when in view, and are muted with `playsinline`.
   - Caption: "Our own clients, photographed in our salons." Max 1.5 screens. This replaces the current 4.1 screens.
6. **Price table `#prices`.** A compact table (Service · Was · Now · Save ₹). The highlights row shows "₹399/streak · 8–10 ≈ ₹3,192–₹3,990". Below it, one line: "Olaplex optional · price confirmed before we start". No extra paragraph.
7. **Reviews `#reviews`.** A horizontal swipe row of the colour-related real reviews (each trimmed to ≤ 25 words with "…more" opening the full text), plus "Read all on Google".
8. **Claim at your salon `#salons`.**
   - 3 compact rows in Sarjapur Road → HSR Layout → Brookfield order. Each row has the salon name, area, an open-now chip, and icon buttons for Call, Directions, and **Claim here** (WhatsApp prefilled with that salon, no picker).
   - Addresses go in a "Show address" disclosure.
9. **FAQ `#faq`.** All 10 questions stay, as an accordion, all closed by default, with answers written answer-first in ≤ 45 words. The schema stays identical to the text.
10. **Blog `#guides`.** **3** posts in a horizontal swipe row of compact cards (image, category, title, read time; no excerpt on mobile), plus "All articles". This replaces the current 2.4 screens.
11. **Final CTA band:** "Your new colour is one message away." plus a full-width Claim button.
12. **Sticky bottom bar on this page:** "Claim · from ₹399 · N days left" on the left as the main WhatsApp button, and a Call icon on the right. It appears after the hero CTA scrolls out of view and hides while the bottom sheet is open. It must not cover the final CTA or the footer.

**Copy rules for this page:**
- Plain Indian English, using ₹ with Indian digit grouping (`formatPrice`).
- A heading is ≤ 6 words, and on mobile the question-style H2s are short ("Which one suits me?").
- No paragraph over 3 lines at 360 px.
- No hype words ("unbelievable", "crazy deal", "hurry").
- Every number shown is calculated from `novemberCampaign`.
- Delete text that repeats something said elsewhere on the same page.

**Motion:** subtle fade/slide only (≤ 250 ms), honour `prefers-reduced-motion`, and no animation on LCP elements. Tap feedback: `active:scale-[0.98]` on buttons.

## 6. Embed the offers on all 3 salon pages and elsewhere (shown while `isCampaignOpen()`)

- **Salon pages** `/salons/sarjapur-road`, `/salons/hsr-layout`, `/salons/brookfield` (`BranchPage.tsx`):
  - Directly under the salon hero, add a **compact November strip** (`NovemberStrip`): a horizontal swipe row of the 3 offers. Each mini card has the poster thumb, title, ~~was~~ **now**, the saving pill, and **"Claim at <this salon>"** (WhatsApp prefilled with that salon, no picker).
  - Then add a link "See all November offers →" to `/offers/november`.
  - Keep each salon's existing offer FAQ answer accurate: it mentions the November prices and never says "up to 50%".
  - Add the 3 offers to each salon's JSON-LD (`Offer` with price, INR, `validFrom`, `priceValidUntil`, `availability`).
- **`/offers`:** a full-width November banner at the very top (poster thumb, "From ₹399 · Save up to ₹2,500", "See November offers"). Keep the other offers below it.
- **Home page:** the first card in the Offers section becomes the November offer, linking to `/offers/november`.
- **Offer popup:**
  - It shows the November offer (Global ₹3,999, the state pill, "Claim" and "See all 3").
  - It appears at most once per visitor per 3 days (localStorage wrapped in try/catch), not on `/offers*`, `/faq` or `/membership-gift-cards`, and never within 8 s of load or before 40% scroll on mobile.
  - It must not overlap the sticky bar.
- **Service pages** `/services/global-hair-color`, `/highlights`, `/balayage` and `/fashion-color`: the existing `NovemberServiceLink` shows as a slim offer bar near the top: "November: ₹3,999 any length → See offer".

## 7. Site-wide mobile pass: less text, more conversion (every page)

Use `mobile-audit-before.txt` as the work list. Fix in **shared components and data files**, never page by page in JSX.

**Text budget for every page at 375 px:**

| Element | Max |
|---|---|
| Hero sub-text | 20 words, 2 lines |
| Section intro under a heading | 25 words (or remove it) |
| Card text | 18 words |
| Paragraph | 3 lines visible; the rest goes in "Read more" (`<details>`, stays in the HTML) |
| Section | 80 visible words, 1.2 screens (galleries and swipe rows excepted) |
| Lists | 5 visible items; the rest goes behind "Show all" |

**How to cut, in this order:**
1. Remove sentences that repeat the heading or another section.
2. Turn feature sentences into icon + 2–4-word labels.
3. Move explanations into accordions, sheets or "Read more".
4. Turn long multi-card stacks into horizontal swipe rows (scroll-snap, the next card peeking about 15%, a visible "1/6" indicator or dots).

**Never cut:**
- prices or terms
- FAQ answers (they stay in accordions)
- the H1
- addresses and phone numbers (they can sit behind a disclosure)
- legal or consent text in the gift and membership form

Shared components to change once: `SectionHeader` (intro text hidden on mobile when it's longer than 25 words; a `mobileText` prop gives a shorter version), the card components in `ServiceCards`, `OfferCard`, `BlogCard` and the review cards, `Sections.tsx`, `BranchesSection`, `WhyChoose`, `Guides`, `Transformations`, `Reels`, `FaqAbout`, and the `Footer` (accordion groups on mobile).

**Conversion rules on every page:**
- **One primary CTA visible on the first screen** on every page.
- **Exactly one sticky bottom bar** per page (`MobileStickyBar`), with WhatsApp as the main action, plus Call and Directions. While the campaign is open, the WhatsApp label becomes "Claim Nov offer" on the home page, the colour service pages, the salon pages and `/offers`.
- Every long section ends with one CTA. Don't put two primary buttons side by side.
- Every WhatsApp link is prefilled with the page context (service or offer, plus salon when known).
- Tap targets are ≥ 44 px. Inputs are ≥ 16 px font so iOS doesn't zoom in. `inputmode`/`autocomplete` are set on the booking form and the gift form.
- No layout shift from the popup, banners or late fonts.

**Analytics:** push `nov_offer_view`, `nov_offer_claim`, `nov_offer_book`, `nov_offer_details`, `nov_picker_result`, `nov_nav_click` and `sticky_cta_click` through `src/lib/analytics.ts` with `{ offer_id, branch, placement, page }`. No personal data.

## 8. Checks: run all of them, three times, before reporting

**Pass 1, automated:**
1. `npm run build && npm test`. Add `tests/campaign.test.ts` covering:
   - the three states at 2026-10-31 23:59, 2026-11-01 00:00, 2026-11-30 23:59 and 2026-12-01 00:00 IST
   - no "50%"/"40%" anywhere in the campaign data or page copy
   - every displayed % equals `savingPercent()`
   - the highlights streak totals are correct
   - the WhatsApp text contains the offer, price and salon
   - the 3 salon pages render the strip in Sarjapur → HSR → Brookfield order
2. `node scripts/seo-audit.mjs` → 0 errors.
3. `node scripts/mobile-audit.mjs` at `?today=2026-10-31`, `?today=2026-11-10` and `?today=2026-12-01` → 0 errors in all three runs. Save the live-state run to `mobile-audit-after.txt`. The Offers page must show **≤ 12 screens and ≤ 750 visible words**.

**Pass 2, interactions (Playwright script, 390 px):**
- Tap Offers in the drawer, then "See November offers": you land on `/offers/november`.
- Tap each segmented control: each card scrolls into view.
- Highlights streak chips update the total.
- Details opens the sheet, and Back or the swipe-down gesture closes it.
- Claim opens the picker, which lists Sarjapur → HSR → Brookfield, and the WhatsApp URL decodes to the right offer, price and salon.
- On each salon page, "Claim at <salon>" skips the picker.
- The sticky bar appears after the hero and never covers the last CTA.
- The popup respects its rules.
- Every `#anchor` from the nav lands with the heading visible below the sticky header (`scroll-margin-top`).

**Pass 3, text read-through:**
- Open the 390 px screenshots of `/offers/november`, `/`, the 3 salon pages, `/offers`, one service page and one blog post (`screenshots/mobile/`).
- Read every visible line. Fix:
  - text that is cut off, overflows or wraps mid-word
  - orphan words alone on a line in headings (use `text-wrap: balance`)
  - inconsistent salon names
  - prices that don't match the data
  - repeated sentences
  - anything that sounds like hype
- Re-run Pass 1 after the fixes.

Also run Lighthouse mobile on `/offers/november` and one salon page. Targets: LCP < 2.5 s, CLS < 0.1, Performance ≥ 90, Accessibility ≥ 95, SEO 100. Fix the top opportunities.

## 9. Finish

1. **Update `README.md`:**
   - the Offers page section: the route, the campaign states, where the data lives, how the nav switches, how to run next month's campaign (change `novemberCampaign` dates, offers and posters; everything else follows)
   - the mobile text budget table from Step 7
   - `npm run mobile:audit`
   - a dated **Change log** line
2. Reply with ONLY:
   - the files changed (one line each)
   - before → after for the Offers page (screens, visible words) and the site-wide error counts from the mobile audit
   - the Lighthouse numbers
   - any owner TODOs
