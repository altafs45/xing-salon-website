# Final prompt: native offer pages + WhatsApp booking + production-ready launch

> Paste everything below the line into your coding agent from the project root (`xing salon 1`).
> **This is the last big prompt.** It replaces `SEO_INDEXING_V2_PROMPT.md` and `OFFERS_RESTRUCTURE_MOBILE_PROMPT.md`. Stop the dev server and any other agent first.

---

**Context.**
- **Stack:** Vite + React 18 + TypeScript + Tailwind multi-page site for Xing Premium Unisex Salon (3 Bangalore salons; order Sarjapur Road → HSR Layout → Brookfield). Pages are prerendered.
- **Audits:** `seo:audit`, `mobile:audit`, `consistency:audit`, `perf:budget`, `seo:checklist`, `load:check`.
- **Facts:** `src/data/branches.ts` (GBP, `tests/gbp.test.ts`), `style.ts` (wording).
- **The owner will replace the old website on xingsalons.com with this one.** So:
  - Nothing may depend on, embed, copy or link to the old site.
  - The 9 copied HTML pages in `public/` are removed, and the offers are **rebuilt natively in React**.
  - Old URLs get same-domain 301s only, so visitors and ads that land on an old address reach the new page. This is not serving the old site.

**Rules:**
- Don't open `node_modules/`, `dist/`, media folders or `package-lock.json`.
- Facts and prices come **only from the table in Part A**.
- Edit in place and reuse the existing components.
- After each step, run `npm run build && npm test` and all the audits → 0 errors. Commit per step.

# Part A: rebuild the 3 offer pages natively

## A1. What the offer images and old pages say (read on 4 Nov; this is the only source)

| Page | Offer | Was | Now | Details on the poster | Poster file |
|---|---|---|---|---|---|
| **Hair Colour** `/offers/hair-colour` | Global Hair Colour | ₹5,999 | **₹3,999** | flat, any length; "Save ₹2,000" | `offer-global-color.jpg`; also `offers for november/Global Hair Color Offer.png` (valid 30 Nov) |
| | Hair Highlights | ₹499 | **₹399** per streak | 8–10 streaks recommended | `offer-highlights.jpg` |
| | Fashion (Crazy) Colour | ₹799 | **₹499** per streak | "Be bold, be you" | `offer-crazy-colors.jpg` |
| | Premium Balayage | ₹7,999 | **from ₹5,499** | premium quality, hand-painted | `offer-balayage.jpg` |
| **Hair Care & Treatment** `/offers/hair-treatment` | Hair Keratin | ₹7,999 | **₹4,999** | flat, any length; smoother hair, frizz control, long-lasting | `hairtreatmentoffers/…keratin…png` |
| | Hair Nanoplastia | — | **from ₹5,999\*** | sleeker, smoother, stronger; frizz control, natural shine | `…nanoplastia…png` |
| | Olaplex Bond Repair | ₹3,999 | **₹2,999** | repairs damaged bonds, restores strength, improves elasticity, smoother and shinier hair | `…olaplex…png` |
| | Schwarzkopf Professional Anti-Dandruff Scalp Treatment | ₹2,999 | **₹1,999** | cleanse, soothe, revive; removes dandruff, balances scalp oil | `…anti-dandruff…png` |
| | Haircut & Styling package (**new**) | — | **₹1,099** flat | hair wash + haircut + conditioning + styling, any length | `keyoffers/xingsalonhaircutoffer.png` |
| **Skin & Self-Care** `/offers/skin-care` | Hydra Facial | ₹5,499 | **₹3,499** | "flat 35% off", 6-step: deep cleansing & detox, intense hydration, glowing skin | `skincareoffers/…hydra-facial…png` |
| | Head-to-Toe Body Polish | ₹7,999 | **₹4,999** | deep exfoliation, removes tan and dullness, softer skin, relaxing | `…body-polish…png` |
| | Hair Spa 2+1 | — | **from ₹1,999\*** | book 2, get 1; deeply nourishes, strengthens, adds shine | `…hair-spa-two-plus-one…png` |
| | Express Facial ("monthly facials") | — | **₹2,499** | complete 6-step process: deep cleansing, hydration, radiant skin | `…express-facial…png` |
| All pages | Tuesday Happy Hours | — | 25% off | every Tuesday, minimum bill (from `offers.ts`) | — |

`*` means "starting from"; add the terms line "Final price confirmed at consultation."

**Problems in the images. Handle them exactly like this:**
1. **Expired dates:** most posters print "Valid until **September** 30th/15th/31st" (and "31st September" doesn't exist). **Never show these dates.** Use photo crops (A3), and show validity as HTML only:
   - **Hair colour:** "Valid till 30 Nov 2026" (from `novemberCampaign`).
   - **Everything else:** "Limited-time offer", until the owner gives end dates (`// OWNER:`).
2. **Overstated %:**
   - The crazy-colour poster says "Flat 40% off": ₹799 → ₹499 is **37%**.
   - The highlights poster says "-40%" with ₹599: the data is ₹499 → ₹399, **20%**.
   - The menu poster says "up to 50%".

   Show only `savingPercent()` values, rounded down, and lead with "Save ₹X". Never show those posters whole.
3. **Nanoplastia conflict:** the summary poster says ₹5,499 and the single poster and old page say ₹5,999. Use **₹5,999** (the higher one, so it's never undercut at the till) and add `// OWNER: confirm`.
4. **`haircare.jpg`** ("How to take care of my hair?") is the hero for the aftercare guide (A5), not an offer.

## A2. Data and routes

1. Create **`src/data/offerCatalog.ts`** (data only):
   - per offer: `id`, `category` (`hair-colour` | `hair-treatment` | `skin-care`), `title`, `hook` (≤ 8 words), `lines` (`{ label, was?, now, unit?, from? }`), `benefits` (3, ≤ 4 words each, from the poster icons), `duration?`, `bestFor`, `image` (crop name), `serviceLink`, `bookingService`, `branches` (all 3), `validUntil?`, `terms`, `faq`
   - per page: `title`, `h1`, `seo`, `heroOfferId`, `faq`
   - `novemberCampaign` keeps its states and points to the hair-colour entries
2. **Routes** (React, prerendered, in `sitemap-pages.xml`):

   | Route | Page |
   |---|---|
   | `/offers` | hub |
   | `/offers/hair-colour` | Hair Colour |
   | `/offers/hair-treatment` | Hair Care & Treatment |
   | `/offers/skin-care` | Skin & Self-Care |

   **Delete:** `public/offers.html`, the 6 `public/*offers.html` files, `public/haircolorcare.html`, `public/hairtreatmentacare.html`, `public/offer-pages/`, `src/data/staticOfferPages.ts`, `XingOffersByLocation*`, the dev-server hand-off for static pages, and every link or reference to `xingsalon.com`/`.in`.
3. **Same-domain 301s** go in `redirects` (`services.ts`):

   | Old path | New path |
   |---|---|
   | `/hsrhaircoloroffers`, `/sarjapaurahaircoloroffers`, `/sarjapurahaircoloroffers`, `/offers/november`, `/hair-color-offer.html` | `/offers/hair-colour` |
   | `/hsrhairtreatmentoffers`, `/sarjapurahairtreatmentoffers`, `/hair-treatment-offer.html` | `/offers/hair-treatment` |
   | `/hsrskincareoffers`, `/sarjapuraskincareoffers` | `/offers/skin-care` |
   | `/haircolorcare` | the colour-aftercare guide (A5) |
   | `/hairtreatmentacare` | the treatment-aftercare guide (A5) |

   - Add the `.html` forms of all of these too.
   - Before deleting `public/offers.html`, extract **every internal link path** it contains. The old site's other URLs get a 301 to their closest new page (or `/`), listed in `reports/launch/old-urls.md`.
   - No redirect chains.
4. **Nav:** the Offers label opens the dropdown only (no navigation). Its items:
   - Hair Colour Offers (from ₹399)
   - Hair Care & Treatment Offers (from ₹1,099)
   - Skin & Self-Care Offers (from ₹1,999)
   - a divider, then Membership Offers and Gift Cards

   The "from" values are calculated. The home offers section, salon pages, service-page offer bars, popup, footer and `llms.txt` use the new URLs, with the same 3 category cards.

## A3. Images (from the posters, light, no expired text)

Write `scripts/offer-images.mjs` (extend it if it exists), with `sharp`.
- **Back up first:** move the source files to `../xing-media-originals/offers/`.
- **Per poster, make a photo crop:** the model or treatment half of the poster, 4:5, no baked-in prices or dates. Check each crop visually and adjust the box so faces and hair are fully in.
- **Output:** AVIF q55 + WebP q80 at 480 and 800 px. Each file ≤ 70 KB at 480 and ≤ 150 KB at 800.
- **Whole posters:** only the accurate November Global poster, and only in a tap-to-zoom viewer at 1200 px.
- **Not on offer pages:** `xinghaircolor/` and `xinghairtreatment/` (client result photos) feed the **Results** swipe rows. Convert at most 12 of each to 600 px AVIF/WebP. `facialfeedback/` (chat screenshots) is used only if names, faces and numbers can be blurred (at most 6); otherwise skip it and add an owner TODO. `interiors/` is used only on salon pages.
- Delete the heavy originals from `public/` after the move. Target: `public/images` ≤ 45 MB and no image over 300 KB in an initial load.

## A4. One template for the 3 category pages (mobile-first, built to convert)

`OfferCategoryPage.tsx`. Target at 393 × 852: **≤ 10 screens, ≤ 600 visible words, ≤ 50 words per screen.**

1. **Hero:**
   - breadcrumb (Home › Offers › …)
   - **H1** (`Hair Colour Offers in Bangalore` / `Hair Care & Treatment Offers in Bangalore` / `Skin & Self-Care Offers in Bangalore`)
   - the lead offer's photo crop, ~~was~~ **now**, a "Save ₹X" pill, and validity
   - the salon picker chips: All · Sarjapur Road · HSR Layout · Brookfield (they switch the WhatsApp/Call targets and the NAP card)
   - **Claim on WhatsApp** (primary) and Book Appointment

   All of it fits in one screen.
2. **Sticky tabs** for this page's offers (they never wrap, scroll sideways, and highlight the card in view) + a 3-page switcher (Hair Colour · Hair Care · Skin Care).
3. **Offer cards**, stacked vertically:
   - photo crop
   - title
   - hook
   - ~~was~~ **now** + unit
   - saving pill
   - 3 benefit icons
   - validity
   - **Claim Offer** (WhatsApp prefilled: offer, price, salon)
   - **View Details** (bottom sheet with what's included, who it suits, duration, aftercare, terms and the service link)

   The highlights card keeps the 6 / 8 / 10 streak calculator, and the haircut card lists its 4 included steps.
4. **Price table** (a real `<table>` with a caption).
5. **Results:** 1 before/after + a swipe row from that category's client photos and reels.
6. **Trust:** a 2×2 grid (free consultation · price fixed before we start · premium products (Schwarzkopf, Olaplex where relevant) · pay at the salon), plus a "Why these offers are genuine" accordion.
7. **Reviews:** a swipe row, using `ratingLabel()` / the ratings helper only.
8. **Claim at your salon:** 3 `SalonNap` rows with that salon's own hours, open-now, Call · WhatsApp · Directions.
9. **FAQ:** 6 questions per page, with `FAQPage`.
10. **Related guides** (3).
11. **"More offers"** links to the other 2 pages + Tuesday.
12. **Sticky bottom bar** on one line at 320 px: "Claim · from ₹X" + Call.

**`/offers` (hub):**
- H1 "Salon Offers in Bangalore", salon chips and Claim
- the **3 category cards** (photo, "From ₹X · Save up to ₹Y", offer chips)
- the featured biggest saving
- Tuesday + Membership & Gift Cards strips
- 3 steps, the 3 salon rows, FAQ and a CTA

Limits: ≤ 8 screens.

**Copy:** `style.ts` terms; Indian English; headings ≤ 6 words; cards ≤ 15 words; no hype; no "1,000+ happy clients".

**Schema:** `WebPage`, `BreadcrumbList`, an `OfferCatalog` of `Offer` (`price`, `priceCurrency` INR, `UnitPriceSpecification` per streak, `priceValidUntil` only for hair colour, `offeredBy` = 3 salon `@id`s, `itemOffered` = `Service`), and `FAQPage`.

## A5. Aftercare guides (native)

Rebuild `haircolorcare` and `hairtreatmentacare` as **blog posts**: `content/blog/hair-colour-aftercare.md` and `hair-treatment-aftercare.md`, using the existing template.
- The text comes from the old pages' visible copy, rewritten to `style.ts`.
- If more than 40% overlaps `make-hair-colour-last` / `keratin-aftercare-tips`, merge the unique parts into those posts instead, and point the 301 there.
- Hero: `haircare.jpg` (AVIF/WebP crop).

# Part B: booking goes to WhatsApp (no backend for now)

1. **Every "Book Appointment"** (header, hero, cards, sticky bar, salon pages, offer pages, service pages) opens the existing **BookingModal**. Its last step is **"Confirm on WhatsApp"**, which opens `wa.me/<that salon's WhatsApp number>` with the prefilled summary (service, salon, date, time, name). Brookfield uses its WhatsApp number (81471 11344), not the call number.
   - **The salon step is required.** It's preselected on a salon page, from `?salon=`, or from the visitor's last choice.
   - **No network request is made.** Remove or disable any `fetch` in the booking flow.
2. **Gift & membership form:** while `VITE_LEADS_API_URL` is unset, skip the API and open the chosen salon's WhatsApp with the request written out (the existing fallback). Keep `server/` for later, but it isn't needed to deploy. Note this in the README.
3. **"Claim" and "Chat on WhatsApp" links without a salon** open the existing salon picker (Sarjapur → HSR → Brookfield), then that salon's WhatsApp.
4. **Tests:**
   - Each of the 3 salons' booking ends at the right `wa.me` number with an encoded summary.
   - No booking path calls `fetch`.
   - Brookfield's WhatsApp is never its landline.

# Part C: production-ready checks (all must pass)

**C1. Clean code**
- no `console.log`, `debugger` or TODOs except `// OWNER:`
- no dead files or exports (`npx --yes knip`)
- no unused dependencies
- `npm audit --omit=dev` shows 0 high/critical (fix or document)
- the Node version is pinned (`"engines"` + `.nvmrc`)
- `npm ci && npm run build` works from a clean clone
- no secrets in the repo (`git grep -nE "(api[_-]?key|secret|token|password)\s*[:=]"`)
- `.env.example` documents every variable

**C2. Content and data**
- `consistency:audit` and `cspell` (en-GB + `cspell-words.txt`) → 0 errors
- NAP equals the GBP fixture everywhere
- prices equal `offerCatalog.ts` everywhere
- ratings come from the helper only
- no expired dates on any visible page
- no old-domain links

**C3. SEO, AEO and GEO** (`seo:audit` + `seo:checklist` → all PASS or MANUAL)
- every page has:
  - 1 H1 (keyword + geo) and correct heading order
  - a unique title (≤ 60) and description (120–155)
  - a self-canonical
  - an `og:image` (1200 × 630)
  - valid JSON-LD
  - alt text
- sitemap: 200 + indexable + canonical URLs only; `robots.txt` and `llms.txt` updated with the new offer URLs
- 0 broken links (`npm run links`) and 0 redirect chains
- `noindex` only on `/404` and preview builds

**C4. Mobile and UX**
- `mobile:audit` at 320/360/393/412/430 → 0 errors
- `load:check` → no unstyled or blank frames, CLS ≤ 0.05
- the logo goes to `/` on every page and in every header state
- the reels and maps behave as specified
- forms are usable with a keyboard and a screen reader
- accessibility: Lighthouse ≥ 95, focus visible, colour contrast AA

**C5. Performance**
- `perf:budget` green
- Lighthouse mobile (simulated) on 14 page types incl. the 4 offer pages: **Performance ≥ 90, LCP ≤ 2.5 s, CLS ≤ 0.05, TBT ≤ 150 ms, SEO 100, Best Practices 100**
- results recorded in `docs/seo/seo-cwv.md`

**C6. Hosting files** (static host; no server needed until the booking backend exists)
- `dist/_redirects` (Netlify / Cloudflare Pages) with the forced rules: http → https, `xingsalons.com` → `www`, trailing slash and `.html` → clean URL, and every 301 from A2
- `dist/_headers`: HSTS, `X-Content-Type-Options`, `Referrer-Policy`, a **Content-Security-Policy** that allows only `self`, `www.googletagmanager.com`, `www.google-analytics.com`, `*.clarity.ms`, `www.google.com`/`maps.google.com` (map iframes), `wa.me`/`api.whatsapp.com` (links only); cache rules (immutable `/assets/*`, 1 week for media, `no-cache` for HTML)
- also generate `vercel.json` with the same redirects and headers, in case the owner picks Vercel. Document which file each host uses.
- the 404 page returns status 404
- favicon, `site.webmanifest`, apple-touch-icon and theme colour are present

**C7. Analytics and consent**
- GTM / GA4 / Clarity / Google Ads load only when their env vars are set, only after consent, and exactly once
- no hardcoded `AW-` or `G-` IDs in `dist`
- `generate_lead` fires on every WhatsApp / Call / booking confirm, with no personal data

**C8. Final crawl** (Playwright)
- every sitemap URL + every old URL from A2 and `old-urls.md`, at 393 px and 1440 px:
  - status 200, or a single 301 → 200
  - no console errors, no failed requests, no mixed content
  - screenshots in `reports/launch/<date>/`
- read every 393 px screenshot of the 4 offer pages, `/`, the 3 salon pages and a service page, and fix anything wrong

**Report and README.**
1. The README gets a **"Deploy"** section:
   - build commands
   - env vars
   - which host file to use
   - DNS steps
   - the post-deploy checklist (Part D)
   - how to update offers (`offerCatalog.ts` + `scripts/offer-images.mjs`)
   - how to turn on the booking backend later

   Plus a dated **Change log** line.
2. Reply with ONLY:
   - the files added, changed and deleted
   - the results of C1–C8 (pass/fail + numbers)
   - the owner TODOs:
     - end dates for the non-November offers
     - Nanoplastia ₹5,999 vs ₹5,499
     - where the haircut ₹1,099 offer lives (default: the Hair Care & Treatment page)
     - the facial-feedback screenshots
     - corrected posters without September dates or overstated percentages

# Part D: deploy (owner steps; the agent writes them into the README)

1. **Pick a host:** Netlify or Cloudflare Pages (they read `_redirects`/`_headers`), or Vercel (`vercel.json`).
   - Build command: `npm ci && npm run build`. Output folder: `dist`.
   - Set the env vars: `VITE_GTM_ID`, `VITE_GA4_ID`, `VITE_CLARITY_ID`, `VITE_GSC_VERIFICATION`, `VITE_GOOGLE_ADS_IDS`, `VITE_CONSENT_REQUIRED`.
2. **Connect `xingsalons.com` + `www`** at your DNS (the host shows the records). Turn on **Force HTTPS**. Remove the old site from the old host only after the new one loads over HTTPS.
3. **Check:**
   - `http://xingsalons.com` → `https://www.xingsalons.com`
   - an old URL (e.g. `/hsrhaircoloroffers`) → `/offers/hair-colour`
   - `/sitemap.xml`, `/robots.txt` and `/llms.txt` load
   - booking at each salon opens the right WhatsApp
4. **Search Console:** verify the domain (DNS TXT), submit the sitemap, and request indexing for `/`, the 4 offer pages, the 3 salon pages and `/services`. **Bing:** import from Search Console, then run `node scripts/indexnow.mjs`.
5. **Google Ads:** change final URLs to `/offers/hair-colour`, `/offers/hair-treatment` and `/offers/skin-care`. **GBP:** set each salon's website to `https://www.xingsalons.com/salons/<id>`.
6. **Daily rebuild:** set a scheduled rebuild (a host build hook + cron), so the scheduled blog posts and campaign states update.
