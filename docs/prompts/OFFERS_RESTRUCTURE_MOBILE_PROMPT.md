# Prompt: rebuild the Offers section as one clean `/offers/...` structure for all 3 salons + make the whole site perfect on mobile

> Paste everything below the line into your coding agent from the project root (`xing salon 1`).
> **Before you paste it:** the project has **90 uncommitted changes**, including a staged deletion of `content/blog/hair-botox-vs-keratin.md`, renamed images and the old offer pages. Step 0 handles this safely. Stop the dev server and any other agent first.

---

You are working on an existing Vite + React 18 + TypeScript + Tailwind multi-page site for XING Premium Unisex Salon (`https://www.xingsalons.com`, 3 salons in the order Sarjapur Road → HSR Layout → Brookfield). Pages are prerendered. The audits `seo:audit`, `mobile:audit`, `consistency:audit`, `perf:budget` and `seo:checklist` exist, along with tests in `tests/`. The salon facts in `src/data/branches.ts` are locked to the Google Business Profiles (`tests/gbp.test.ts`). The style rules are in `src/data/style.ts`.

**Goal:**
1. Replace the current patchwork of offer pages with **one clean Offers section under `/offers/...`** that treats all 3 salons equally.
2. Fix the broken logo, layout and URL problems.
3. Make the **whole site, and the Offers section above all, smooth, fast and polished on mobile.**

Work by measuring: audit, fix, then re-audit.

## 0. What's wrong today (measured 3 Nov 2026, on a 375 × 812 phone)

**1. The Offers menu and pages feature one salon at a time.**
- `offersMenu()` in `src/data/navMenus.ts` sends every visitor to **HSR Layout's** pages, or Sarjapur's if they picked Sarjapur. **Brookfield never appears.**
- The menu items carry a salon "note".

**2. There are six old landing pages copied from the previous site**, served as raw HTML from `public/` (listed in `src/data/staticOfferPages.ts`):
- `/hsrhaircoloroffers`, `/hsrhairtreatmentoffers`, `/hsrskincareoffers`
- `/sarjapaurahaircoloroffers` (misspelt), `/sarjapurahairtreatmentoffers`, `/sarjapuraskincareoffers`

Each page is 77–87 KB of its own HTML with its own CSS (`/offer-pages/site-theme.css`), its own JS (`/offer-pages/salon-picker.js`), Google Fonts and Google Ads tags (`AW-18405222369`, `AW-16703202075`). Most are `noindex`. They have:
- **their own header and footer.** The footer logo links to `#` ("Back to top"), not home. That is the "logo doesn't take me home" problem.
- **stale, inconsistent facts:** "4.9 ★ · 1,000+ happy clients", "326+ Google reviews", addresses that don't match the GBP, and "Brookefield".
- **URLs** that aren't under `/offers/`.

**3. `/offers` contains `XingOffersByLocation`** (`src/components/offers/XingOffersByLocation.tsx` + `xing-offers-by-location.css`). It is a hardcoded block with problems:
- HSR first, not the site's salon order
- stale ratings (393 / 319 / 1,552)
- non-GBP addresses
- "AECS Layout, Brookefield"
- links to the six old pages and to `https://www.xingsalon.com/hair-color-offer.html` (the **old domain**)
- uppercase "WHATSAPP …" buttons

**4. Two offer URL schemes exist:** `/offers/november` (the campaign) and the six slugs above. **The owner wants every offer page at `xingsalons.com/offers/<name>`.**

**5. Mobile breakpoint problems on `/offers/november`:**
- **Offer tabs:** "Balayage & Crazy" wraps to 2 lines in the segmented control at 375 px.
- **Sticky bar:** "Claim Offer · from ₹399 · 28 days left" wraps to 2 lines.
- **Offer cards are wider than the screen.** At 375 px they measure wider than the viewport (`ARTICLE`, `IMG`, `H2`, the price row).
- **Header:** it hides on scroll-down (`top: -60px`), so the logo is unreachable mid-page. The segmented control isn't sticky any more.

**6. Heavy, unoptimised images were added for the old pages:**
- `public/images/facialfeedback/` **39 MB** (19 JPGs)
- `hairtreatmentoffers/` 8.5 MB of PNGs
- `keyoffers/` 2.1 MB PNG
- `offer-global-color.jpg`, `offer-highlights.jpg`, `offer-balayage.jpg`, `offer-crazy-colors.jpg` (about 2 MB each)

**7. The rating is wrong site-wide.** All 3 salons are set to 4.9 and `overallRating = 4.9` is hardcoded. Google shows **Sarjapur Road 4.8 and Brookfield 4.8** (HSR 4.9). The overall rating should be calculated: **4.8**.

## 1. Rules

1. **Reading budget:** never open `node_modules/`, `dist/`, `server-dist/`, media folders or `package-lock.json`. To learn the old pages' content, extract their **visible text** with a script (strip `<script>`/`<style>`). Never print whole HTML.
2. **Facts:**
   - **Offer content and prices** come from the six old pages and `novemberCampaign`/`offers.ts` (Step 2 table). Nothing else.
   - **NAP, hours and ratings** come from `branches.ts` only.
   - **Wording** comes from `style.ts` (`CTA`, brand, city).
   - Don't copy the old pages' unsupported claims ("1,000+ happy clients", "4.9" for all).
   - Never show "up to 50%" or "-40%".
3. **All 3 salons, equally, everywhere.** No page, menu or default favours a salon. "All salons" is the default. The salon order is always Sarjapur Road → HSR Layout → Brookfield.
4. **No old URL may break.** Every old slug gets a **301** to its new URL (Step 3). Google Ads may still point at the old slugs, and redirects keep the ads working.
5. Reuse the existing components (`NovemberCard`, `OfferSheet`, `SalonNap`, `SectionHeader`, `MobileStickyBar`, `Button`, the swipe rows, `BeforeAfter`, `Reels`, `FAQAccordion`, `BlogCard`). Don't duplicate them.
6. After every step: `npm run build && npm test && npm run seo:audit && npm run mobile:audit && npm run consistency:audit && npm run perf:budget && npm run seo:checklist` → 0 errors. Commit per step.

## Step 0: secure the work in progress

1. Run `git status --short`. List every change in `reports/offers-restructure/wip.txt`.
2. **Check the staged deletion of `content/blog/hair-botox-vs-keratin.md`:**
   - If a redirect for `/blog/hair-botox-vs-keratin` exists, or the post was merged into another post, keep the deletion.
   - **Otherwise restore it** (`git restore --staged --worktree content/blog/hair-botox-vs-keratin.md`) and note it for the owner. A deleted live URL loses its search ranking.
3. Commit the rest as `wip: before offers restructure`, so everything can be rolled back.

## Step 1: fix the rating (quick, site-wide)

1. In `branches.ts`, set Sarjapur Road `rating.value` to **4.8** and Brookfield to **4.8**. Keep HSR at 4.9. Keep the counts and `asOf`, and update `tests/fixtures.ts` to match.
2. Replace the hardcoded `overallRating = 4.9` with a calculation: the review-weighted mean of the 3 salons, rounded down to 1 decimal (**4.8**).
3. Add a test: `overallRating` equals the weighted mean rounded down.
4. Grep `dist` for "4.9 on Google" and "4.9 ★ · 2,550"; the result must be 0.

## Step 2: the offer catalogue, as one source of truth

Create `src/data/offerCatalog.ts`. It is data only, with no React imports, so `vite.config.ts` can read it. Each offer has these fields:

| Field | Meaning |
|---|---|
| `id` | slug-safe id |
| `category` | `'hair-colour' \| 'hair-treatment' \| 'skin-care'` |
| `title`, `hook` | name and one line |
| `lines` | `{ label, was?, now, unit?: 'per streak', from?: boolean, note? }[]` |
| `includes` | ≤ 3 items |
| `duration?`, `bestFor` | — |
| `image` | the photo-crop name from Step 5 |
| `serviceLink`, `bookingService` | must exist in `booking.services` |
| `branches` | all 3, unless the owner says otherwise |
| `validUntil?` | `'2026-11-30'` for the November campaign lines |
| `terms` | — |
| `faq` | — |

**The facts, copied from the old pages + `novemberCampaign`.** Show them exactly. A `*` means "starting from"; its terms line says "final price confirmed at consultation".

| Category | Offer | Was | Now | Unit / note |
|---|---|---|---|---|
| Hair colour | Global Hair Colour | ₹5,999 | ₹3,999 | any length |
| Hair colour | Hair Highlights | ₹499 | ₹399 | per streak; 8–10 streaks recommended |
| Hair colour | Balayage | ₹7,999 | ₹5,499 | from |
| Hair colour | Fashion (Crazy) Colour | ₹799 | ₹499 | per streak |
| Hair treatment | Hair Keratin | ₹7,999 | ₹4,999 | any length (was-price from `offers.ts`) |
| Hair treatment | Nanoplastia | — | ₹5,999 | from* |
| Hair treatment | Olaplex Bond Repair | ₹3,999 | ₹2,999 | — |
| Hair treatment | Schwarzkopf Anti-Dandruff Scalp Treatment | ₹2,999 | ₹1,999 | — |
| Skin care | Hydra Facial | ₹5,499 | ₹3,499 | 35% off, 6-step |
| Skin care | Head-to-Toe Body Polish | ₹7,999 | ₹4,999 | — |
| Skin care | Hair Spa 2+1 | — | ₹1,999 | from*; "book 2, get 1" |
| Skin care | Express Facial | — | ₹2,499 | 6-step |
| All | Tuesday Happy Hours | — | 25% off | every Tuesday, minimum bill (from `offers.ts`) |

- Keep `novemberCampaign` (dates, states, countdown) as the **hair colour campaign**, and point its offers at the catalogue's hair-colour entries.
- Percentages: always `savingPercent()` (rounds down). Lead with "Save ₹X".
- Add a `// OWNER:` TODO for each item to confirm:
  - whether **Brookfield** honours the treatment and skin offers (the old site called Brookfield's offers "salon-wide"; the default is all 3)
  - the end dates of the non-November offers (show "Limited-time offer" until one is given)

## Step 3: one URL structure, plus redirects

**New routes**, all prerendered and all in `sitemap-pages.xml`:

| URL | Page | Primary keyword |
|---|---|---|
| `/offers` | **Offers hub**: every current offer, all 3 salons | salon offers Bangalore |
| `/offers/hair-colour` | Hair colour offers (the November campaign lives here while it's open) | hair colour offer Bangalore |
| `/offers/hair-treatment` | Keratin, nanoplastia, Olaplex, anti-dandruff | keratin offer Bangalore |
| `/offers/skin-care` | Hydra facial, body polish, hair spa, express facial | facial offer Bangalore |

Memberships and gift cards stay at `/membership-gift-cards`. They are linked from the Offers menu and the hub.

**Salon choice is a filter, not a separate URL.** Each offer page has a salon picker: **All salons** (default) · Sarjapur Road · HSR Layout · Brookfield. The picker changes only:
- the Call and WhatsApp targets
- the NAP card
- the "Valid at …" line

`?salon=<id>` preselects a salon; the canonical stays the clean URL, and no separate pages are indexed. Remember the visitor's choice through the existing branch store (`useBranch`), but **always show the picker with all 3**.

**301 redirects** go in `redirects` (`src/data/services.ts`), which feeds both `dist/_redirects` and `server/app.ts`:

| Old URL | New URL |
|---|---|
| `/offers/november` | `/offers/hair-colour` |
| `/hsrhaircoloroffers` | `/offers/hair-colour?salon=hsr-layout` |
| `/hsrhairtreatmentoffers` | `/offers/hair-treatment?salon=hsr-layout` |
| `/hsrskincareoffers` | `/offers/skin-care?salon=hsr-layout` |
| `/sarjapaurahaircoloroffers` **and** `/sarjapurahaircoloroffers` | `/offers/hair-colour?salon=sarjapur-road` |
| `/sarjapurahairtreatmentoffers` | `/offers/hair-treatment?salon=sarjapur-road` |
| `/sarjapuraskincareoffers` | `/offers/skin-care?salon=sarjapur-road` |
| `/hair-color-offer.html`, `/hair-treatment-offer.html` | `/offers/hair-colour`, `/offers/hair-treatment` |

Also add these to the redirects:
- the `.html` forms of all of the above
- `/offers/november#nov-*` anchors: these keep working, because the new page uses the same ids
- the `#nov-global-colour` etc. ids, which are kept as aliases on `/offers/hair-colour`

**Then remove the old pages:**
- the 6 `public/*.html` files
- `public/offer-pages/` (the CSS and JS)
- `src/data/staticOfferPages.ts`
- `XingOffersByLocation.tsx` and its CSS
- every import of them, and the dev-server hand-off code for them

Update every internal link to the new URLs: nav, footer, home offers section, popup, salon strips, service-page offer bars, `llms.txt`, the sitemap, `seo-keyword-map.md` and the README. Use the grep:

```
grep -rnE "hsr(haircolor|hairtreatment|skincare)offers|sarjapa?u?ra(haircolor|hairtreatment|skincare)offers|offers/november|xingsalon\.com|staticOfferPages|XingOffersByLocation|offer-pages/" src content server scripts vite.config.ts index.html public tests README.md docs
```

**Google Ads tags.** The old pages loaded the Google Ads conversion IDs `AW-18405222369` and `AW-16703202075`. Don't hardcode them:
- Add `VITE_GOOGLE_ADS_IDS` (comma-separated) to `.env.example`.
- Load the IDs through the existing deferred, consent-gated tag loader (`src/lib/tags.ts`).
- Fire `conversion` events on WhatsApp/Call clicks from `/offers/*` pages, alongside the existing `generate_lead` (the conversion labels go in `VITE_GOOGLE_ADS_SEND_TO`).
- If GTM is used, document that these belong in GTM instead.

## Step 4: navigation and the logo

- **The logo always goes home.** Every logo instance (header, mobile drawer, footer) is `<a href="/" aria-label="Xing Premium Unisex Salon – Home">`. There is **no `href="#"`** anywhere on the site: add a `seo-audit` check, and replace "back to top" on the logo with the existing back-to-top button.
- **The header on mobile:** keep auto-hide on scroll-down, but:
  - it **reappears as soon as the visitor scrolls up** by 8 px or more
  - it **reappears at the top of the page**
  - it **never hides while the drawer or a bottom sheet is open**
  - it **never hides when the page is shorter than 2 screens**

  Clicking the logo works in every state. A Playwright check: scroll down 2,000 px, scroll up 50 px, tap the logo, and you land on `/`.
- **The Offers menu** (`offersMenu()` in `navMenus.ts`) is the same for every visitor:
  - Hair Colour Offers · "from ₹399", and while the campaign is open, a small "Ends 30 Nov" pill
  - Hair Treatment Offers · "from ₹1,999"
  - Skin Care Offers · "from ₹1,999"
  - Tuesday Happy Hours
  - a divider
  - Membership Offers
  - Gift Cards
  - **"View all offers"** → `/offers`

  **There's no salon note and no salon-based switch.** The "from ₹" figures are calculated as the lowest `now` per category.
- **The Offers label** links to `/offers` (the hub) all the time, not only during the campaign.
- **Mobile drawer:** the Offers sub-panel shows the same items as 56 px rows, with a small thumbnail per category.

## Step 5: offer images (light and sharp)

1. Move the source files out of the web folder and into `../xing-media-originals/offers/`. Never delete them; check the counts and bytes after the move. The files:
   - `public/images/facialfeedback/` (39 MB)
   - `hairtreatmentoffers/*.png`
   - `keyoffers/*.png`
   - `offer-global-color.jpg`, `offer-highlights.jpg`, `offer-balayage.jpg`, `offer-crazy-colors.jpg`
2. Extend `scripts/offer-images.mjs` to make **AVIF (q55) + WebP (q80)** at 480 / 800 / 1200 px wide:
   - one **4:5 photo crop** per offer (no baked-in text)
   - one **square poster** per category, where an accurate poster exists
   - names like `offer-<category>-<id>-<w>.<ext>`
3. Each image ≤ 70 KB at 480 px and ≤ 160 KB at 800 px.
4. Posters whose printed claims don't match the data are shown **only as crops**: the "up to 50%" menu poster and the "-40%"/"₹599" highlights poster.
5. **"Client feedback" screenshots** (the 19 `facialfeedback` images): choose up to **6**. Convert them to 600 px WebP/AVIF, blur any client names, faces or phone numbers that are visible (or skip that image), and show them in a swipe row on `/offers/skin-care` with alt "Client feedback after a facial at Xing". If they can't be anonymised, leave them out and add an owner TODO.
6. Remove the moved originals' old references. `perf-budget` must pass.

## Step 6: the page templates (mobile-first)

### A. `/offers` (hub)
Target on a 375 px phone: **≤ 9 screens, ≤ 550 visible words.** Sections in order:

1. **Hero:**
   - breadcrumb (Home › Offers)
   - H1 **"Salon Offers in Bangalore"**
   - one line: "Save up to ₹3,000 · Sarjapur Road, HSR Layout & Brookfield". The figure is calculated as the largest rupee saving across the catalogue.
   - trust line (`ratingLabel()`)
   - **salon picker chips** (All · Sarjapur Road · HSR Layout · Brookfield), scrolling sideways with no wrapping
   - primary **Claim on WhatsApp** and secondary **Book Appointment**
   - **No poster in the hero.** It goes straight to the categories below, which keeps the first screen light and fast.
2. **Category cards:** 3 large tappable cards stacked vertically (Hair Colour · Hair Treatment · Skin Care). Each card has:
   - a 4:5 photo crop
   - the category name
   - "From ₹X · Save up to ₹Y"
   - 3 offer names as small chips
   - for Hair Colour while the campaign is open, a state pill ("Ends 30 Nov · N days left")

   The whole card links to the category page.
3. **Featured offer:** the single biggest-saving offer as one full `NovemberCard`-style card, with Claim.
4. **Tuesday Happy Hours** strip (it says "Today" on Tuesdays) + **Membership & Gift Cards** strip, both compact.
5. **How claiming works:** 3 icon steps.
6. **Claim at your salon:** the 3 `SalonNap` rows in order.
7. **FAQ:** 6 questions, with matching `FAQPage`.
8. **Final CTA.**

### B. `/offers/hair-colour`, `/offers/hair-treatment`, `/offers/skin-care`: one shared template
Target: **≤ 12 screens, ≤ 750 visible words.** Build one `OfferCategoryPage` component fed by the catalogue:

1. **Hero:**
   - breadcrumb (Home › Offers › Hair Colour)
   - H1 "Hair Colour Offers in Bangalore" (Hair Treatment / Skin Care alike)
   - the **lead offer**: hair colour shows the whole accurate Global poster; the others show a photo crop
   - the price row ~~was~~ **now** + "Save ₹X"
   - the state pill
   - the salon picker chips
   - primary Claim + secondary Book Appointment
   - Everything fits in **one screen at 375 × 812**.
2. **Sticky offer tabs** (a segmented control directly under the header, which moves up when the header hides):
   - one tab per offer, with **short labels that never wrap**: Hair Colour = Global · Highlights · Balayage · Fashion; Hair Treatment = Keratin · Nanoplastia · Olaplex · Scalp; Skin Care = Hydra · Body Polish · Hair Spa · Express
   - it scrolls sideways if needed, with snap and a fade at the edge
   - **`white-space: nowrap`**, 44 px tall
   - the active tab follows scrolling (IntersectionObserver)
3. **Offer cards** (stacked vertically). Each card has:
   - an image (crop or poster, tap to zoom)
   - title
   - ~~was~~ **now** + unit
   - a saving pill
   - **3** icon bullets
   - "Valid at <salon or all 3 salons>"
   - **Claim Offer** (primary) + **View Details** (sheet with the long text, terms and service link)
   - "Book Appointment" as a text link
   - The highlights streak chips (6 / 8 / 10 → total) stay.
4. **Price table:** a real `<table>` with a caption (Service · Was · Now · Save).
5. **Results:** one before/after + one swipe row (category-specific media from `media.ts`; skin care uses the anonymised feedback row).
6. **Trust:** a 2×2 icon grid + the "Why these offers are genuine" accordion.
7. **Reviews:** a swipe row, category-relevant.
8. **Claim at your salon:** the 3 `SalonNap` rows, with each salon's own hours and open-now chip, plus Call · WhatsApp · Directions.
9. **FAQ:** 6–8 questions per category, answer-first, with `FAQPage`.
10. **Guides:** 3 related posts, as a swipe row.
11. **Cross-sell:** "More offers" links to the other 2 categories + Tuesday.
12. **Final CTA**, and a **sticky bottom bar** reading "Claim · from ₹X" plus a Call icon, **on one line at 320 px** (shorten it to "Claim · ₹399" below 360 px; no day count in the bar, because the pill in the hero has it).

**The November campaign** on `/offers/hair-colour`:
- **Upcoming/live:** the campaign pill, countdown and "Valid till 30 Nov".
- **Ended:** the page stays, with the same offers marked "Limited-time offer", unless the owner sets new prices. The `/offers/november` redirect keeps working.

### C. Schema per offer page
- `WebPage` + `BreadcrumbList`.
- An `OfferCatalog` whose items are `Offer` with `price`, `priceCurrency: "INR"`, `priceSpecification` (`UnitPriceSpecification` with a streak `referenceQuantity` where relevant), `availability`, `validFrom`/`priceValidUntil` (only for dated offers), and `url#id`.
- `itemOffered` = the `Service` `@id`.
- `offeredBy` = the 3 salon `@id`s.
- `FAQPage` matching the visible FAQ.
- No `AggregateRating`.

### D. Visual design rules for offers
- **Layout:** 16 px gutters; cards are `rounded-3xl`, 1 px border berry/10, `shadow-soft`.
- **Colour:** saving pills mint, state pills neutral, tags berry.
- **Type:** prices in `font-display` 30–36 px with tabular figures; the was-price is grey and struck through at 16 px. Headings ≤ 6 words, and `text-wrap: balance` on all headings.
- **Images:** a skeleton shimmer until loaded; width/height always set.
- **Motion:** ≤ 200 ms fades only; `prefers-reduced-motion` respected; tap feedback `active:scale-[0.98]`.
- **Uppercase:** none for buttons or headings (eyebrows only, via CSS letter-spacing).

## Step 7: the whole site, perfect on mobile

Run `npm run mobile:audit` at **320, 360, 375, 390, 412 and 430 px** (add 320 and 430 to the script) plus 768 px, on every sitemap URL + the 4 offer pages, with `?today=2026-11-10`. Fix every ERROR in shared components. Then apply this checklist to every page type:

**Layout and breakpoints**
- No sideways scroll at any width. Any element wider than the viewport is an ERROR unless it sits inside an intended swipe row (`overflow-x: auto` + `scroll-snap`).
- Use `min-w-0` on flex and grid children that hold text. Long words and prices never overflow (`overflow-wrap: anywhere` on card text).
- Chips, segmented controls, tab bars and the sticky bar **never wrap**: they scroll sideways or use shorter labels.
- Use `100dvh`, not `100vh`, for full-height elements. Apply safe-area insets (`env(safe-area-inset-*)`) to the header, sticky bar, drawer and sheets.
- Sticky and fixed layers stack in this order, with no overlap: header (z-40) → sticky offer tabs (z-30, `top` = header height, moving to 0 when the header hides) → sticky bottom bar (z-30) → popup and sheets (z-50).
- The back-to-top button sits above the sticky bar, never on top of it.
- Breakpoints use Tailwind's `sm`/`md`/`lg` only, and every component is checked at each one.

**Text**
- Body ≥ 15 px, captions and legal ≥ 12 px, line-height 1.5–1.6, 16 px gutters.
- No paragraph over 3 lines visible on mobile; the rest goes behind "Read more".
- Fix the **all-caps H2s** ("WHAT OUR CLIENTS SAY", "FREQUENTLY ASKED QUESTIONS", "ABOUT XING PREMIUM UNISEX SALON") to Title Case.
- Shorten the About H1 to "About Xing Premium Unisex Salon, Bangalore".
- Fix the cut-off trust row under the home hero ("Hygien…"): it becomes a swipe row with a fade at the edge, or a 2×2 grid.

**Interaction**
- Every tap target is ≥ 44 × 44 px with ≥ 8 px between targets.
- No hover-only information.
- `-webkit-tap-highlight-color: transparent`, with a visible focus ring for the keyboard.
- Inputs are ≥ 16 px font (no iOS zoom), with the right `inputmode`/`autocomplete`/`enterkeyhint`.
- Bottom sheets: drag-to-close, Back closes them (`useHistoryClose`), and the body scroll is locked without jumping.
- Smooth anchor scrolling with `scroll-margin-top` = header + sticky tabs.

**Speed (mobile)**
- Within `perf:budget` on every route.
- The LCP image is preloaded, ≤ 60 KB, and `fetchpriority="high"`.
- Fonts ≤ 3 files.
- No Google Fonts (the old pages used them; they're gone with the old pages).
- No render-blocking third-party scripts. Videos are poster-only until in view.
- Prefetch the next likely page on `touchstart`/hover for nav and offer links (`<link rel="prefetch">` of the route's HTML + chunk).
- No `unload` handlers (they break the back-forward cache). Check the back-forward cache works on offer pages (Chrome DevTools "Back/forward cache" test via Playwright `page.goBack()` timing).
- Lighthouse mobile (simulated) on `/`, `/offers`, the 3 offer category pages, a salon page, a service page and a blog post: **Performance ≥ 90, LCP ≤ 2.5 s, CLS ≤ 0.05, TBT ≤ 150 ms, Accessibility ≥ 95, SEO 100.**

**Home page trim (36 screens, 2,591 words, 89 images today)**
- **Target:** ≤ 22 screens, ≤ 1,600 visible words, ≤ 40 `<img>` in the HTML.
- **Hair colour:** merge the 3 sections ("Hair Colour in Bangalore, Done Right…", "Choose Your Hair Colour with Confidence" and the colour cards in Offers) into **one** section that links to `/services/global-hair-color` and `/offers/hair-colour`.
- **Offers section:** 3 category cards (the same component as the hub), not 4 full offer cards with a duplicate "Global Hair Colour" heading.
- **Inside Xing:** a single swipe row with salon tabs, not 3 stacked sections.
- **Galleries:** first 6 items + "View more".

## Step 8: checks, three passes (all must pass)

**Pass 1, automated:**
- `npm run build && npm test` + all 5 audits → 0 errors, at `?today=2026-11-01`, `2026-11-10` and `2026-12-01`.
- New tests in `tests/offers-structure.test.ts`:
  - The 4 offer routes exist, are prerendered and are in the sitemap.
  - Every old slug in the Step 3 table returns a 301 to the right URL (Express + `_redirects`).
  - No `href="#"`; no link to `xingsalon.com`; no link to an old slug.
  - `offersMenu()` is identical for every `getBranch()` value and contains no salon names.
  - Every offer page lists all 3 salons in order.
  - Every price shown matches `offerCatalog.ts`.
  - `overallRating === 4.8`.
  - No `public/*.html` files other than what the build writes.

**Pass 2, interactions** (Playwright, 360 px and 390 px):
- **Logo:** from each offer page, at the top and after scrolling down and then up, tapping the logo lands on `/`.
- **Offers menu:** Offers in the drawer → each item opens the right page. "View all offers" → `/offers`.
- **Salon picker:** choosing each salon changes the Call/WhatsApp targets and the NAP card. The WhatsApp text contains the offer name, price and salon.
- **Sticky tabs:** they scroll to each card and highlight it in view, with no wrapping.
- **Sheets:** Details opens and closes (Back and swipe).
- **Sticky bar:** never covers the last CTA or the footer.
- **Old URLs:** `/hsrhaircoloroffers` and `/offers/november#nov-highlights` land on the right page and card.

**Pass 3, visual read-through:**
- Take full-page 390 px screenshots of `/offers`, the 3 category pages, `/`, a salon page and a service page. Save them to `reports/offers-restructure/<date>/`, which is ignored by git.
- Read every line and fix:
  - wrapped chips and buttons
  - cut-off text
  - inconsistent names, prices or ratings
  - all-caps buttons
  - images without crops
  - misaligned cards
  - double spacing
- Re-run Pass 1.

## Step 9: finish

1. **README.md:** add an "Offers section" part covering:
   - the route table
   - `offerCatalog.ts` fields
   - how to add or end an offer
   - how the campaign states work
   - the salon picker
   - the redirect table
   - Google Ads env vars
   - the image script

   Then update the Pages table and add a dated **Change log** line.
2. Reply with ONLY:
   - files added, changed and removed (one line each)
   - before → after for `/offers`, the 3 category pages and `/` (screens, visible words, images, HTML gzip KB)
   - the Lighthouse table
   - owner TODOs:
     - Brookfield validity for treatment and skin offers
     - end dates of the non-November offers
     - the `*` "from" terms
     - the client-feedback images
     - updating Google Ads final URLs to the new `/offers/...` addresses (the redirects cover it meanwhile)
     - `VITE_GOOGLE_ADS_IDS`/`SEND_TO`
