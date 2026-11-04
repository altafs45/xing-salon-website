# Prompt: technical SEO + indexing for xingsalons.com (all pages)

> Paste everything below the line into your coding agent from the project root (`xing salon 1`).
> Run it **after** `SALON_ORDER_NAV_FAQ_PROMPT.md` and `NOVEMBER_OFFERS_PROMPT.md`, so it audits the final pages.
> Some steps can only be done by you (domain, hosting, Google Search Console). They are in **Part C**.

---

You are fixing technical SEO on an existing Vite + React 18 + TypeScript multi-page site for XING Premium Unisex Salon (`site.url` = `https://www.xingsalons.com` in `src/data/content.ts`). **Accuracy matters more than speed. Measure first, change only what a measurement shows is wrong, and re-measure after every change.** Don't redo things that already work.

## Ground rules (follow every one)

1. **Work through the audit script, not by reading files.** Build once, run `scripts/seo-audit.mjs` (Step 1), and fix only what it reports. Open source files only at the line ranges a finding points to (`grep -n`, `sed -n a,bp`).
2. **Never open** `node_modules/`, `dist/` (except through the audit script or `grep`), `server-dist/`, photo/video folders, or `package-lock.json`. Never print whole HTML files.
3. **Don't change a live URL.** Every slug change needs a 301 in `redirects` (`src/data/services.ts`), which feeds both `dist/_redirects` and `server/app.ts`. Existing slugs are already clean. Leave them unless the audit flags one.
4. **Don't invent facts** (prices, addresses, ratings, review counts, opening hours). Schema and meta use only data that's already in `src/data/*`.
5. Keep the existing architecture: `src/data/seo.ts` (meta + JSON-LD per page), the `seoPlugin` in `vite.config.ts` (writes one HTML file per route + `sitemap.xml` + `robots.txt`), and `SHELLS` (first-paint markup).
6. After each step: `npm run build && node scripts/seo-audit.mjs`. A step is done when its check has **0 errors**. Commit after each step: `git add -A && git commit -m "seo: <step>"`.

## What an audit of the current build found (start from here)

| Area | Current state | Action |
|---|---|---|
| sitemap.xml | Built automatically; 56 URLs; 404 and drafts excluded | Keep. Fix `lastmod` (Step 6) |
| robots.txt | `Allow: /` + Sitemap line | Add `Disallow: /api/` (Step 6) |
| noindex | Only on the 404 page (correct) | Make sure the blog-preview build is noindexed everywhere (Step 6) |
| canonical, title, description, OG, JSON-LD | Present on every real page | 15 titles > 60 chars and 9 descriptions > 155 chars: shorten them (Step 3) |
| **Body content in HTML** | **119 of 129 HTML files have no `<h1>` and no body text. Content only appears after JavaScript runs.** | **Most important fix: prerender (Step 2)** |
| Duplicate files | Every page is written as both `x.html` and `x/index.html` | One URL form only (Step 7) |
| 16 old slugs | Meta-refresh HTML stubs plus 301s in `_redirects` | Keep the 301s. Stubs must not be in the sitemap (they aren't) |
| Images | 407 files, 15 MB, none over 300 KB | Small win: check sizes and dimensions (Step 5) |
| Videos | 33 MB | Must never load before they're needed (Step 5) |
| Search verification | No verification tag; Google doesn't show the site | Part C |

## Step 1: build an audit script (one file, compact output)

Create `scripts/seo-audit.mjs` (Node, no new dependencies; regexes or `node-html-parser` as a devDependency if needed). It reads `dist/sitemap.xml` and every `dist/**/*.html`, and prints **one line per problem** (`ERROR|WARN  <url>  <check>  <detail>`), then a summary count. Exit code 1 on any ERROR. Checks:

- **Indexing:** every sitemap URL has an HTML file; `<meta name="robots">` is `index,follow` (only `/404` noindex); canonical = absolute `https://www.xingsalons.com` + path, matches its own sitemap URL exactly, no trailing slash, no query string; no sitemap URL redirects (meta refresh) or is noindexed.
- **Meta:** `<title>` 30–60 chars and unique across indexable pages; description 70–155 chars, unique; `og:title`, `og:description`, `og:image` (absolute URL, file exists in `dist/`), `og:url` = canonical, `twitter:card`; `<html lang="en-IN">`; `<meta name="viewport" content="width=device-width, initial-scale=1">` with no `maximum-scale`/`user-scalable=no`.
- **Content (after Step 2):** exactly 1 `<h1>`; no skipped heading levels (h2→h4); ≥ 150 words of visible text inside `#root`.
- **Images:** every `<img>` has `alt` (`alt=""` allowed only with `aria-hidden` or `role="presentation"`), has `width` + `height`, and its `src` exists in `dist/`. Below-the-fold images have `loading="lazy"`; the LCP/hero image has **no** `loading="lazy"` and has `fetchpriority="high"`. WARN for alt text longer than 125 chars, or containing "image of" or "photo of".
- **Links:** every internal `href` (starting with `/` or the site URL) resolves to a sitemap URL, a `redirects` source, a real file in `dist/` (e.g. a PDF), or an existing `#id` on the target page. Flag `href="#"`, empty hrefs, `javascript:` links, links to redirected URLs (link straight to the final URL instead), and internal links using `http://` or a non-www host. External links: just list them, so a human can check them. No network calls.
- **Internal linking:** report pages with fewer than 3 incoming internal links (orphans) and pages with fewer than 3 outgoing links to other indexable pages.
- **Schema:** every `application/ld+json` block parses; every page has `BreadcrumbList` (except home); `FAQPage` questions match visible FAQ text; no `AggregateRating`/`Review` on pages that aren't about the salon itself; salons are `HairSalon`/`BeautySalon` with the address, geo, phone and opening hours from `branches.ts`; blog posts are `BlogPosting` with `datePublished`/`dateModified`/`author`/`image`.
- **Weight:** WARN for any page whose HTML is > 150 KB, any image > 200 KB, and any JS chunk preloaded on a page that it doesn't use.

Add `"seo:audit": "node scripts/seo-audit.mjs"` to `package.json`. Run it and save the output to `seo-audit-before.txt`. This is your work list.

## Step 2: prerender real HTML for every page (the main indexing fix)

Right now Google has to run JavaScript to see any content. Many pages get crawled but are never indexed for this reason. Fix it with a **post-build prerender** that uses the Playwright already installed on this machine (add `playwright` as a devDependency if `require('playwright')` fails; install only `chromium`):

1. New `scripts/prerender.mjs`: start `vite preview` (or a tiny static server over `dist/`) on a free port. For every URL in `dist/sitemap.xml` **plus** `/404`, open it at 1280×900 with `?prerender=1`, wait for `networkidle` and for `document.querySelector('h1')`, then take `document.querySelector('#root').innerHTML`. Write it into that page's HTML file inside the empty `<div id="root"></div>`. Change only that element; keep the `<head>` the SEO plugin wrote, byte for byte. Run up to 4 pages at once. Fail the build if any page has no `<h1>`.
2. **Disable animations while prerendering**: when `?prerender=1` (or `navigator.webdriver`) is set, `MotionConfig reducedMotion="always"` in `App.tsx`, and `Reveal`/scroll-in components render their final visible state. Otherwise the snapshot captures `opacity:0` content, which Google treats as hidden. No popup, no booking modal, no cookie or offer sheet in the snapshot. Also skip anything that's random or depends on the time of day (the open-now chip renders a neutral "Open daily 10 AM – 9:30 PM").
3. In `src/main.tsx`: if `#root` already has children, use `hydrateRoot`, otherwise `createRoot`. If hydration gives mismatch warnings you can't fix cleanly, keep `createRoot` (it replaces the same markup) but make sure there's no layout shift. Check that CLS stays < 0.1 in Step 8.
4. Make sure the existing `SHELLS` (membership hero) are replaced by the full prerendered markup and not duplicated.
5. Wire it in: `"build": "tsc --noEmit && vite build && node scripts/prerender.mjs"`. Keep `build:preview` working.
6. Check: the audit shows 1 `<h1>` and ≥ 150 words on every page; `curl -s localhost:4173/services/keratin-treatment | grep -c "<h2"` is > 0 **with JavaScript off**.

## Step 3: titles, descriptions, H1s and heading levels

- Shorten the 15 titles > 60 chars and the 9 descriptions > 155 chars **in their data files** (`seo` objects in `content.ts`, `offersPage.ts`, `branchPages/*.ts`, `src/data/pages/*.ts`, `seo.ts` for blog/salons). Pattern: `Primary keyword in Bangalore | Benefit – Xing` (≤ 60). Descriptions: answer + location + action, ≤ 155, containing the main keyword once. Every title and description must be unique. Keep the salon order Sarjapur Road → HSR Layout → Brookfield wherever all three are listed.
- **One H1 per page**, matching the page's main keyword (the hero heading). Every other big heading becomes an `h2`, with `h3` inside sections. Make the change in shared components (`SectionHeader`, `HeroSplit`, card titles) so it fixes every page at once. Card titles inside a section with an h2 are `h3`. Don't use headings just for styling: decorative eyebrows become `<p>`.
- Don't change the visible wording of the H1s on the home page or service pages unless the audit flags a duplicate.

## Step 4: schema, internal links and broken links

- Fix every schema error the audit reports in `src/data/seo.ts` (shared helpers, not per-page patches). Make sure there's: an `Organization` with `@id` `${site.url}/#organization`, logo `brand/logo-square-512.png` and `sameAs` (Instagram/Facebook/GBP links only if already in `content.ts`); 3 `HairSalon` nodes with stable `@id` `${site.url}/salons/<id>#salon` in Sarjapur → HSR → Brookfield order; a `WebSite` node; `Service` on service pages; `BlogPosting` on posts; `BreadcrumbList` everywhere except home; `FAQPage` only where the FAQ is visible.
- **Internal links:** fix every orphan and weakly linked page the audit reports, using shared components rather than hand edits. Each service page links to its category, 2–4 related services, 2–3 related blog posts and the 3 salon pages. Each blog post links to 1–3 service pages + 2 related posts. Each salon page links to its top 6 services and `/offers`. The footer links to `/services`, `/offers`, `/salons/*`, `/blog`, `/faq` (if it exists) and `/about`. Anchor text is descriptive ("keratin treatment in Bangalore"), never "click here".
- **Broken links:** fix every link the audit flags at its source. Links to redirected URLs point straight at the final URL.

## Step 5: images and video

- Run a script that lists every image in `public/images` with its pixel size and KB, alongside the largest size it's ever **displayed** at (taken from `sizes`/the CSS width in the components that use it). Re-encode only images that are > 200 KB **or** more than 2× wider than their largest display size: WebP q≈78, using `npx --yes sharp-cli`. Keep file names unchanged so no code changes are needed. Don't touch images that are already fine.
- Every `<img>` gets `width`/`height` (or `aspect-ratio`) to prevent layout shift; `srcSet` + `sizes` where an `-480` variant exists; `decoding="async"`; `loading="lazy"` below the fold. Hero/LCP image: preloaded through `PageMeta.preload` (this already exists; check every page type has it) with `fetchpriority="high"`.
- **Alt text**: fix what the audit flags at the data source (`img(...)`, `photo(...)`, `work(...)`, `pair(...)` entries). Describe what's in the photo plus the service, and add the location only where it's natural ("Caramel balayage on long wavy hair at Xing Salon, HSR Layout"). Purely decorative SVGs/images get `alt=""` + `aria-hidden="true"`.
- **Videos**: `preload="none"`, poster image set, no autoplay until in view (IntersectionObserver), muted + `playsinline`. Check no video bytes download on first load of any page (Step 8 network check).
- OG images: every page type already has one in `public/og/`. Check each is 1200×630, under 300 KB, has no prices, and is referenced with its absolute URL + `og:image:width/height/alt`. If a page type is missing one, make it from an existing photo in the same style.

## Step 6: sitemap, robots and noindex

- **sitemap.xml**: indexable canonical URLs only, no trailing slash. `lastmod` = the real last content change, not the build date: `updatedDate` for blog posts; for other pages, the latest `git log -1 --format=%cs -- <its data file>`, falling back to the build date only if git isn't available. Add an image sitemap entry (`<image:image>`) for each page's hero image. When future-dated blog posts go live, they must appear automatically. Check that a scheduled rebuild (e.g. daily) exists or document that one is needed (README).
- **robots.txt** (`public/robots.txt`): `User-agent: *`, `Allow: /`, `Disallow: /api/`, plus the auto-added `Sitemap: https://www.xingsalons.com/sitemap.xml`. Don't block JS, CSS, `/images` or `/assets`.
- **noindex**: only `/404` and old-slug redirect stubs (add `noindex` to the stubs too). A `--mode blogpreview` build must write `noindex,nofollow` on **every** page **and** a `Disallow: /` robots.txt, so a preview deploy can never be indexed. Add a test for this.

## Step 7: HTTPS, one URL form, headers

Detect the host from the repo (`dist/_redirects` → Netlify/Cloudflare Pages; `server/app.ts` → Express behind a proxy). Do both, so either host works:

- **One canonical form**: `https://www.xingsalons.com/<path>`, no trailing slash, no `.html`. 301 these to the canonical form: `http://` → `https://`, the bare `xingsalons.com` → `www`, `/path/` → `/path`, `/path.html` → `/path`, and `/index.html` → `/`. For a static host, use `_redirects` rules (forced `!` where supported). For Express, use middleware before static serving that reads `x-forwarded-proto`/`host`. Write only one HTML form per page if the host allows it (`path/index.html` for Netlify/CF, or keep both only if the Express server needs them), and make sure the other form is never reachable without a 301.
- **Headers** (`public/_headers` for a static host, plus the same rules in Express): `Strict-Transport-Security: max-age=31536000; includeSubDomains` (add `preload` only after the owner confirms every subdomain is HTTPS), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Cache-Control: public, max-age=31536000, immutable` for `/assets/*`, `/fonts/*` and hashed files; `max-age=604800` for `/images/*`, `/videos/*`, `/og/*`; `no-cache` for HTML, `sitemap.xml` and `robots.txt`.
- **Mixed content**: `grep -rn "http://" src content index.html public/*.webmanifest`. Every link to your own pages and assets must use `https`.
- Extend `tests/static.test.ts` to cover the Express redirects (proto, host, trailing slash, `.html`) and the headers.

## Step 8: Core Web Vitals + mobile

- Targets on **mobile** (Moto G-class throttling): LCP < 2.5 s, CLS < 0.1, INP < 200 ms, Lighthouse Performance ≥ 90, SEO = 100, Accessibility ≥ 95, Best Practices ≥ 95.
- Measure with `npx --yes lighthouse <url> --preset=perf --form-factor=mobile --quiet --output=json` (and `--only-categories=seo,accessibility,best-practices` once) against `npm run preview`, on **one page of each type**: `/`, `/services`, `/services/hair-care`, `/services/keratin-treatment`, `/salons/sarjapur-road`, `/offers`, `/membership-gift-cards`, `/blog`, one blog post, `/about`. Print only the 4 metrics, the scores and the top 3 opportunities per page. Save the before/after table to `seo-cwv.md`.
- Usual fixes, applied only where Lighthouse points: preload the hero image and the 1–2 self-hosted fonts in `public/fonts` (`font-display: swap`, `size-adjust`/fallback metrics to avoid shifts); defer the offer popup and booking modal (already lazy, so check); keep framer-motion out of the critical path on pages that don't animate above the fold; give carousels/reels fixed boxes; no layout-shifting banners; long tasks under 50 ms on tap (INP).
- **Mobile**: with Playwright, at widths 360, 390, 768, 1024 and 1280, load every page type and check that `document.documentElement.scrollWidth <= innerWidth` (no sideways scroll), that no text is smaller than 12 px, that tap targets are ≥ 44×44 px (also check `MobileStickyBar` and the nav drawer), and that the fixed bottom bar doesn't cover the last CTA or the footer. Fix in shared components. Report any page that still fails.

## Step 9: final verification (all must pass before you report)

1. `npm run build && npm test && npm run seo:audit` → 0 ERRORs. Save the output to `seo-audit-after.txt`.
2. View the prerendered HTML of 5 page types with JavaScript off: H1, body text, links and images are present.
3. `grep -c "<loc>" dist/sitemap.xml` equals the number of indexable pages the audit counted; spot-check 5 `<loc>` URLs with `curl -sI` against `npm start` (Express): 200, with the right headers. Old slugs → 301 → 200.
4. Lighthouse table in `seo-cwv.md` meets the targets, or each miss is listed with its reason.
5. **README.md**: add an "SEO & indexing" section covering: how pages are prerendered; `npm run seo:audit`; where titles/descriptions/schema live; the URL rules (https, www, no trailing slash, redirects through `redirects`); headers; how to add a page without breaking SEO (a 6-line checklist); the need for a daily rebuild for scheduled posts; the Search Console steps from Part C. Add a dated line to the **Change log**.
6. Write `SEO_BACKLINKS.md` (Part B).
7. Reply with ONLY: the files changed (one line each), the before→after audit counts, the Lighthouse table, and the items left for the owner.

## Part B: write `SEO_BACKLINKS.md` (a plan, no code)

Use only facts from the repo (salon names, addresses, phone numbers, services, sister sites `xingtattoo.in` and `xingfitness.in`). Sections:

1. **NAP consistency table**: the exact Name / Address / Phone for each salon (Sarjapur Road → HSR Layout → Brookfield), copied from `branches.ts`, to be used identically everywhere.
2. **Google Business Profiles (biggest lever for "salon near me")**: one per salon; website link → its `/salons/<id>` page with `?utm_source=google&utm_medium=organic&utm_campaign=gbp` (the canonical removes the query); categories (Hair salon, Beauty salon, Nail salon); services list; weekly photo posts; posts for every offer; a plan for asking for reviews and replying to them. Never offer incentives for reviews.
3. **Citations, priority order**: Justdial, Sulekha, Magicpin, Fresha/Booksy (if used), Bing Places, Apple Business Connect, Facebook, Instagram bio, LinkedIn page, Yelp India. Mark each with "who logs in" and the NAP to use.
4. **Relationship links (earned, not bought)**: the sister sites (`xingtattoo.in`, `xingfitness.in`) link to the salon with natural anchor text, both ways, in the footer + about page. Professional brand salon locators (only brands the salon actually uses, e.g. Olaplex, L'Oréal Professionnel; owner to confirm). Bangalore lifestyle and local media pitches (LBB, Curly Tales, Whitefield/HSR community pages, RWA newsletters), with 3 story angles based on real offers and services. Bridal directories (WedMeGood, ShaadiSaga). Neighbourhood partnerships (gyms, cafés, co-working spaces near each salon). Guest expert posts using the blog topics.
5. **Content that earns links**: 3 linkable assets drawn from the existing blog (e.g. "Hard water and hair in Bangalore", the colour-for-Indian-skin-tone guide), and who to pitch each to.
6. **Avoid**: paid link packages, PBNs, link exchanges at scale, fake reviews, keyword-stuffed anchors. Each one risks a Google penalty.
7. **Monthly tracker**: a table (month · links earned · GBP reviews per salon · Search Console clicks/impressions · top queries).

## Part C: only the owner can do this (the agent lists it in the README; it can't do it itself)

1. **Make sure the site is actually live** at `https://www.xingsalons.com`. A web search for the domain shows nothing indexed yet. Deploy the new `dist/` (or the `npm start` server), point DNS at it, and check that HTTPS works, including `http://xingsalons.com` → `https://www.xingsalons.com`.
2. **Google Search Console**: add a **Domain property** for `xingsalons.com` and verify it with the DNS TXT record at your domain registrar. That's the most reliable method and needs no code. If you'd rather use the HTML-tag method, give the agent the token: the site reads `VITE_GSC_VERIFICATION` and writes `<meta name="google-site-verification">` only when it's set (the agent adds this env hook).
3. Submit `https://www.xingsalons.com/sitemap.xml` under Sitemaps.
4. URL Inspection → **Request indexing** for `/`, `/services`, `/offers` and the 3 salon pages (there's a small daily quota; do the rest over a few days).
5. **Bing Webmaster Tools** → import from Search Console (this also covers ChatGPT/Copilot search).
6. Link each Google Business Profile's website field to its salon page (Part B §2).
7. After 7–14 days, check Search Console → Pages ("Why pages aren't indexed") and send the agent any reasons listed there.
