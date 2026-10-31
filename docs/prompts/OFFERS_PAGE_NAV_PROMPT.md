# Prompt: make the November Offers page the Offers section of the site (nav, all 3 salons, finish + verify)

> Paste everything below the line into your coding agent from the project root (`xing salon 1`).
> Run it while **no other agent or editor is changing the project**: the dev server is currently logging HMR "Failed to reload" errors from simultaneous edits.

---

## Context: read this first, don't rebuild

A complete standalone offers page **already exists** at **`/offers/november`**:
- `src/pages/NovemberOffersPage.tsx`, copy in `src/data/novemberOffersPage.ts`, parts in `src/components/offers/NovemberBits.tsx` + `NovemberHero.tsx`
- data in `novemberCampaign` in `src/data/offers.ts`, route `isNovemberOffers` in `src/lib/route.ts`, meta `novemberOffersMeta` in `src/data/seo.ts`, chunk + `SHELLS` in `vite.config.ts`, posters `public/images/offer-nov-*-480/800.webp`
- 15 sections, 1 H1, no broken images, no sideways scroll at 390 px.

**Visitors can't find it, for two reasons:**
1. The nav's **Offers** item links to `/#offers` (the home page section). `navHref()` in `src/components/Header.tsx` falls through to `homeHref('#offers')`, and the mobile drawer uses the same `navHref`.
2. Every embed (`NovemberBanner` on `/offers`, `NovemberStrip` on the salon pages, the home card in `OffersShowcase`, the popup, `NovBadge`) shows only while `isCampaignLive()`. That's false until 1 Nov, so on 31 Oct the page has **no links pointing to it**.

**Your job:** make this page *the* Offers section, reachable from the nav and from all 3 salons; finish the gaps listed below; and prove it works. **Do NOT create a second offers page, duplicate components or rewrite working files.** Edit in place, and reuse `novemberCampaign`, `NovemberCard`, `NovemberStrip`, `NovemberBanner` and `NovBadge`.

## Rules (follow every one)

- Reading budget: only the files named here, at the line ranges you need (`grep -n`, `sed -n a,bp`). Never open `node_modules/`, `dist/`, `server-dist/`, media folders or `package-lock.json`.
- Facts only from `novemberCampaign` / the posters in `offers for november/`. No new prices, dates, reviews or ratings. **Never show "up to 50%" or "-40%"**: savings come from `savingPercent()` (rounds down) and are led by the rupee figure ("Save up to ₹2,500").
- No fake urgency. A day countdown is allowed only because 30 Nov is real. No seconds ticking, no "only N slots left", no viewer counts.
- Salon order everywhere: **Sarjapur Road → HSR Layout → Brookfield** (use `SALON_ORDER`/`locations` if `SALON_ORDER_NAV_FAQ_PROMPT.md` has already run; otherwise order explicitly by those ids).
- After every step: `npm run build` must pass. Commit per step: `git add -A && git commit -m "offers: <step>"`.

## Step 1: campaign states (so links work from today)

In `src/data/offers.ts`, use the existing `campaignState()` / `isCampaignOpen()` (check what they return; add them if missing):
- `upcoming` (before 1 Nov 00:00 IST), `live` (1–30 Nov, until 23:59:59 IST), `ended` (from 1 Dec).
- `isCampaignOpen()` = upcoming **or** live.

Switch **every embed and nav entry** from `isCampaignLive()` to `isCampaignOpen()`. In the `upcoming` state, show "Starts 1 Nov · valid till 30 Nov" and keep Claim enabled with the wording "Reserve your November slot" (the WhatsApp text says "I'd like to book for November"). In `live`, show "Valid till 30 Nov · N days left". In `ended`, hide the embeds and keep the page with its ended state. `campaignNow()` already supports `?today=YYYY-MM-DD` for testing; keep it.

## Step 2: nav: "Offers" opens the offers section

`src/data/content.ts` (`nav`), `src/components/Header.tsx`, `src/components/nav/MobileMenu.tsx`:

1. **Desktop:** turn **Offers** into a dropdown. Copy the existing `SalonsMenu` pattern (hover + click + keyboard, `aria-expanded`, Esc closes, focus returns to the trigger). Clicking the label itself goes to **`/offers/november`** while `isCampaignOpen()`, otherwise to `/offers`. Dropdown items:
   - ★ **November Hair Colour Offers**, with a small line "Save up to ₹2,500 · till 30 Nov" + `NovBadge` → `/offers/november`
   - Global Hair Colour · ₹3,999 any length → `/offers/november#nov-global-colour`
   - Highlights · ₹399 per streak → `/offers/november#nov-highlights`
   - Balayage & Crazy Colour → `/offers/november#nov-colour-menu`
   - divider, then **All salon offers** (Hydra Facial, Keratin, Tuesday 25%) → `/offers`
   - Build the item labels and prices from `novemberCampaign.offers` + `formatPrice`, never typed in by hand. When the campaign is `ended`, the dropdown shows only the `salonOffers` items + "All offers".
2. **Mobile drawer:** Offers opens a sub-panel with the same items. Reuse the drawer's Services sub-panel (`onEnter`/`onBack`), with a full-width "View November offers" button at the bottom and 44 px tap targets.
3. **Active state:** Offers is highlighted on `/offers` and `/offers/november` (this already exists at `Header.tsx` ~line 134; keep it).
4. **Fix `navHref`** so no nav item points to `/#offers` any more. Search for other `#offers` links (`grep -rn "#offers\|OFFERS_SECTION" src`). Footer, home CTA, membership banner and 404 links go to `/offers/november` while open, otherwise `/offers`. Leave the home page section's own `id="offers"` anchor alone.
5. If the Gifts dropdown from `SALON_ORDER_NAV_FAQ_PROMPT.md` already exists, don't touch it. Just make sure both dropdowns fit at 1024 px without wrapping.

## Step 3: all three salons

1. **Salon pages** (`src/pages/BranchPage.tsx`): `NovemberStrip` appears in the Offers section of `/salons/sarjapur-road`, `/salons/hsr-layout` and `/salons/brookfield` (now gated by `isCampaignOpen()`). On each salon page: the 3 compact cards, **Claim prefilled with that salon** (no picker), and a link "See full November offer details →" `/offers/november?salon=<id>#offers`.
2. **On the offers page itself, a salon selector:** directly under the hero, add a segmented control "Your salon: Sarjapur Road · HSR Layout · Brookfield" (in that order). It reads `?salon=` or the stored branch (`useBranch`/`useChosenSalon` in `src/lib/branch.ts` / `src/lib/offers.ts`) and stores the choice the same way the rest of the site does. Once a salon is chosen, every Claim button on the page (cards, sticky bar, final CTA) goes straight to that salon's WhatsApp with the offer, price and salon name in the message. The "Claim at your nearest salon" section lists the 3 salons in order with address, open-now chip, Call and Directions. **No separate per-salon offer URLs**: they'd be thin duplicate pages. `?salon=` must not change the canonical URL.
3. **Salon FAQs** (`src/data/branchPages/sarjapur-road.ts`, `hsr-layout.ts`, `brookfield.ts`): the "Which offers are running…" answer mentions the November colour prices (global ₹3,999 any length, highlights ₹399/streak, balayage from ₹5,499, crazy colour ₹499/streak, till 30 Nov) and contains **no "50%"**. Keep each answer ≤ 60 words; the same text goes into the schema.
4. **Schema:** each salon page's JSON-LD includes the 3 November `Offer`s while open, with `seller`/`offeredBy` = that salon's `@id`.

## Step 4: finish and polish the page (fix only what fails)

Open `/offers/november` at 390 px and 1280 px and check each item. Fix only the failures:

- **Hero (desktop):** a two-column layout with the global colour poster (`offer-nov-global-colour-800.webp`, `fetchpriority="high"`, no lazy) on the right. On mobile the poster comes after the price block, so price + saving + Claim stay on the first screen.
- **Offer cards:** poster, ~~was~~ **now**, pill "Save ₹X · Y% off", unit (per streak / from), 3 inclusions, duration, "Valid at all 3 salons", Claim, Book, and "Details & terms" sheet. Highlights shows the total "8–10 streaks ≈ ₹3,192–₹3,990", calculated not typed. `HIGHLIGHTS_WAS` must be the owner-confirmed value: if a `// TODO owner` is still there, keep the lower ₹499 and list it in your report.
- **Big empty gap before the poster images** (seen at ~3,600 px on mobile): reveal animations leave a blank block while scrolling. Make `Reveal` start visible for content taller than the viewport (or use `amount: 0.1`), and give images fixed `aspect-ratio` boxes so nothing jumps.
- **Price table:** all 4 lines with Was / Now / You save ₹ / %.
- **Real results section:** only client media from `media.ts` / `work-*` photos. The poster models are never captioned as clients.
- **"Why are these offers genuine?"**: present and clear (seasonal campaign, same stylists and products, what's not included, one offer per service, not with Tuesday 25%, price locked at consultation).
- **FAQ (10):** answer-first, 40–60 words each, identical in the page and the `FAQPage` schema.
- **Blog:** 4 related posts that exist (`novemberPosts` in the virtual blog module) + "View all articles".
- **Sticky mobile bar:** "Claim November offer · <state text>" + Call + Directions; it must not cover the final CTA or the footer.
- **Accessibility:** one H1, H2/H3 in order, every image has alt text, the dropdown and selector work by keyboard, colour contrast ≥ 4.5:1 on the price pills.

## Step 5: SEO for the page

- `novemberOffersMeta`: title ≤ 60 chars, description ≤ 155, self-canonical `https://www.xingsalons.com/offers/november`, `og:image` = `/og/og-offers-november.jpg` (it must exist, be 1200×630 and show no prices; create it from the global colour poster's photo side if missing). JSON-LD: `BreadcrumbList` (Home › Offers › November Offers), `OfferCatalog` with each `Offer` (price, INR, `validFrom` 2026-11-01, `priceValidUntil` 2026-11-30, `availability` by state: PreOrder → InStock → Discontinued), and `FAQPage`. No `AggregateRating`.
- `/offers/november` appears in `dist/sitemap.xml` (`grep -c "offers/november" dist/sitemap.xml` ≥ 1).
- Internal links into the page: nav, footer, `/offers` banner, 3 salon pages, home card, and the "offer" slot on `/services/global-hair-color`, `/services/highlights`, `/services/balayage` and `/services/fashion-color` (while open).

## Step 6: tests (add to `tests/november.test.ts`, or create it)

- `campaignState` returns `upcoming` at 2026-10-31 23:59 IST, `live` at 2026-11-01 00:00 and 2026-11-30 23:59, and `ended` at 2026-12-01 00:00.
- No "50%" or "40%" in `novemberCampaign`, `novemberOffersPage`, the branch FAQs or `novemberOffersMeta`.
- The nav model gives Offers → `/offers/november` while open and `/offers` when ended; no nav href equals `/#offers`.
- The claim WhatsApp text for each salon includes the salon name, the offer title and the price, URL-encoded (follow `whatsapp.test.ts`).
- Every displayed % equals `savingPercent()` of its line; `maxSavingRupees() === 2500`.

## Step 7: verify in the browser (all must pass before you report)

`npm run build && npm test`, then `npm run dev` and check:
1. On `/` at 1280 px: hover/click **Offers** → the dropdown shows the November items first → clicking the label opens `/offers/november`. At 390 px: open the drawer → Offers → sub-panel → each item lands on the right card (anchor scroll is correct under the sticky header).
2. `/offers/november?today=2026-10-31` shows "Starts 1 Nov". `?today=2026-11-15` shows "N days left" (16). `?today=2026-12-01` shows the ended state, the embeds are gone and the schema says Discontinued.
3. `/salons/sarjapur-road`, `/salons/hsr-layout`, `/salons/brookfield`: the November strip is visible, and Claim opens WhatsApp for **that** salon with the right price.
4. `/offers/november?salon=hsr-layout`: the selector is pre-set to HSR, and every Claim on the page targets HSR.
5. `/offers` shows the November banner at the top. No console errors (ignore HMR messages only while files are still changing). No horizontal overflow at 360/390/768/1024/1280. All images load.
6. **README.md**: in the offers section, say that the nav's Offers item opens `/offers/november` while the campaign is upcoming or live and `/offers` afterwards; describe the 3 campaign states, the `?salon=` selector, and how to start next month's campaign (edit `novemberCampaign` dates/offers, convert the posters, rename the path if wanted, and add a 301 from the old path). Add a dated **Change log** line.
7. Reply with ONLY: the files changed (one line each), anything still marked `TODO owner` (especially the highlights regular price), and anything you couldn't verify.
