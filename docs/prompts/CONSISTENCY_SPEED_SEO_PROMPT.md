# Prompt: site-wide consistency + mobile speed + SEO, AEO and GEO (final polish pass)

> Paste everything below the line into your coding agent from the project root (`xing salon 1`).
> Every earlier prompt has already run (SEO, GBP, offers). This prompt **builds on their scripts and tests; it doesn't redo them.** Stop the dev server and any other agent first.

---

You are polishing an existing Vite + React 18 + TypeScript + Tailwind + Framer Motion multi-page site (XING Premium Unisex Salon, 3 Bangalore salons). Pages are prerendered (`scripts/prerender.mjs`), and audits already exist: `scripts/seo-audit.mjs`, `scripts/mobile-audit.mjs`, plus tests in `tests/`. Your job:

1. **Consistency**: one voice, one vocabulary, one format, one page structure, everywhere.
2. **Mobile speed**: meet a hard performance budget on every page type.
3. **SEO, AEO and GEO**: make every page easy for Google, answer engines and AI assistants to understand, quote and cite.

**Always measure first, change only what a measurement flags, then re-measure.**

## 0. Baseline (measured on 31 Oct; start from here)

**Lighthouse mobile, simulated throttling** (from `seo-cwv.md`). Format: Performance score · LCP:

| Page | Score · LCP | Page | Score · LCP |
|---|---|---|---|
| `/` | 78 · 5.8 s | `/salons/sarjapur-road` | 82 · 4.9 s |
| `/offers` | 81 · 5.3 s | `/services/keratin-treatment` | 86 · 4.2 s |
| `/blog` | 87 · 4.1 s | `/about` | 90 · 3.6 s |

The top opportunities were "Reduce unused JavaScript", "Reduce unused CSS", "Render-blocking requests" and "Improve image delivery".

**Weight:**

| What | Size |
|---|---|
| Main JS chunk (`dist/assets/index-*.js`) | **440 KB** raw, loaded on every page |
| Other large chunks | 136 KB and 124 KB (`LeadFormSheet`) |
| CSS | 80 KB, render-blocking |
| Modulepreloads on `/` | 18 |
| Font files | 7 (Poppins 300/400/500/600, Cormorant ×2, Great Vibes, which is used only 3×) |
| Prerendered HTML | `/` **356 KB with 85 `<img>`**, `/salons/hsr-layout` 172 KB, `/offers/november` 136 KB, `/services/keratin-treatment` 136 KB |
| Media | `public/images` 17 MB, `public/videos` 33 MB |

**Inconsistencies, counted in `src` + `content`:**

| Topic | Variants found (count) |
|---|---|
| Brand in copy | "Xing" 614 · "XING" 216 · "Xing Salon" 130 · "Xing Premium Salon" 64 · "XING Salon" 32 · "Xing Salons" 2 |
| City | "Bangalore" 395 · "Bengaluru" 42 |
| Spelling | "colour" 1,403 · "color" 277 ("hair colour" 240 vs "hair color" 76) |
| WhatsApp casing | "Whatsapp" 25 (wrong) |
| CTA labels | "Book Appointment" · "Book a Slot/slot" · "Book now" · "Book Your Visit" · "Chat on WhatsApp" · "WhatsApp us" · "Claim Offer" · "Claim on WhatsApp" |
| Time formats | "9:30 PM" and "9:30pm/p.m." styles mixed |

## 1. Rules (follow every one)

1. **Reading budget.** Never open `node_modules/`, `dist/` (use scripts or `grep`), `server-dist/`, media folders or `package-lock.json`. Read source only at line ranges (`grep -n`, `sed -n`). All findings come from scripts that print **one line per problem**.
2. **Fix at the source, once.** Fix data files (`src/data/*`, `content/blog/*.md`) and shared components. Never patch the same thing page by page.
3. **Never change:**
   - facts: prices (only `novemberCampaign`/`offers.ts`), salon names, addresses, phones and hours (only `branches.ts`, which matches the GBP and is locked by `tests/gbp.test.ts`), ratings
   - live URLs (slugs that contain "color" stay as they are)
   - FAQ meaning
   - the salon order Sarjapur Road → HSR Layout → Brookfield
4. **Keep existing guarantees green:** `npm test`, `seo-audit`, `mobile-audit`, prerender (1 H1 per page), the no "50%"/"40%" rule and the GBP fixture.
5. After every step: `npm run build && npm test && npm run seo:audit && npm run mobile:audit && npm run consistency:audit && npm run perf:budget`. Fix every ERROR. Commit per step: `git add -A && git commit -m "polish: <step>"`.

## 2. Style decisions (apply these; they become `CONTENT_STYLE.md` and `src/data/style.ts`)

| Topic | Rule | Wrong examples to fix |
|---|---|---|
| Brand, short | **Xing** (title case) in all copy, headings, alt text and meta | XING, Xing Salons |
| Brand, full | **Xing Premium Unisex Salon**. A specific salon's full name is the exact GBP name from `branches.ts` (`fullName`) | Xing Premium Salon, XING Salon |
| Logo | The "xing" wordmark is an image only. Its alt text is "Xing Premium Unisex Salon" | — |
| Title suffix | ` – Xing Salon` (en dash). Keep the existing title if adding the suffix would push it past 60 chars | `| XING`, `- Xing Premium Salon` |
| City | **Bangalore** in copy, titles and descriptions. **Bengaluru** only in postal addresses and schema `addressLocality` | mixed use in sentences |
| Spelling | Indian/British English: colour, personalised, centre, favourite, programme. URL slugs keep "color"; use "Hair Colour" in visible text | color, personalized in copy |
| Salon labels | Sarjapur Road · HSR Layout · Brookfield (short). Full names come from `fullName` | Sarjapura Road (short), HSR, AECS (alone) |
| WhatsApp | WhatsApp | Whatsapp, whatsapp, WA |
| Primary CTA | **Book Appointment** (opens the booking form) | Book now, Book a slot, Book Your Visit |
| WhatsApp CTA | **Chat on WhatsApp**; on offers: **Claim on WhatsApp** | WhatsApp us, Message us |
| Offer CTA (card) | **Claim Offer** | Claim, Get offer |
| Other CTAs | Call · Directions · View Details · See All Services / Offers / Articles | Learn More (alone), Click here |
| Headings | Title Case for H1/H2 statements; sentence case ending in "?" for question headings; H3 sentence case. No full stop at the end | mixed |
| Times | `10 AM – 9:30 PM` (space before AM/PM, en dash with spaces); single times `9:30 PM` | 9:30pm, 9.30 p.m., 10am-10pm |
| Durations / ranges | `1.5–2 hours`, `8–10 streaks` (en dash, no spaces) | 1.5 - 2 hrs |
| Money | `₹3,999` (Indian grouping, no space, no decimals). Always use `formatPrice()` | Rs. 3999, ₹ 3999, INR |
| Phone | `+91 89700 07440` (from `branches.ts` only) | 089700 07440, 8970007440 in text |
| Rating | `4.8 ★ · 2,550+ Google reviews` (always the `ratingLabel()` helper) | hand-typed numbers |
| Dates | `30 Nov 2026` in UI, `30 November 2026` in prose, ISO in schema | Nov 30th, 30/11 |
| Numbers | Digits for 10 and above and for all measurements; words for one to nine in prose | — |
| Emoji | None in body copy, headings or meta | — |

Create `src/data/style.ts`, exporting `BRAND`, `BRAND_FULL`, `CITY`, `CTA` (all labels above) and `TITLE_SUFFIX`. Every component and data file uses `CTA.book`, `CTA.whatsapp`, and so on, never a typed label. Write `CONTENT_STYLE.md` (one page: the table above plus 5 "do / don't" pairs) for future writers.

## 3. Step 1: the consistency audit `scripts/consistency-audit.mjs`

The script is Node with no new dependencies. Add `"consistency:audit": "node scripts/consistency-audit.mjs"`. It scans **source** (`src/data/**/*.ts`, `src/components/**/*.tsx`, `src/pages/**/*.tsx`, `content/blog/*.md`) and the **built HTML** (`dist/**/*.html`, visible text only, with `<script>`/`<style>` stripped). It prints `ERROR|WARN <file or url> <check> <detail>`, then counts per check. Exit code 1 on any ERROR.

**Checks:**
- **Vocabulary (ERROR):** every wrong form in the style table; regexes are defined in `style.ts` so the rules live in one place. URLs, slugs, `import` paths, CSS classes and the GBP `fullName` strings are allowlisted.
- **CTA labels (ERROR):** any `<a>`/`<button>` text in `dist` that is a CTA but not in `CTA` values.
- **Facts (ERROR):**
  - any phone, address fragment, hours string or rating number in `dist` that isn't produced from `branches.ts`/`content.ts` (compare with the GBP fixture in `tests/fixtures.ts`)
  - any ₹ amount in `dist` that isn't in `offers.ts`
  - any percentage that doesn't equal `savingPercent()` of a known line
- **Duplicate content (WARN, ERROR if ≥ 3 pages):** the same sentence of 12+ words on more than one indexable page, excluding the footer, nav, NAP block and legal text. List the pages. Fix each one by keeping it on the most relevant page and rewriting or removing it elsewhere.
- **Titles, H1s, descriptions (ERROR):** duplicates across pages; titles not matching the suffix rule; an H1 that doesn't contain the page's primary keyword from the keyword map (Step 5).
- **Headings (WARN):** casing rule violations, trailing full stops, headings over 70 characters.
- **Alt text (WARN):** identical alt on different images, alt equal to the file name, and "image of"/"photo of".
- **Anchor text (WARN):** internal link text "click here", "here", "read more" without context; and the same anchor text pointing to two different URLs.
- **UI consistency (WARN, from built CSS classes):**
  - more than 3 distinct primary button class sets
  - more than 4 distinct section vertical paddings
  - more than 3 distinct card border radii
  - heading font sizes outside the type scale in `tailwind.config.ts`

  The fixes go in shared components (`ui/Button`, `service/SectionHeader`, `Section`).

Save the first run to `consistency-before.txt`. Fix in this order: facts → vocabulary/CTA → duplicates → titles/H1 → headings/alt/anchors → UI. Re-run until there are **0 ERRORs**. Leave WARNs only with a one-line reason in `consistency-after.txt`.

## 4. Step 2: one structure per page type (consistent on mobile)

Write the skeleton of each template into `CONTENT_STYLE.md`, and make the pages follow it. Reorder sections; don't add new content.

| Page type | Section order (mobile) |
|---|---|
| Home | Hero (1 CTA) → Trust row → Offers (November first while open) → Services → Results → Salons → Reviews → FAQ → Blog → Final CTA |
| Service category | Hero → Service list → Results → Offers (if any) → Salons → FAQ → Guides → CTA |
| Service page | Hero (H1 + 1 CTA) → Quick answers (AEO, Step 6) → What it is / Who it's for → Results → Process → Aftercare → Offer bar (if any) → Salons → FAQ → Related guides → Related services → CTA |
| Salon page | Hero → NAP block → Offers strip → Top services → Inside → Results → Reviews → How to reach → FAQ → Other salons → CTA |
| Offers pages | As built by the offers prompt (don't change the order) |
| Blog post | Breadcrumb → H1 → Byline (author/reviewer + updated date) → Key takeaways (3 bullets) → Body → FAQ → Related service CTA → Related posts |
| About / FAQ / Gifts | Hero → content → FAQ → CTA |

Rules for every page type:
- **Visible breadcrumbs** on every non-home page (they match the `BreadcrumbList` schema).
- The same `SectionHeader`, the same section spacing scale and the same card component.
- Exactly one sticky bottom bar (`MobileStickyBar`).
- A footer with the 3 `SalonNap` blocks.
- One H1, h2 → h3, and no skipped heading levels.

## 5. Step 3: performance budget `scripts/perf-budget.mjs` (enforced)

Turn on `build.manifest: true` in `vite.config.ts`. The script reads `dist/.vite/manifest.json` + each route's HTML and calculates, **per route**, the gzip and Brotli size of:
- the HTML
- the initial JS (the entry chunk + modulepreloads)
- the initial CSS
- the number of `<img>` in the HTML
- the font files preloaded

It fails on budget breaches. Add `"perf:budget": "node scripts/perf-budget.mjs"`.

| Budget, per page (mobile) | Limit |
|---|---|
| HTML, gzip | ≤ 40 KB (`/` ≤ 55 KB) |
| Initial JS, gzip | ≤ 110 KB, and the main entry ≤ 70 KB |
| Initial CSS, gzip | ≤ 18 KB inlined critical CSS; the rest async |
| `<img>` in the HTML | ≤ 30 (`/` ≤ 40); further images come in when scrolled to or tapped |
| Fonts on first load | ≤ 3 files, ≤ 90 KB total |
| Requests before LCP | ≤ 6 |
| Lighthouse mobile (simulated) on all 10 page types from `seo-cwv.md` + `/offers/november` + `/faq` | Performance ≥ 90, LCP ≤ 2.5 s, TBT ≤ 150 ms, CLS ≤ 0.05, SEO 100, Accessibility ≥ 95, Best Practices 100 |

**How to get there.** Apply in this order, measuring after each, and stop when the budget passes:

1. **Find what's in the 440 KB chunk:** run `npx --yes vite-bundle-visualizer --template raw-data` once, and print only the top 15 modules by size. Typical causes, and their fixes:
   - **All page data in the main chunk** (`content.ts`, `services.ts`, `pages/*`, `giftMembership.ts`, `offers.ts`, imported by `route.ts`/`Header`): split route detection from data. `route.ts` may only import slugs or ids (precompute a small `routes.json` at build time); each page chunk imports its own data.
   - **framer-motion** (~100 KB): switch to `LazyMotion` + `m` components with `domAnimation` loaded asynchronously. Use CSS transitions for simple fades and slides.
   - **lucide-react:** import icons by path, not from a barrel.
   - **The mega menu / mobile menu data** (all services): load it on first open, not up front.
   - **Booking modal, offer popup, lead form (124 KB), lightbox and carousels:** already lazy; make sure none of them is in a modulepreload list.
2. **Trim modulepreloads:** keep only the chunks the route needs for first paint. The current 18 on `/` is too many.
3. **CSS:**
   - Inline the critical CSS per page at build time (`beasties`, the maintained successor to `critters`, as a post-prerender step) and load the rest with `media="print" onload`.
   - Check that Tailwind's `content` globs don't pull in unused files.
   - Remove dead CSS.
4. **HTML weight** (`/` is 356 KB):
   - Prerender only the **first** tab panel of the tabbed sections (Transformations, Gallery, Inside Xing, branch tabs). Render the other panels on first tap, keeping text links to their content for SEO.
   - Carousels and swipe rows prerender the first 4 items, then lazy-mount the rest.
   - Gallery "Show more" items aren't in the initial HTML.
   - Repeated SVG icons become one sprite `<symbol>` with `<use>`.
   - Use `content-visibility: auto` + `contain-intrinsic-size` on below-the-fold sections.
5. **Fonts:**
   - Keep `poppins-400`, `poppins-600` and `cormorant-garamond` only. Map 300 → 400 and 500 → 600 in `tailwind.config.ts`.
   - Replace the 3 `font-script` (Great Vibes) uses with Cormorant italic, and delete Great Vibes and `cormorant-garamond-italic-500` if they're unused afterwards.
   - Subset to Latin + ₹ (`npx --yes glyphhanger` or `pyftsubset`), use `font-display: swap`, and add size-adjust fallback metrics so swapping fonts doesn't shift the layout.
   - Preload at most 2 fonts.
6. **Images:**
   - AVIF + WebP `<picture>` for every content image, made by a script, same names. Use `sizes` that are correct for mobile (not `100vw` for a 160 px thumbnail).
   - LCP image per page: preloaded, `fetchpriority="high"`, ≤ 60 KB on mobile.
   - Everything else: `loading="lazy" decoding="async"`, with width/height set.
7. **Video:** never in the initial HTML or network on load. Poster only; the `<video>` mounts when scrolled into view.
8. **Hydration cost:** hydrate the header, sticky bar and hero first. Hydrate below-the-fold interactive sections on idle or when visible (wrap them in a small `<Deferred>` component using IntersectionObserver plus `requestIdleCallback`). Keep TBT ≤ 150 ms.
9. **Caching:** check `public/_headers` and Express still serve hashed assets as `immutable`. Add `<link rel="preconnect">` only for origins that are actually used (there should be none).

Save the before/after table per route to `perf-budget.md`, and update `seo-cwv.md` with new Lighthouse runs (simulated + devtools, as before).

## 6. Step 4: SEO, cleaning up structure and keywords

1. **Keyword map:** generate `seo-keyword-map.md` from the data, with one row per indexable URL: primary keyword, secondary keywords, H1, title, description, and the main internal links pointing in. **One primary keyword per URL.** Fix overlaps where two pages compete for the same keyword:
   - `/services/global-hair-color` owns "hair colour in Bangalore".
   - `/offers/november` owns "hair colour offer Bangalore".
   - Blog posts own question keywords ("how long does balayage last").
   - Salon pages own "salon in <area>".

   Adjust titles and H1s so they don't overlap, and link the competing page to the owner page with the owner's keyword as anchor text.
2. **Titles and descriptions** follow one pattern per page type (written in `CONTENT_STYLE.md`):
   - Service: `<Service> in Bangalore | <Benefit> – Xing Salon`
   - Salon: `Unisex Salon in <Area>, Bangalore – Xing <Label>`
   - Blog: `<Question or Topic> – Xing Salon`

   Every description contains the keyword, a concrete benefit and an action, and is 120–155 characters.
3. **Internal links:**
   - Every service page links to its category, 3 related services, 2 guides and the 3 salons.
   - Every blog post links to 1–2 services + 2 posts.
   - Every salon page links to its top 6 services + offers.

   Use the same anchor text for the same target everywhere: take it from the keyword map, in one helper (`linkLabel(slug)`).
4. **Schema** (keep the `@graph` per page):
   - Use the same `@id`s everywhere (`/#organization`, `/#website`, `/salons/<id>#salon`, `<url>#webpage`, `<url>#breadcrumb`).
   - Add `WebPage` nodes with `isPartOf`, `about` (the service or salon `@id`), `primaryImageOfPage`, `datePublished`/`dateModified` and `inLanguage: "en-IN"`.
   - Service pages: `Service` with `provider` = the 3 salon `@id`s, and `areaServed` = Bangalore.
   - Blog: `BlogPosting` with `author` (`Organization` Xing, or a real `Person` only if the owner supplies names) and `publisher`.
   - Don't add `HowTo` (Google no longer shows it) or self-serving `AggregateRating`.
5. **Sitemap:** split into `sitemap-pages.xml`, `sitemap-blog.xml` and `sitemap-images.xml`, under a `sitemap.xml` index. Keep the real `lastmod`.

## 7. Step 5: AEO (answer engines: Google's AI Overviews, featured snippets, voice)

1. **"Quick answers" box** at the top of every service page and salon page, right under the hero. It contains 3–4 Q&As, each with an **answer-first sentence of ≤ 30 words**, drawn from that page's existing FAQ data (no new claims). For a service:
   - What is it?
   - Who is it for?
   - How long does it take, and how long does it last?
   - What does it cost? Answer: "Price depends on hair length and is confirmed at consultation", plus the November offer price if that service is in the campaign. The site doesn't publish prices otherwise (`SHOW_PRICES` is false).

   Mark it up as a `<dl>`. It isn't separate schema; the FAQ schema already covers it.
2. **The first paragraph under each H2 answers that H2** in 1–2 sentences (≤ 40 words). The details follow.
3. **One comparison table** per relevant page type (keratin vs smoothening vs nanoplastia; balayage vs highlights vs global; the 3 salons' hours and areas). Use real `<table>` with `<th scope>` and a caption.
4. **Blog posts:** a "Key takeaways" list (3 bullets) under the byline; question-style H2s; a visible "Updated <date>"; each answer section starts with the direct answer.
5. **FAQ:** keep `FAQPage` only where the FAQ is visible. Keep answers 40–60 words, self-contained (they repeat the subject: "Balayage at Xing lasts…"), with no "as mentioned above".

## 8. Step 6: GEO (being cited by AI assistants such as ChatGPT, Perplexity, Gemini, Copilot and Claude)

1. **Entity consistency:** the brand name, salon names, NAP and description sentence must be identical everywhere (Steps 2–3 enforce this). Add one canonical **entity description** to `style.ts` (≤ 40 words, factual): what Xing is, the 3 areas, the services, and founded 2020. Use it in the `Organization.description`, the About intro's first sentence, the footer blurb and `llms.txt`.
2. **`/about` "Xing at a glance"**: a facts table built from data:

   | Fact | Value |
   |---|---|
   | Founded | 2020 |
   | Salons | 3, in order with full GBP names and areas |
   | Hours per salon | from `branches.ts` |
   | Services | count from `services.ts` |
   | Google rating | `ratingLabel()` + "as of <date>" |
   | Sister businesses | Xing Premium Tattoo Studio, Xing Fitness Club |
   | Contact | per salon |

   AI systems quote tables like this, so every value comes from data.
3. **`public/llms.txt`** (and `llms-full.txt`), generated at build time from data so it never goes stale:
   - a one-paragraph entity description
   - the 3 salons with exact NAP, hours and map links
   - the service list with links
   - current offers with the end date (only while open)
   - the top 10 guides with one-line summaries
   - "Last updated"

   Also add it to `robots.txt` as a comment line.
4. **AI crawler access** in `robots.txt`: explicitly `Allow: /` for `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended` and `Bingbot`, with `Disallow: /api/` for all.
   - **Owner decision:** keep `GPTBot` (training) allowed unless the owner says no. Leave it as a clearly commented line.
5. **Bing / IndexNow** (ChatGPT search and Copilot use Bing):
   - Generate an IndexNow key file in `public/`.
   - Add `scripts/indexnow.mjs`, which POSTs the changed URLs (from the sitemap `lastmod` diff) to `api.indexnow.org` after deploy.
   - Document it in the README. Don't call it during the build.
6. **Quotable facts:**
   - On each service page, one sentence with concrete numbers from existing copy (duration, how long it lasts, upkeep interval).
   - On each salon page, one sentence with area + landmark + hours.
   - No vague superlatives ("best salon in Bangalore") unless they come with a source (e.g. "4.8 ★ from 2,550+ Google reviews").
7. **Blog E-E-A-T:** a byline "By the Xing team · Reviewed by a Xing senior stylist" (use real stylist names only if the owner adds them in `content.ts`; leave a TODO), visible dates, and sources linked for factual claims (water hardness, product chemistry) from reputable sites. No made-up sources: if there's no source, soften the claim.
8. **`sameAs`** on the `Organization`: only links that exist in `content.ts` (Instagram, Facebook, YouTube), the 3 GBP `cid` links, `xingtattoo.in` and `xingfitness.in`.

## 9. Step 7: mobile consistency pass (visual)

Run `npm run mobile:audit` (the existing script) plus 390 px screenshots of one page per type into `screenshots/polish/`. On each screenshot, check:
- the same header height
- the same section spacing rhythm
- the same button sizes and styles (Primary berry filled, Secondary outline, Text link)
- consistent card image ratios per card type
- consistent badge and pill styles (saving = mint, status = neutral, tag = berry)
- the sticky bar never covers content
- no text below 14 px except legal text and captions (12 px minimum)
- no orphan words in headings (`text-wrap: balance`)
- even 16 px side gutters

Fix in the shared components. Re-run the audits.

## 10. Final verification (all must pass), then report

1. `npm run build && npm test`
2. `npm run seo:audit` → 0 errors
3. `npm run mobile:audit` → 0 errors (with `?today=2026-11-10`)
4. `npm run consistency:audit` → 0 errors
5. `npm run perf:budget` → all routes within budget
6. Lighthouse table updated in `seo-cwv.md`, with all targets met (or each miss explained in one line)
7. Add tests in `tests/polish.test.ts`:
   - no wrong vocabulary in the `dist` text
   - every CTA label is in `CTA`
   - `llms.txt` exists and contains the 3 GBP names and phones exactly
   - `robots.txt` contains the AI crawler lines and the sitemap index
   - every indexable page has a visible breadcrumb (except home) and a `WebPage` node
   - the HTML gzip size of each route is under budget
8. **README.md:** add sections "Content style" (link to `CONTENT_STYLE.md`), "Performance budget" (`npm run perf:budget`, the budget table), "AEO and GEO" (quick answers, `llms.txt`, AI crawlers, IndexNow) and "Consistency audit". Add a dated **Change log** line.
9. Reply with ONLY:
   - the files changed (one line each)
   - before → after: consistency errors, main JS gzip, `/` HTML gzip, fonts, the Lighthouse Performance/LCP table
   - owner TODOs (GPTBot decision, stylist names for bylines, social links for `sameAs`)
