# Prompt: technical SEO and indexing, v2 (every page, static pages included)

> Paste everything below the line into your coding agent from the project root (`xing salon 1`).
> The first SEO pass (31 Oct) built the prerender, sitemaps, canonicals, schema and audits for the React pages. **This pass fixes what's been added since**, above all the 9 static HTML pages, and then re-verifies all 20 items.

---

**Context.**
- **Stack:** Vite + React + TypeScript, prerendered (`scripts/prerender.mjs`).
- **Data:** `src/data/seo.ts` (meta and schema), `branches.ts` (GBP NAP), `style.ts` (wording).
- **Audits:** `seo:audit`, `mobile:audit`, `consistency:audit`, `perf:budget`, `seo:checklist`, `load:check`.
- **Redirects:** `redirects` in `src/data/services.ts` feeds `dist/_redirects` + `server/app.ts`.

**Rules:**
- Measure, fix, re-measure.
- Don't open `node_modules/`, `dist/` (use scripts or grep), media folders or `package-lock.json`.
- Don't invent facts.
- Never change a live URL without a 301.
- **Don't edit the 9 static HTML files' layout or images.** Fix their `<head>` and links with a build step (Step 2).
- After each step, run `npm run build && npm test && npm run seo:audit && npm run seo:checklist && npm run perf:budget` → 0 errors. Commit per step (`seo2: <step>`).

## 0. Why Google isn't showing the site (measured 4 Nov)

1. **The new site isn't live.** `src/data/staticOfferPages.ts` says `/offers` is "the xingsalons.com home page, byte for byte (live copy of 4 Nov 2026)", so **xingsalons.com still serves the old site**. A web search for the domain returns nothing from it. Nothing in code fixes this: the owner must deploy (Part M).
2. **9 static pages in `public/` bypass every SEO rule:**

   | File | robots | canonical | OG | schema | Problem |
   |---|---|---|---|---|---|
   | `offers.html` | — | ✗ | ✗ | ✗ | the **old home page copied whole**: duplicate content, old NAP |
   | `hsrhaircoloroffers.html`, `hsrhairtreatmentoffers.html` | **noindex** | ✗ | ✗ | ✗ | in the sitemap **and** noindex; hardcoded Google Ads `gtag` (no consent) |
   | `hsrskincareoffers.html` | — | ✗ | ✗ | ✗ | |
   | `sarjapaurahaircoloroffers.html` (misspelt), `sarjapurahairtreatmentoffers.html` | **noindex** | ✗ | ✗ | ✗ | near-duplicates of the HSR pages; in the sitemap |
   | `sarjapuraskincareoffers.html` | — | ✗ | ✗ | ✗ | duplicate of `hsrskincareoffers` |
   | `haircolorcare.html`, `hairtreatmentacare.html` (typo "acare") | **noindex** | ✗ | ✗ | ✗ | load Google Fonts; 1 image without alt each; likely overlap the blog posts `make-hair-colour-last` / `keratin-aftercare-tips` |

3. **The sitemap lists 6 noindexed or duplicate URLs**, and the slugs aren't clean (`/hsrhaircoloroffers`, `/sarjapaura…`, `/hairtreatmentacare`).
4. **Images:** `public/images` is **135 MB**, with **66 files over 300 KB** (up to 2.7 MB). These are in `xinghaircolor/`, `xinghairtreatment/`, `facialfeedback/`, `skincareoffers/`, `interiors/`, `keyoffers/` and `offer-*.jpg`.

## Step 1: one URL per piece of content (clean slugs + 301s)

| Content | New canonical URL | 301 from |
|---|---|---|
| Hair colour offers | `/offers/hair-colour` | `/hsrhaircoloroffers`, `/sarjapaurahaircoloroffers`, `/sarjapurahaircoloroffers`, `/offers/november`, `.html` forms |
| Hair treatment offers | `/offers/hair-treatment` | `/hsrhairtreatmentoffers`, `/sarjapurahairtreatmentoffers`, `.html` forms |
| Skin care offers | `/offers/skin-care` | `/hsrskincareoffers`, `/sarjapuraskincareoffers`, `.html` forms |
| Offers hub | `/offers` | the React `OffersPage`. Delete `public/offers.html`, the old home copy (duplicate content) |
| Colour aftercare | `/guides/hair-colour-aftercare` **or** a 301 to `/blog/make-hair-colour-last` (see below) | `/haircolorcare` |
| Treatment aftercare | `/guides/hair-treatment-aftercare` **or** a 301 to `/blog/keratin-aftercare-tips` | `/hairtreatmentacare` |

**How to implement it:**
- **Serve each kept static file at its new path:**
  1. Build copies `public/hsrhaircoloroffers.html` → `dist/offers/hair-colour.html` (and `index.html` form per the one-URL-form rule), and so on.
  2. Move the source files to `static-pages/` (outside `public/`) so the old paths no longer exist except as redirects.
  3. Update `staticOfferPages.ts`.
- **Sarjapur copies:** the visible content is the same, and each page's salon picker already handles salons, so they 301 to the shared page with `?salon=sarjapur-road`. **Before deleting** `sarjapaura*.html`, diff them against the HSR versions. If they contain anything unique (images, text), merge it into the kept page first.
- **Aftercare guides:** compare each guide with its blog post (shared sentences, headings).
  - If the overlap is > 40%, merge any unique paragraphs into the blog post, then 301 the guide to the post.
  - Otherwise, keep the guide at `/guides/...`, indexable, linked from the related service and blog pages.
- **Internal links:** update every link to the new URLs (nav dropdown, home offer cards, footer, salon pages, service offer bars, `llms.txt`, the static pages' own links, the README). Find them with:

  ```bash
  grep -rnE "hsr(haircolor|hairtreatment|skincare)offers|sarjapa?u?ra(haircolor|hairtreatment|skincare)offers|haircolorcare|hairtreatmentacare|offers/november|xingsalon\.(com|in)" src content static-pages scripts vite.config.ts index.html tests README.md docs
  ```

- **Google Ads:** the redirects keep ad final URLs working. Tell the owner to update them to the new URLs (Part M).

## Step 2: give the static pages the same SEO head (build step, not hand edits)

Create `src/data/staticPagesMeta.ts`, with one entry per kept static page: path, title (≤ 60, `… – Xing Salon`), description (120–155), primary keyword, OG image, breadcrumb, and schema type.

Then add `scripts/static-pages-seo.mjs`, run in `build` after prerender. For each static page in `dist`, it:
- **replaces `<head>` meta:** `<title>`, `meta description`, `<meta name="robots" content="index,follow">` (**removing every `noindex`** on kept pages), a self `<link rel="canonical">` (https, www, no trailing slash, no query), `og:*` + `twitter:card` with a 1200 × 630 image from `public/og/` (make `og-offers-hair-colour/treatment/skin.jpg` from the pages' hero images, **no prices** on them), `og:url` = canonical, and `<html lang="en-IN">`
- **adds JSON-LD** (from `seo.ts` helpers, same `@id`s): `WebPage` + `BreadcrumbList` (Home › Offers › Hair Colour) + `OfferCatalog` of `Offer` (prices exactly as on the page; `offeredBy` = the 3 salon `@id`s; `priceValidUntil` only where a real end date exists) + `FAQPage` only if the page shows an FAQ. The guides get `Article`.
- **removes Google Fonts** `<link>`s and uses the site's self-hosted fonts.
- **removes hardcoded `gtag.js`/`AW-…` scripts.** The Google Ads IDs load through the site's consent-gated loader (`src/lib/tags.ts`, `VITE_GOOGLE_ADS_IDS`), exactly once per page.
- **adds `alt`** to the images that lack it (from a small map in `staticPagesMeta.ts`), `width`/`height` where they're missing, and `loading="lazy" decoding="async"` below the first screen.
- **checks there's exactly 1 `<h1>`** and that headings run h2 → h3 with no skips. Fix any violation by changing the tag only, never the text or the layout.
- **rewrites internal links** to the new URLs, and every `href="#"` to a real target.

## Step 3: re-run all 20 items for every page (React + static)

Extend `scripts/seo-audit.mjs` and `seo-checklist.mjs` so they read **every** `dist/**/*.html`, static pages included. Then fix every FAIL:

| # | Item | PASS when |
|---|---|---|
| 1 | sitemap.xml | the index → pages/blog/images sitemaps; **every** `<loc>` is a 200, indexable, self-canonical URL (sitemap ∩ noindex = 0; sitemap ∩ redirect = 0); the new `/offers/*` and kept guides are included; real `lastmod` |
| 2 | robots.txt | `Allow: /`, `Disallow: /api/`, AI-crawler groups, `Sitemap:` line; CSS, JS and images are not blocked |
| 3 | No stray noindex | only `/404`, redirect stubs and preview builds |
| 4 | Canonical | 1 per page, absolute, self, equal to the sitemap `<loc>` and `og:url` |
| 5–6 | Titles / descriptions | unique; 30–60 / 120–155 characters; keyword + Bangalore (or the salon area) |
| 7–8 | One H1 / heading order | exactly 1 H1 containing the primary keyword + a geo term; no skipped levels |
| 9 | Alt text | every `<img>` has meaningful alt (decorative: `alt=""` + `aria-hidden`); no alt text duplicated across different images |
| 10 | Schema | every page has a valid `@graph` (`Organization`, `WebSite`, `WebPage`, `BreadcrumbList`, plus page-type nodes); NAP equals the GBP fixture; no self-serving `AggregateRating`; it passes the Schema Markup Validator (paste the JSON from 6 sample pages) |
| 11 | Internal links | every indexable page has ≥ 3 incoming and ≥ 3 outgoing internal links; no orphans; the offer pages link to each other, to their services and to the 3 salons |
| 12 | Broken links | 0 internal 404s or anchors; 0 links to redirects or old slugs or `xingsalon.com`/`.in`; external links HEAD-checked |
| 13 | Images | Step 4 |
| 14 | Core Web Vitals | Lighthouse mobile (simulated) on 12 page types **plus the 3 offer pages**: Performance ≥ 90, LCP ≤ 2.5 s, CLS ≤ 0.05, TBT ≤ 150 ms; `perf:budget` green |
| 15 | Mobile | `mobile:audit` at 320/360/393/412 → 0 errors, the static offer pages included |
| 16 | HTTPS | HSTS + http→https + non-www→www 301s in `_redirects` and Express; no `http://` internal links or mixed content |
| 17 | Slugs | lowercase, hyphenated, no typos, no `.html`, no salon duplicates; every old slug 301s once (no chains) |
| 18 | OG image | every page has a 1200 × 630 `og:image` (≤ 300 KB, exists, absolute URL) + `og:image:alt` |
| 19 | Search verification | `<meta name="google-site-verification">` when `VITE_GSC_VERIFICATION` is set; actual verification is MANUAL |
| 20 | Backlink plan | `docs/seo/SEO_BACKLINKS.md` is updated (Step 6) |

Save the before and after output to `reports/seo2/<date>/`.

## Step 4: compress images (135 MB → ≤ 45 MB)

1. Back up every file you change to `../xing-media-originals/web-originals/<path>`, and check counts and bytes.
2. **Images used by the static pages:** re-encode **in place**, with the same name, format and look. Resize anything larger than 1,600 px to 1,600 px wide. JPG: `sharp` mozjpeg q78. PNG: `pngquant --quality 70-85` + `oxipng`. Screenshots (`facialfeedback/`) at 1,080 px wide.
3. **Images used by React pages:** make AVIF + WebP variants (the existing scripts and `<picture>`). No content image over 300 KB, except 1200 px originals that are only opened in a lightbox.
4. Run the asset-usage crawl (`scripts/cleanup-inventory.mjs`, A3 logic): images no page uses go to quarantine, then are deleted after verification.
5. Target: `public/images` ≤ 45 MB, 0 files over 300 KB in initial page loads, and `perf:budget` green.

## Step 5: final checks

1. Run all the audits + `npm test` + `load:check` → 0 errors.
2. Add `tests/seo-v2.test.ts`:
   - every Step 1 old URL → one 301 → a 200
   - sitemap ∩ (noindex ∪ redirects) = ∅
   - every `dist` HTML has 1 canonical, 1 H1, `og:image` and a parseable JSON-LD
   - no `fonts.googleapis.com`, `gtag/js?id=AW-` or `href="#"` in `dist`
3. Run Lighthouse on the 15 pages and update `docs/seo/seo-cwv.md`.
4. **README:** add sections on static pages (where they live, the head-injection step, how to add one), the new URL and redirect table, and image rules, plus a dated **Change log** line.

## Step 6: backlink strategy (update `docs/seo/SEO_BACKLINKS.md`; a plan, no code)

Add these sections:
1. **Fix the 3 GBP website links first.** They currently point to 3 domains (`xingsalon.in`, `xingsalons.com`, `xingsalon.com`). Point each one to `https://www.xingsalons.com/salons/<id>`, and 301 the old domains to the new site.
2. **Citations, with NAP copied from `branches.ts`:** Justdial, Sulekha, Magicpin, Bing Places, Apple Business Connect, Facebook, Instagram, LinkedIn.
3. **Owned links:** `xingtattoo.in` and `xingfitness.in` footers and about pages.
4. **Earned links:** Bangalore lifestyle media (LBB, Curly Tales), RWA and community pages near each salon, bridal directories (WedMeGood, ShaadiSaga), brand salon locators for brands actually used (owner to confirm), and partnerships with nearby gyms and cafés.
5. **Linkable assets:** the aftercare guides, colour-for-Indian-skin-tone and hard-water posts.
6. **Never:** paid link packages, PBNs or link exchanges.
7. **A monthly tracker table.**

**Reply with ONLY:**
- the files changed and moved
- before → after: `seo:checklist` counts, sitemap URL count, `public/images` MB, files over 300 KB, and the Lighthouse table
- the **Part M** list below

## Part M: manual steps for the owner

1. **Deploy the new build to xingsalons.com.** Today the domain serves the old site, so Google can't see any of this work.
   - Run `npm run build && npm run build:api`, then deploy `dist/` + the server (or your host).
   - At the host, turn on **Force HTTPS**.
   - Check `http://xingsalons.com` → `https://www.xingsalons.com`.
2. **Search Console:** add a Domain property, verify it by DNS TXT (or set `VITE_GSC_VERIFICATION` and rebuild), submit `https://www.xingsalons.com/sitemap.xml`, then request indexing for `/`, `/offers/hair-colour`, `/offers/hair-treatment`, `/offers/skin-care`, the 3 salon pages and `/services`. After a deploy that changes URLs, use **Pages → Validate fix**.
3. **Bing Webmaster Tools:** import from Search Console, then run `node scripts/indexnow.mjs` after each deploy.
4. **Google Ads:** change the final URLs from the old slugs to `/offers/hair-colour`, `/offers/hair-treatment` and `/offers/skin-care` (add `?salon=` for salon-specific ads). Set `VITE_GOOGLE_ADS_IDS`.
5. **Old domains:** if you own `xingsalon.com` and `xingsalon.in`, 301 them to `https://www.xingsalons.com` (page-to-page where possible).
6. **GBP:** set each salon's website to `https://www.xingsalons.com/salons/<id>`, and fix "Brookefield" on the Brookfield profile.
7. Check Search Console → Pages after 7–14 days, and send the agent any "not indexed" reasons.
