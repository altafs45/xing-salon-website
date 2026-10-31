# Prompt: deep project cleanup + complete the 20-point SEO / AEO / GEO checklist (code only; Google account set-up stays with the owner)

> Paste everything below the line into your coding agent from the project root (`xing salon 1`).
> Every earlier prompt has already run (SEO, GBP, offers, polish). This prompt **first cleans the project folder (Part A), then verifies the checklist and builds only what's missing (Part B).** Stop the dev server and any other agent first.

---

You are working on an existing Vite + React 18 + TypeScript multi-page site for XING Premium Unisex Salon (3 Bangalore salons, `site.url` = `https://www.xingsalons.com`). Pages are prerendered. These scripts already exist: `seo-audit`, `mobile-audit`, `consistency-audit`, `perf-budget`. Tests live in `tests/`. Salon facts live in `src/data/branches.ts` and are locked to the Google Business Profiles by `tests/gbp.test.ts`. The style rules are in `src/data/style.ts` and `CONTENT_STYLE.md`.

**Goal:** every item in the checklist below is either **verified as done** by an automated check, or **built and then verified**. Work from measurements:
1. Run the checklist script.
2. Fix only the FAILs.
3. Re-run.

Never redo something that passes.

## 0. Rules

1. **Reading budget:** never open `node_modules/`, `dist/` (use scripts or `grep`), `server-dist/`, media folders or `package-lock.json`. Read source by line ranges only.
2. **Facts come only from data:** NAP and hours from `branches.ts`, prices from `offers.ts`, ratings from `ratingLabel()`, style from `style.ts`. **Never invent** facts, statistics, reviews, stylist names, prices or sources in copy or blogs.
3. **No tracking ID is hard-coded.** Each comes from an env var. With the env var empty, nothing loads and nothing breaks.
4. Third-party scripts must not hurt Core Web Vitals. Load them after first paint, or after the visitor first interacts with the page, and keep everything inside the `perf-budget` limits.
5. After every step: `npm run build && npm test && npm run seo:audit && npm run mobile:audit && npm run consistency:audit && npm run perf:budget && npm run seo:checklist`. Fix every ERROR. Commit per step: `git add -A && git commit -m "checklist: <step>"`.

# PART A: DEEP CLEANUP (do this first; it makes every later step faster)

## A0. What's in the folder now (measured 31 Oct; 2.1 GB in total, of which the website needs about 60 MB)

| Path | Size | What it is | Git |
|---|---|---|---|
| `.git` | **564 MB** | 2,016 loose, uncompressed objects (never packed); includes every committed screenshot | — |
| `screenshots/` | **352 MB** | Audit/test screenshots: `mobile/` 187 MB, `mobile-after/` 50 MB, `branch-pages/` 34 MB, `after/` 18 MB, `mobile-before/` 11 MB, `offers/`, `about/`, `bridal-cleanup/` and others (18 folders) | **tracked (267 files)** |
| `XING Gallery/` | 231 MB | the owner's original photos | ignored |
| `node_modules/` | 200 MB | dependencies | ignored |
| `xing AECS interiors/` | 139 MB | the owner's original photos | ignored |
| `dist/` | 61 MB | build output (rebuilt every build) | ignored |
| `public/` | 52 MB | **the live website's media**: `images/` 17 MB, `videos/` 33 MB, `og/`, `brand/` | tracked |
| `pictures and videos/` 43 MB, `videos/` 41 MB, `global highlights/` 30 MB, `nanoplastia/` 25 MB, `balayage/` 25 MB, `highlights/` 16 MB, `xing hsr interior/` 13 MB, `sort these pictures and move them/` 13 MB, `keratin/` 13 MB, `before after/` 13 MB, `XING HSR services images/` 12 MB, `XING HSR-20261003T125731Z-1-001/` 7.4 MB, `XING SARJAPUR-20261003T125733Z-1-001/` 7.0 MB, `offers for november/` 6 MB, `offers/` 5.5 MB, `crazy colors/` 2.2 MB, `mens grooming/` 1.5 MB | ~300 MB | the owner's **original media drops** (the web copies are already in `public/`) | ignored |
| `logo.png` 1.7 MB, `logo for nav bar.png` 1.7 MB | 3.4 MB | original logo files (the web versions live in `public/brand/`) | tracked |
| `server-dist/` | 128 KB | built API server (rebuilt by `build:api`) | ignored |
| Audit reports in the root: `consistency-before/after.txt`, `mobile-audit-before/after.txt`, `seo-audit-before/after.txt`, `seo-external-links.txt` | ~430 KB | one-off outputs of the audit scripts | tracked |
| Report docs in the root: `seo-cwv.md`, `perf-budget.md`, `seo-keyword-map.md`, `SEO_BACKLINKS.md`, `CONTENT_STYLE.md` | ~40 KB | useful docs | tracked |
| Agent prompts in the root: `NOVEMBER_OFFERS_PROMPT.md`, `OFFERS_PAGE_NAV_PROMPT.md`, `OFFERS_PAGE_FINAL_PROMPT.md`, `SALON_ORDER_NAV_FAQ_PROMPT.md`, `SEO_INDEXING_PROMPT.md`, `GBP_CONSISTENCY_PROMPT.md`, `CONSISTENCY_SPEED_SEO_PROMPT.md`, `SEO_AEO_GEO_CHECKLIST_PROMPT.md` | ~175 KB | instructions that have already been carried out | tracked |
| `public/images/` | 17 MB | 407+ files. A rough name check suggests up to ~260 may be unused, **but many names are built in code** (`pair('haircolor-1')` → `ba-haircolor-1-before.webp`), so this must be proven by a crawl (A3) | tracked |

## A1. Safety rules (never break these)

1. **Back up before deleting anything:**
   - `git bundle create "../xing-backup-$(date +%F).bundle" --all`
   - Commit any pending work first.
   - Write the full inventory to `cleanup/cleanup-plan.md` (Step A2) **before** moving anything.
2. **The owner's original photos and videos are never deleted.** They may be the only copies. Every original-media folder above (and `logo.png` / `logo for nav bar.png`) is **moved out of the project** to a sibling folder, `../xing-media-originals/<same folder name>/`. Never put them in the trash.
   - If a move fails (permissions, a cloud-only file), stop and report. Don't delete.
   - Check each move by comparing file counts and total bytes, source vs destination.
3. **Delete only what can be rebuilt or has served its purpose:** test screenshots, audit outputs, build output, caches, dead code and assets proven unused (A3). Everything deleted from tracked files can still be recovered from git history and the bundle.
4. **Two-phase deletion for anything that isn't obviously rebuildable:**
   1. Move it to `cleanup/_quarantine/<original path>`.
   2. Run the full verification (A6).
   3. Only if everything passes, delete the quarantine.
5. Never touch `.env`, `.env.local`, `data/` (lead data, personal information), `public/_headers`, `public/_redirects`, `public/robots.txt`, `public/site.webmanifest`, `public/brand/*` or the favicons/icons, `content/blog/*`, `src/`, `server/` or `tests/`, except the dead code proven in A4.

## A2. Inventory first: `scripts/cleanup-inventory.mjs`

Write a Node script, with no new dependencies, that walks the project (skipping `node_modules` and `.git`) and writes `cleanup/cleanup-plan.md`. It has one table per category: path · size · tracked or ignored · reason · action. Categories:

| Category | Action | What goes in it |
|---|---|---|
| **DELETE: rebuildable/test output** | delete | `screenshots/` (all), `dist/`, `server-dist/`, `coverage/`, `.vite/`, `node_modules/.vite`, `playwright-report/`, `test-results/`, `*.log`, `*.tmp`, `.DS_Store`, `Thumbs.db`, `desktop.ini`, `~$*` Office lock files, `*.bak`, `*.orig`, editor swap files, empty folders |
| **DELETE: one-off reports** | delete (they can be regenerated with the npm scripts) | `consistency-before/after.txt`, `mobile-audit-before/after.txt`, `seo-audit-before/after.txt`, `seo-external-links.txt`, any `checklist-*.txt` / `*-before.*` / `*-after.*` report |
| **MOVE OUT: original media** | move to `../xing-media-originals/` | every original-media folder in A0, `logo.png`, `logo for nav bar.png`, plus any other image/video/PDF/doc in the project root or top-level folders that isn't under `public/` or `content/` |
| **MOVE IN: documentation** | `docs/` | `docs/prompts/` ← all `*_PROMPT.md`; `docs/seo/` ← `seo-cwv.md`, `perf-budget.md`, `seo-keyword-map.md`, `SEO_BACKLINKS.md`; `docs/CONTENT_STYLE.md`. Update every link to them (README, scripts that write them, `CONTENT_STYLE` references) |
| **REVIEW: unused web assets** | quarantine, then delete | output of A3 |
| **REVIEW: dead code** | quarantine, then delete | output of A4 |

Print the totals per category (files, MB). That plan is what you execute; don't improvise outside it.

## A3. Prove which `public/` assets are really unused

A name check isn't enough, because file names are built in code. Use 3 sources and keep a file if **any** of them references it:

1. **Build output:** after `npm run build`, collect every `/images/`, `/videos/`, `/og/`, `/brand/` and `/fonts/` URL found in `dist/**/*.html`, `dist/**/*.js`, `dist/**/*.css`, `dist/*.txt`, `dist/*.xml`, `dist/*.webmanifest` and `dist/_headers` (including `srcset`/`imagesrcset` lists and JSON-LD `image` fields).
2. **A runtime crawl** (Playwright, already installed): for every sitemap URL **plus** `/offers/november`, `/404` and `/privacy`, at 390 px and 1280 px, with `?today=2026-11-10`:
   - scroll to the bottom
   - click every tab, carousel arrow and "Show more" / "View more" control
   - open every offer "Details" sheet and the gallery lightbox
   - tap each map facade
   - open the booking modal and the gift lead form

   Record every network request under `/images/`, `/videos/`, `/og/` and `/fonts/`.
3. **Name patterns in source:** grep `src/data/**` for the `photo(`, `img(`, `work(`, `pair(`, `reel(`, `imagePrefix`, `gal-` and `loc-` builders, expand them to real file names (with the `-480`/`-800`/`-1200`/`-poster`/`.avif` variants), and add them to the keep list.

**Unused** = in none of the 3 lists. Also flag:
- the AVIF/WebP pair of a kept image (keep both)
- files over 300 KB that are used (report them for re-compression; don't delete them)
- duplicate files with identical content (same SHA-1): keep the referenced name and quarantine the other

Write `cleanup/unused-assets.md` with name, size and why it's unused, then quarantine those files.

## A4. Remove dead code and unused packages

1. Run `npx --yes knip --reporter compact` (it finds unused files, exports, types and dependencies in TS/Vite projects). Treat its output as **candidates**, not truth:
   - Entry points: `src/main.tsx`, `vite.config.ts`, `server/index.ts`, `scripts/*.mjs`, `tests/**`, the blog virtual modules and lazy `import()` pages.
   - Confirm each unused file or export with `grep -rn "<name>" src server scripts tests vite.config.ts` before removing it.
2. Remove:
   - unused components, data and helpers (for example leftovers from earlier versions of the offers page, the old single-page `content.ts` sections no page renders, and unused `combos`/`offers` entries **only if** nothing imports them)
   - unused exports (make them non-exported or delete them)
   - `console.log` debug lines
   - commented-out code blocks over 5 lines
   - `TODO`s that are done (keep the `// OWNER:` TODOs)
3. Unused npm packages: `npm uninstall <pkg>` for each confirmed one. Re-run `npm install` and commit the updated `package-lock.json`.
4. Old scripts: `scripts/fetch-images.mjs` downloads Unsplash placeholders (the README says only 1–2 are left). If no placeholder image remains in use, delete the script, its `npm run images` entry and the README lines. Keep `prerender`, `seo-audit`, `mobile-audit`, `consistency-audit`, `perf-budget`, `seo-checklist` and `offer-images`. Merge any duplicate audit helpers into `scripts/lib/`.
5. Old redirects and aliases: keep every entry in `redirects` (old URLs may have backlinks). Remove alias maps only if no route or link uses them.

## A5. Make the cleanup stick

1. **`.gitignore`:** add these ignore lines, keeping the existing ones:
   - `screenshots/`, `reports/`, `cleanup/_quarantine/`
   - `coverage/`, `playwright-report/`, `test-results/`
   - `*.log`, `Thumbs.db`, `desktop.ini`
2. **Write reports to an ignored folder from now on:** every audit script (`seo-audit`, `mobile-audit`, `consistency-audit`, `perf-budget`, `seo-checklist`) writes its before/after files and screenshots to **`reports/<script>/<date>/`**. Change the scripts. Nothing writes into the project root any more.
3. **Untrack the deleted generated files:** `git rm -r --cached screenshots` (and the report files), then commit.
4. **Shrink `.git`** (safe: it changes no history): `git gc --aggressive --prune=now`. The 2,016 loose objects get packed, which should cut 564 MB down a lot. Report the before/after size.
5. **Optional: purge screenshots from history.** This rewrites history and needs a force-push to `origin` (`github.com/altafs45/xing-salons`), so **do it only if the owner types "yes, rewrite history"**. Otherwise skip it and list it in the report. If approved:
   1. Back up first (the A1 bundle).
   2. `git filter-repo --path screenshots --path-glob '*-before.txt' --path-glob '*-after.txt' --invert-paths`.
   3. Re-add the remote.
   4. `git push --force-with-lease`.
   5. Tell the owner that every other clone must be re-cloned.
6. **README:** a "Project layout" tree of the clean folder, and a "Where things go" table:

   | Kind of file | Where it goes |
   |---|---|
   | New photos for the site | `public/images/` via `scripts/offer-images.mjs` (or the image script) |
   | Original media | `../xing-media-originals/`, never in the project |
   | Docs | `docs/` |
   | Reports and screenshots | `reports/` (ignored) |

## A6. Verify the cleanup (all must pass before emptying the quarantine)

1. `npm ci && npm run build && npm test`
2. `npm run seo:audit && npm run mobile:audit && npm run consistency:audit && npm run perf:budget` → 0 errors
3. Re-run the A3 crawl: **0 requests returning 404** for any asset, and no broken image in any page at 390 px or 1280 px.
4. `npm run dev` → home, a service page, a salon page, `/offers/november`, `/blog`, a post and `/membership-gift-cards` load with no console errors.
5. Spot-check that `../xing-media-originals/` contains every moved folder with matching file counts and bytes.
6. Then delete `cleanup/_quarantine/`. Keep `cleanup/cleanup-plan.md` and `cleanup/unused-assets.md` for the record (move them to `docs/cleanup/`).
7. Record the **before → after** of: project size without `node_modules`; `.git` size; number of root files; number of `public/images` files; MB of `public/`.

**Target layout after the cleanup:**

```
xing salon 1/
├─ .env.example  .gitignore  index.html  package.json  package-lock.json
├─ README.md  postcss.config.js  tailwind.config.ts  tsconfig.json  vite.config.ts  vitest.config.ts
├─ content/blog/        docs/ (prompts/, seo/, cleanup/, CONTENT_STYLE.md)
├─ public/              scripts/ (+ lib/)   server/   src/   tests/
└─ (ignored: node_modules/, dist/, server-dist/, reports/, .env*, data/)
```

Commit: `git add -A && git commit -m "cleanup: remove test output and dead code, move originals and docs, pack git"`.

---

# PART B: SEO / AEO / GEO CHECKLIST

## 1. Build the checker first: `scripts/seo-checklist.mjs`

The script is Node with no new dependencies. It reads `dist/` (HTML, `robots.txt`, `llms*.txt`, sitemaps, `_headers`) plus `.env.example`, and prints **one row per checklist item**: `PASS|FAIL|MANUAL  <#> <item>  <evidence or what's missing>`. Exit code 1 on any FAIL. Add `"seo:checklist": "node scripts/seo-checklist.mjs"`. Save the first run to `reports/seo-checklist/<date>/before.txt` (never the project root).

| # | Item | Automated PASS condition |
|---|---|---|
| 1 | SEO / AEO / GEO blogs | ≥ 40 live posts in `sitemap-blog.xml`. Every post has: 1 H1; a byline + visible updated date; a "Key takeaways" block; ≥ 3 question-style H2s; a visible FAQ + matching `FAQPage`; `BlogPosting` with `datePublished`/`dateModified`/`author`/`publisher`/`image`; ≥ 2 internal links to services + ≥ 2 to other posts; 1 local-intent paragraph naming Bangalore + at least one salon area; categories from a fixed list (no duplicates such as `"Hair Care"` vs `Hair Care`) |
| 2 | Local schema | `/`, `/salons`, the 3 salon pages and `/about` contain 3 salon nodes with `@type` including `HairSalon` or `BeautySalon`; `name`/`address`/`telephone`/`geo`/`openingHoursSpecification` exactly equal the GBP fixture; stable `@id` `/salons/<id>#salon`; `parentOrganization` → `/#organization`; no `aggregateRating`/`review` |
| 3 | Google Map on the main page | `/` has a `#map` section with an interactive Google map (click-to-load facade, see Step 4) for all 3 salons, in Sarjapur → HSR → Brookfield order, with each map's iframe `title` set; no iframe is loaded during first paint |
| 4 | Microsoft Clarity | loader present, gated by `VITE_CLARITY_ID`, and loaded only after consent + interaction/idle (Step 3) |
| 5 | Google Tag Manager | GTM loader + `<noscript>` iframe gated by `VITE_GTM_ID`; `dataLayer` initialised before it; Consent Mode v2 defaults set **before** the GTM tag |
| 6 | Google Analytics 4 | either through GTM (preferred) or direct `gtag.js` gated by `VITE_GA4_ID` (used only when `VITE_GTM_ID` is empty, never both); the GA4 events from Step 3 fire on the right clicks (checked in Playwright) |
| 7 | Search Console + XML sitemap | `<meta name="google-site-verification">` present when `VITE_GSC_VERIFICATION` is set; `sitemap.xml` is a valid index → `sitemap-pages/blog/images.xml`; every `<loc>` is an indexable 200 page with a matching canonical; `lastmod` is real; `robots.txt` names the sitemap index. **Domain verification and submitting the sitemap → MANUAL** |
| 8 | Indexing | every sitemap URL is `index,follow` with body text in the prerendered HTML (≥ 150 words, 1 H1); no sitemap URL is redirected, `noindex`ed or orphaned. **Requesting indexing → MANUAL** |
| 9 | robots.txt | `Allow: /`, `Disallow: /api/`, the AI crawler groups, the `Sitemap:` index line, the `llms.txt` comment; it doesn't block `/assets`, `/images`, CSS or JS |
| 10 | llms.txt | `dist/llms.txt` + `llms-full.txt` exist, are generated from data, contain the entity description, the 3 exact GBP names + phones + hours + map links, the service list with URLs, the open offers with end date, the top guides, and "Last updated" |
| 11 | Site-wide JSON-LD in `<head>` | every page has exactly 1 `application/ld+json` `@graph` in `<head>` with `Organization` (`/#organization`: name, logo, description = entity description, `foundingDate` 2020, `sameAs`, `subOrganization` = 3 salon `@id`s), `WebSite` (`/#website`, `inLanguage` `en-IN`, `publisher`), `WebPage` (`<url>#webpage`) and `BreadcrumbList` (except home). Everything parses, no `@id` is duplicated with different data, and nothing is empty or `undefined` |
| 12 | NAP in header/footer | the footer on every page renders the 3 `SalonNap` blocks, byte-identical to the salon pages; the header shows the salon's call button on salon pages and the "Call a salon" picker elsewhere; on desktop ≥ 1024 px, a thin utility bar shows all 3 salons (Step 5); **no phone, address or hours string in `dist` that differs from the fixture** |
| 13 | FAQ schema + section on core pages | `/`, `/services`, the 3 category pages, every service page, the 3 salon pages, `/offers`, `/offers/november`, `/membership-gift-cards`, `/about` and `/faq` each have a visible FAQ (4–10 Qs) **and** one `FAQPage` whose Q&A text equals the visible text exactly; no `FAQPage` on pages without a visible FAQ |
| 14 | Primary keyword + geo H1 | every indexable page's H1 contains its primary keyword from `seo-keyword-map.md` **and** a geo term (Bangalore or the salon area). Blog H1s are exempt from the geo term, but their first paragraph must contain it |
| 15 | Clear CTAs | every page has a primary CTA (from `CTA` in `style.ts`) visible above the fold at 390 px; one sticky bottom bar on mobile; every WhatsApp link prefilled with page context; every CTA ≥ 44 px; every CTA has a `data-cta` attribute for tracking |
| 16 | Conversational, long-tail, entity-rich copy | every service and salon page has the "Quick answers" `<dl>`, ≥ 3 question-style H2/H3s, ≥ 2 named entities beyond the brand (salon area, landmark, technique or product names already in the data), and 1 quotable fact sentence with numbers from existing copy |
| 17 | Mobile-first responsive | `npm run mobile:audit` → 0 errors at 360/375/390/412 |
| 18 | Fast Core Web Vitals | `npm run perf:budget` passes; Lighthouse mobile (simulated) on the 12 page types gives Performance ≥ 90, LCP ≤ 2.5 s, CLS ≤ 0.05, TBT ≤ 150 ms, **with the analytics env vars set to test IDs**, so the third-party tags are part of the measurement |
| 19 | HTTPS | `_headers` + Express send HSTS; http → https and non-www → www 301 rules exist in `_redirects` + Express (tests in `static.test.ts`); no `http://` link to our own site or assets in `dist`; no mixed content. **The certificate itself → MANUAL (the host)** |
| 20 | Canonical | every indexable page has 1 absolute self-canonical (https, www, no trailing slash, no query) equal to its sitemap `<loc>`; `og:url` equals the canonical; redirect stubs are `noindex` |

## 2. Step 1: run the checker and close the easy FAILs

Run `npm run build && npm run seo:checklist`. Items 2, 7–11, 13, 14, 17, 19 and 20 should mostly pass already from earlier work. Fix each FAIL at its source (data or shared component), using the existing helpers in `src/data/seo.ts`. Common fixes:
- `foundingDate` or `sameAs` missing from `Organization`. `sameAs` takes only links that exist in `content.ts`, the 3 GBP `cid` links, `xingtattoo.in` and `xingfitness.in`.
- Core pages without a visible FAQ: add 4–6 Qs drawn only from facts already on that page.
- Blog categories with duplicate spellings: normalise the front matter to one fixed list in `src/blog/types.ts` (Hair Care, Hair Colour, Hair Treatments, Skin Care, Nails, Body & Waxing, Men's Grooming, Kids, Bridal, Tattoo), and make the blog build fail on an unknown category.

## 3. Step 2: analytics, tags and Clarity (code only; the owner creates the accounts)

**Env vars:** add these to `.env.example`, each with a one-line comment:
- `VITE_GTM_ID` (`GTM-XXXXXXX`)
- `VITE_GA4_ID` (`G-XXXXXXXXXX`; used only if there's no GTM)
- `VITE_CLARITY_ID`
- `VITE_GSC_VERIFICATION` (already exists)
- `VITE_CONSENT_REQUIRED=true`

**Loader module:** create `src/lib/tags.ts`. Then, in `index.html` and `vite.config.ts`, inject at build time **only when the env var is set**:

1. **Consent Mode v2 defaults, inline in `<head>` before anything else:**
   ```js
   window.dataLayer = window.dataLayer || [];
   function gtag(){dataLayer.push(arguments);}
   gtag('consent', 'default', {
     ad_storage: 'denied',
     ad_user_data: 'denied',
     ad_personalization: 'denied',
     analytics_storage: 'denied',
     functionality_storage: 'granted',
     security_storage: 'granted',
     wait_for_update: 500
   });
   ```
2. **GTM:** the standard snippet, but **not render-blocking**. Inject `gtm.js` with `async`, after the `load` event or the first interaction (`pointerdown`, `keydown`, `scroll`), whichever comes first, with a 4 s fallback. Put the `<noscript>` GTM iframe right after `<body>`. Inside GTM, the owner configures GA4 + Clarity (see Part M).
3. **Direct GA4** (only if `VITE_GTM_ID` is empty and `VITE_GA4_ID` is set): load `gtag.js` the same deferred way, then `gtag('config', ID, { send_page_view: true })`.
4. **Clarity direct** (only if `VITE_CLARITY_ID` is set and Clarity isn't managed in GTM): the official tag, deferred the same way. Call `clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' | 'denied' })` according to the visitor's choice.

**Consent banner:** add `src/components/ConsentBar.tsx`, shown when `VITE_CONSENT_REQUIRED` is true. It's a small bottom sheet above the sticky bar with two equal buttons, **"Accept"** and **"Only essential"**, plus a link to `/privacy` (see below).
- Accept → `gtag('consent','update',{ analytics_storage:'granted', ad_storage:'granted', ad_user_data:'granted', ad_personalization:'granted' })` + the Clarity `consentv2` update.
- Store the choice in localStorage (wrapped in try/catch).
- It must not cause layout shift, not cover CTAs, and not appear in the prerender snapshot.
- Both options are equally easy (no dark patterns).
- This is the privacy-first default for India's DPDP Act. The owner can set `VITE_CONSENT_REQUIRED=false` after legal advice.

**Privacy page:** if there's no `/privacy` page, create a simple one from a template in `src/data/privacy.ts`. It covers what's collected (analytics, Clarity session recordings with inputs masked, form leads), why, retention, the grievance contact (`GRIEVANCES` in `branches.ts`) and how to opt out. Mark it `// OWNER: legal review`. Link it in the footer and add it to the sitemap.

**Clarity masking:** add `data-clarity-mask="true"` on every form input (booking, gift/membership lead form, phone and name fields) so no personal data is recorded.

**Events:** extend the existing `src/lib/analytics.ts`. It already pushes events to `dataLayer`; keep those names and **add GA4-recommended names** alongside them, so GTM can map them. Never include personal data (no names, phone numbers or message text).

| User action | `dataLayer` event | Params |
|---|---|---|
| Any WhatsApp click | `generate_lead` + existing `whatsapp_click` | `method:'whatsapp'`, `cta`, `page_type`, `branch`, `offer_id?` |
| Call click | `generate_lead` + `call_click` | `method:'phone'`, `branch` |
| Directions click | `get_directions` + `directions_click` | `branch` |
| Booking form opened / step / submitted | `begin_checkout`-style custom: `booking_open`, `booking_step`, `booking_submit` | `service`, `branch`, `step` |
| Offer viewed / claimed | `view_promotion` / `select_promotion` (+ existing `nov_offer_*`) | `promotion_id`, `promotion_name`, `creative_slot` (`placement`) |
| Gift/membership lead success | `generate_lead` + `gm_form_submit_success` | `method:'form'`, `product` |
| Blog read 75% | `scroll_depth` | `percent:75`, `post` |
| FAQ opened | `faq_open` | `question_id` |

Push `page_type` (home/service/category/salon/offers/blog/about/faq/gifts) and `branch` (when known) to `dataLayer` once per page, **before** GTM loads.

**Tests** (`tests/tags.test.ts`):
- With no env vars, `dist` contains no GTM, GA or Clarity code.
- With test IDs, each appears once, the consent defaults come before GTM, and there's no duplicate GA (GTM + direct).
- Playwright: clicking WhatsApp pushes `generate_lead` with no personal data.

## 4. Step 3: Google Map on the main page (fast)

Add a **"Find Your Nearest Xing"** section with `id="map"` to the home page, after the salons section. Reuse `MapPanel` from `src/components/service/LocationCards.tsx`.

- **Facade first:** each map shows a static preview image until tapped, with the salon name, area, open-now chip and a "Show map" button. Make the preview once with a script (a screenshot of the map is fine) and save it as `public/images/map-<id>-480/800.webp`. **No iframe in the initial HTML.** Tapping swaps in the Google Maps iframe: `loading="lazy"`, `title="Map of <fullName>"`, `referrerpolicy="no-referrer-when-downgrade"`, and `src` = the salon's `mapEmbedUrl`.
  - Check `mapEmbedUrl` in `branches.ts` points to the exact GBP listing (the cid-based embed `https://maps.google.com/maps?cid=<cid>&output=embed`, or the existing query form if that renders the right pin). Verify each one opens the correct listing.
- **Layout:**
  - **Mobile:** 3 tabs (Sarjapur Road · HSR Layout · Brookfield) above one map. Under the map: the `SalonNap` block, plus Call · WhatsApp · **Directions** (`dir/?api=1&destination=<lat>,<lng>`) · "View on Google" (`mapsUrl`).
  - **Desktop:** the map on the left, the 3 salon cards on the right.
- **No Maps JavaScript API and no API key.** Plain embed only.
- **Tracking:** `map_open` with `branch`.
- `perf-budget` must still pass for `/` (the facade images are lazy).

## 5. Step 4: NAP in header and footer

- **Footer:** the 3 `SalonNap` blocks on every page, in salon order (already built; the checker verifies them).
- **Desktop utility bar** (≥ 1024 px only, 32 px tall, above the main header): "Sarjapur Road +91 89700 07440 · HSR Layout +91 93808 12348 · Brookfield +91 79966 66012 · Open daily". Every value comes from `locations` (never typed), and each phone is a `tel:` link. It's hidden on mobile, so it uses no phone space (mobile has the sticky bar). It must not add layout shift.
- **Header on a salon page:** that salon's call button and WhatsApp (already built).
- Structured data and visible NAP stay identical. The `consistency-audit` and `gbp.test.ts` already enforce this; keep them green.

## 6. Step 5: blogs that serve SEO, AEO and GEO

**A. Upgrade the template** (`src/pages/blog/BlogPostPage.tsx` + `src/blog/build.ts`). Every post gets:
- breadcrumb → H1 → byline ("By the Xing team · Reviewed by a Xing senior stylist", with a `// OWNER: real stylist names` TODO; never invent names) + "Updated <date>" + read time
- a "Key takeaways" box (3 bullets, from front matter `takeaways:`)
- the body, with question-style H2s, each opening with a direct answer of ≤ 40 words
- a comparison table where the topic compares options
- a "Get this at Xing" box: the related service, CTA buttons, and "Available at Sarjapur Road, HSR Layout and Brookfield" with links
- the FAQ (`FAQPage`)
- related posts (3, same category), and the prev/next post

Schema: `BlogPosting` with `headline`, `description`, `image` (1200×630 OG crop), `datePublished`, `dateModified`, `author` (`Organization` `/#organization`, or a `Person` once real names exist), `publisher`, `mainEntityOfPage`, `about` (the service `@id`), `mentions` (the salon `@id`s when salons are named) and `inLanguage` `en-IN`.

**B. Check the existing 50 posts** with a script. List the posts missing: `takeaways`, ≥ 3 question H2s, the FAQ (4–6 Qs), the local paragraph, ≥ 2 service links, ≥ 2 post links, or a description of 120–155 characters. Then fix them in the Markdown:
- **Add** what's missing, written from that post's own content plus facts from data.
- Don't rewrite whole posts, and don't change their slugs.
- Update `updatedDate` only on posts you change.
- Keep the publish schedule: 15 posts are live in Oct, and 35 are scheduled through Jan 2027 (`publishDate`). The scheduled posts appear automatically on rebuild. Check the README documents the daily rebuild.

**C. Write 8 new posts for local and conversational searches** (`draft: true`, owner reviews before publishing). Choose them from `seo-keyword-map.md` gaps: questions people ask that no page owns yet. Example angles, all answerable with facts already in the data:
- "Salon near Kasavanahalli for hair colour: what to expect at Xing Sarjapur Road"
- "Keratin near HSR Layout: how long it takes and how long it lasts"
- "Unisex salon near Whitefield and Kundalahalli: services at Xing Brookfield"
- "Global colour vs highlights for Indian hair: cost, upkeep, time"
- "How to prepare for your first balayage"
- "Bridal hair trial timeline in Bangalore"
- "Men's grooming routine between salon visits"
- "Kids' first haircut in Bangalore: a parent's checklist"

Each post: 900–1,400 words, the full template above, 1 primary long-tail keyword, entity-rich (salon areas, landmarks, techniques and products already named on the site), no prices except live offers (`formatPrice`), and no invented statistics or sources. Wherever a factual claim needs a source and you can't link a reputable one, soften the claim instead. Use the existing blog front-matter format and images (`public/og/blog/`), or reuse service photos with new alt text.

**D. Blog hub** `/blog`: category filter chips (the fixed list), "Latest" + "Most useful" (manually pinned in front matter `featured: true`), and `ItemList` schema of the visible posts.

## 7. Step 6: core-page polish for items 13–16

- **FAQ coverage:** the checker lists every core page without a visible FAQ + `FAQPage`. Add 4–6 Qs per page from that page's facts. Answers are 40–60 words, answer first, self-contained (they repeat the subject), and identical to the schema.
- **H1s (item 14):** for each FAIL, adjust the H1 to "primary keyword + geo" (for example "Keratin Treatment in Bangalore", "Premium Unisex Salon in HSR Layout, Bangalore"). Keep it ≤ 60 characters, and keep the visible design: a short visual line plus a visually hidden suffix is allowed only if the hidden part is a natural continuation, never keyword stuffing.
- **CTAs (item 15):** add `data-cta="<name>"` to every CTA through the shared `Button`/link components (needed for GTM triggers). Labels come only from `CTA`.
- **Copy (item 16):** where the checker reports a page missing Quick answers, question H2s, named entities or a quotable fact, add them from existing data. Write conversationally ("Wondering how long keratin lasts? Usually 3–5 months…") but factually, in Indian English, with no superlatives that lack a source.

## 8. Step 7: final verification, then report

1. Run all the scripts: build, test, `seo:audit`, `mobile:audit`, `consistency:audit`, `perf:budget`, `seo:checklist`. **Every item is PASS or MANUAL, with 0 FAIL.** Save the output to `reports/seo-checklist/<date>/after.txt`. Check that the project root still matches the clean layout from A6: no new report files, screenshots or stray media.
2. Run Lighthouse mobile on the 12 page types **with test tag IDs set** (`VITE_GTM_ID=GTM-TEST000` and so on, network requests to Google blocked in the run so they don't distort it). Targets as in item 18. Update `seo-cwv.md`.
3. Paste each of these into the Schema Markup Validator's code tab and fix any errors: the JSON-LD of `/`, one salon page, one service page, one blog post, `/offers/november` and `/faq`. (Copy the JSON from the prerendered HTML; no network calls from scripts.)
4. **README.md:** add a section **"SEO / AEO / GEO checklist"** with:
   - the 20-item table: what implements each item and how to check it (`npm run seo:checklist`)
   - **"Analytics & tags"**: the env vars, consent behaviour, the event table, and how to test with GTM Preview
   - **"Map section"**
   - **"Writing a blog post"**: the front-matter fields, the template parts and the checklist
   - a dated **Change log** line
5. Reply with ONLY:
   - **cleanup:** before → after for project size (without `node_modules`), `.git` size, root file count, `public/images` count and `public/` MB; what was moved to `../xing-media-originals/`; whether history was rewritten or skipped
   - the files changed (one line each)
   - the checklist before → after (counts)
   - the Lighthouse table
   - the **Part M** list below, unchanged

## Part M: manual steps for the owner (the agent lists these and doesn't attempt them)

1. **Deploy** the new build, then check HTTPS works and `http://xingsalons.com` → `https://www.xingsalons.com` redirects. The SSL certificate is issued by the host (Netlify/Cloudflare/your server: enable "Force HTTPS").
2. **Google Search Console:** add a Domain property for `xingsalons.com` and verify it by DNS TXT, or put the HTML-tag token in `VITE_GSC_VERIFICATION` and rebuild. Submit `https://www.xingsalons.com/sitemap.xml`. Use URL Inspection → Request indexing for `/`, `/offers/november`, the 3 salon pages and `/services`.
3. **Google Tag Manager:** create a container and put its ID in `VITE_GTM_ID`. In GTM, add:
   - a GA4 Configuration tag (your `G-` ID)
   - GA4 Event tags triggered by the custom events in the Step 2 table
   - the Microsoft Clarity tag
   - Consent Mode (built-in consent checks)

   Publish, then test with GTM Preview.
4. **Google Analytics 4:** create a property and a web data stream for `https://www.xingsalons.com`. Mark `generate_lead` as a **key event**. Link GA4 to Search Console.
5. **Microsoft Clarity:** create a project for the site. Install it through GTM, or put the ID in `VITE_CLARITY_ID`. In Clarity settings, turn masking to "Strict" and enable the Consent API.
6. **Bing Webmaster Tools:** import from Search Console, then run `node scripts/indexnow.mjs` after each deploy.
7. **Google Business Profiles:** set each website field to `https://www.xingsalons.com/salons/<id>`, fix the Brookfield "Brookefield" typo, and confirm the Brookfield phone (see `GBP_CONSISTENCY_PROMPT.md` Part D).
8. **Legal:** review `/privacy` and the consent wording, then decide `VITE_CONSENT_REQUIRED`.
9. **Content:** add real stylist names for blog bylines (`content.ts`), and review and publish the 8 new draft posts.
10. **Your original photos and videos** are now in `Desktop/xing-media-originals/`. Back that folder up (Google Drive or an external disk). It's no longer inside the website project.
11. **Git history:** if you agreed to the history rewrite, re-clone the repo on any other computer. If you didn't, the old screenshots stay in GitHub's history. That's harmless; it only uses space.