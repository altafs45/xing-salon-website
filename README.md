# XING Premium Unisex Salon — website

Multi-page salon site for XING's three Bangalore salons (Brookfield, HSR Layout, Sarjapur Road), built with Vite, React, TypeScript, Tailwind CSS, Framer Motion and Lucide icons, plus a small Express server for gift and membership leads.

Every page is its own HTML document: the build writes one file per route with its own title, description, canonical URL, Open Graph tags and JSON-LD schema, plus `sitemap.xml` and `robots.txt`.

## Pages

| URL | What it is | Code / content |
| --- | --- | --- |
| `/` | Home page | `src/routes/Landing.tsx`, `src/data/content.ts` |
| `/services` | Full service menu | `src/pages/ServicesHubPage.tsx`, `src/data/services.ts` |
| `/services/hair-care`, `/skin-body`, `/nail-care` | Service category pages | `src/pages/ServiceCategoryPage.tsx` |
| `/services/<slug>` | 25+ service pages (global-hair-color, highlights, balayage, fashion-color, keratin-treatment, hydra-facial, …) | `src/pages/ServicePage.tsx`, one file per page in `src/data/pages/` |
| `/offers` | Every current offer | `src/pages/OffersPage.tsx`, `src/data/offers.ts`, `src/data/offersPage.ts` |
| `/offers/november` | November 2026 hair colour offers, with prices | `src/pages/NovemberOffersPage.tsx`, `novemberCampaign` in `src/data/offers.ts`, `src/data/novemberOffersPage.ts` |
| `/salons`, `/salons/<id>` | All salons, and one page per salon | `src/pages/SalonsPage.tsx`, `src/pages/BranchPage.tsx`, `src/data/branches.ts`, `src/data/branchPages/` |
| `/faq` | Every salon FAQ, by topic, with search | `src/pages/FaqPage.tsx`, `src/data/faqPage.ts` (imports the answers from their own pages) |
| `/membership-gift-cards` | Memberships and gift cards | `src/pages/MembershipPage.tsx`, `src/data/giftMembership.ts` |
| `/blog`, `/blog/<slug>` | 50 hair, skin, nail and tattoo articles | Markdown in `content/blog/`, built by `src/blog/build.ts` |
| `/about` | About XING | `src/pages/AboutPage.tsx`, `src/data/about.ts` |

Page titles, descriptions and schema for every route are set in `src/data/seo.ts`. To add a page, add its meta there (and to `extra()` in `vite.config.ts` if it is not in `routes`), add its route check to `src/lib/route.ts` and `src/App.tsx`, and map its chunk in `vite.config.ts` so the build preloads it.

## Setup

```bash
npm install
npm run dev       # local dev server (http://localhost:5173)
npm run build     # type-check + production build into /dist
npm run preview   # serve the production build (http://localhost:4173)
```

Requires Node 22.9 or newer for `npm start`. Deploy the `dist` folder to a static host, or run `npm start` for the leads API too.

## Changing content

Shared copy, links, phone numbers, opening hours, FAQs and reviews live in **`src/data/content.ts`**. Each page also has its own data file (see **Pages** above). Salon details (address, phone, hours, photos, rating) live in `src/data/branches.ts`.

Edit it and the page, the booking form, the page title/description and the Google `HairSalon` schema for each location all update together. Things to set before going live:

| What | Where in `content.ts` |
| --- | --- |
| Live domain (used for canonical URL, Open Graph, schema) | `site.url` |
| Opening hours (drives the "Open now / Closed" badge and booking slots) | `site.hours` |
| Each salon: address, phone, email, Google Maps link, description | `locations` |
| Which salon's phone/WhatsApp the header and chat button use | `primaryLocation` |
| Social profile links | `footer.socials` |
| Full service menu (categories and service names, no prices) | `serviceMenu` |

**Salon order.** Salons always appear as Sarjapur Road, HSR Layout, Brookfield. The order is `SALON_ORDER` in `src/data/branches.ts`, and `locations` follows it. Never hardcode a salon list: render from `locations`, or sort with `bySalonOrder`. In copy, write "Sarjapur Road, HSR Layout and Brookfield". The last-used salon is highlighted, never moved to the top.

**Navigation.** The order is `nav` in `src/data/content.ts`. The Offers and Salons menus, on desktop and in the mobile drawer, come from `src/data/navMenus.ts`. Offers items come from `salonOffers`, so a new offer appears by itself; Membership Offers and Gift Cards are always listed there too. While a campaign is live its page is the first item.

**FAQ page.** `src/data/faqPage.ts` imports each group's questions from where they already live, so edit an answer on its own page and `/faq` follows. A question that repeats exactly is shown once.

## Swapping images

Images are in **`public/images`**. The logo, hero, service cards, "Why Choose XING" photo, salon gallery and location galleries use real XING photos. So do the transformations, hair color options, service page heroes and most guides. Only `guide-hair-spa` and `offer-keratin` are still Unsplash placeholders.

To replace one, save your photo over the file with the **same name**, as WebP, at roughly the same size:

| Files | Used for | Size (px) |
| --- | --- | --- |
| `hero.webp` | Hero salon photo | 1200 × 858 |
| `hero-arch.webp` | Hero arched salon photo | 520 × 800 |
| `svc-hair`, `svc-skin`, `svc-nails`, `svc-men` | Service cards | 640 × 480 |
| `guide-*.webp` | Beauty guide cards | 640 × 400 |
| `color-global`, `color-balayage`, `color-ombre`, `color-fashion` | Hair color circles and cards | 640 × 480 |
| `offer-*.webp` | Offer cards | 560 × 400 |
| `work-<category>-1.webp`, `-2`, … | Transformations and service page galleries | 600 × 800 |
| `*-bangalore.webp` | Service page hero photos | 800 × 600 |
| `why-salon.webp` | "Why Choose XING" photo | 520 × 700 |
| `loc-<salon>-1.webp`, `-2`, … | Location card photo galleries | 800 × 600 |
| `logo.webp`, `logo-light.webp` | Logo for light / dark backgrounds (transparent) | 480 × 235 |
| `og.jpg` | Link-preview image (JPEG) | 1200 × 630 |

If you use a different file name or size, update the matching `img(...)` entry in `content.ts` (name, alt text, width, height).

**Salon photos:** each location card shows a small gallery. To add photos for a salon (e.g. Brookfield), save them as `loc-brookfield-1.webp`, `loc-brookfield-2.webp`, … and add one description per photo to that salon's `photos` list in `content.ts`. A salon with an empty list shows "Photos coming soon".

**Client result photos:** the Transformations tabs come from `transformations` in `content.ts`, one `work(file, caption)` line per photo. To add a photo, save it as a 600 × 800 WebP and add a line to its category; to add a category, add a block with a `label`. Service pages pull the same photos through `workPhotos([...labels])` in their `gallery`.

**Before/after photos and videos:** both are listed in `src/data/media.ts`.

- The **service gallery** on the home page (Hair, Nails, Men & Kids) is the `serviceGallery` list in the same file: photos are `gal-<group>-<n>.webp` (800 × 1000) with a 480 px wide `-480` copy, and one caption per photo in file order.
- A video's `service` is the service page that also shows it; `home` puts it in the home page's video row.

- A before/after pair is two WebP files cropped to the same shape, `ba-<name>-before.webp` and `ba-<name>-after.webp` (800 px wide), plus a 480 px wide `-480` copy of each. Add one `pair(...)` line with the caption and the service page it links to.
- A video is a portrait MP4 in `public/videos` (H.264, no audio, at most 720 px wide) with a poster frame saved as `public/images/<name>-poster.webp`. Add one `reel(...)` line with its caption and pixel size. The video section hides itself when the list is empty.

`npm run images` re-downloads the two remaining placeholders (it will overwrite files of the same name).

## Logo, icons and share images

- **Logo:** `public/brand/` holds the logo as WebP and PNG at 1x and 2x, a light version for dark backgrounds, and `logo-square-512.png` for search-engine schema. They were lifted unchanged from the owner's logo mock-up; if a vector (SVG) logo is supplied, replace these files and keep the names. The `Logo` component (`src/components/ui/Decor.tsx`) is the only place the logo is drawn.
- **Favicon and app icons:** `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` and `site.webmanifest`, all in `public/`. `node scripts/make-icons.mjs` makes them from the logo: tab sizes use the "xing" wordmark on a cream tile, app icons the full logo.
- **Share images:** `public/og/` has one 1200 × 630 image per kind of page (default, hair, skin, nails, blog, offers, tattoo), and `public/og/blog/` has each blog photo cut to that shape. Which page uses which is set in `src/data/seo.ts`. They carry no prices or phone numbers.
- **Page titles and descriptions:** each page's own data file sets them (home: `seo` in `content.ts`). The build writes them, with the canonical URL, Open Graph tags and schema, into a separate HTML file per page, so link previews work without JavaScript. The site's address is `site.url` in `content.ts`.

## Offers

**Prices.** `SHOW_PRICES` in `src/data/offers.ts` is `false`, so `/offers`, the home page, the popup and the salon pages show percentages and wording only, except for the dated campaign below. Amounts are stored in the same file so they can be switched on in one place. Never add a price, date or term the salon has not published on a poster.

**Honest savings.** `savingPercent()` rounds down, so the site never claims more than the real saving. The hair colour poster's headline says "up to 50% off", but its own prices save at most 37% (crazy colour ₹799 → ₹499), so the site says 37%. The tattoo studio's "up to 50%" is a separate offer.


The four featured offers (`promos` in **`src/data/offers.ts`**) are the cards in the home page's Offers section and the offers the popup shows. Prices and terms are copied from the salon's posters: change them only to match a new poster. Poster images are `public/images/offer-<slug>-480/800/1200.webp`. "Claim Offer" opens the booking form with that offer's service chosen (`bookAs`), and the offer's name goes into the WhatsApp message. The three poster offers are also shown in full on `/offers` (`src/pages/OffersPage.tsx`, copy in `src/data/offersPage.ts`), where the main button opens WhatsApp with a ready message after the visitor picks a salon.

**Analytics.** `src/lib/analytics.ts` pushes `popup_shown`, `popup_dismissed`, `whatsapp_click`, `call_click` and `directions_click` to `window.dataLayer` when the page has one (add Google Tag Manager to `index.html` to collect them).

## Membership and gift cards

`/membership-gift-cards` (`src/pages/MembershipPage.tsx`, sections in `src/components/gift/`) sells three membership tiers and occasion gift cards through a two-step request form. **No prices or rupee amounts appear anywhere on it** (page, meta tags, schema, alt text): value is shown only as bonus percentages and perks, and the salon confirms the value with the client on WhatsApp.

Everything on the page comes from **`src/data/giftMembership.ts`**, so offers can be changed without touching a component:

| What | Where in `giftMembership.ts` |
| --- | --- |
| Tiers: name, badge, bonus %, validity, perks, family seats | `tiers` (the one with `recommended: true` is the highlighted, default tier) |
| Occasion and festival gift cards | `occasions` (each has a theme, an optional photo, message ideas and optional `windows`) |
| Festival dates | `festivalWindows`: a card is pinned as "This Season" inside its window and in the 21 days before. Check the lunar dates each year. |
| A real end date for an offer | `endsAt` on an occasion (only then does "Offer ends …" show) |
| Salon routing (emails, WhatsApp numbers) | `salons`, defaulting to `src/data/branches.ts`; override per salon with the env vars below |
| FAQ, terms, page copy | `faqs`, `terms`, `gmPage` |
| Tier minimum loads (staff emails only, never on the page) | `internal.tierMinLoadINR` |
| "How to gift a XING card" video | `howToVideo`: add the files, then set `enabled: true` |

To preview another season, open the page with `?today=2027-05-01` (any date).

## Gift & membership leads: setup

Every request from the form goes to `POST /api/leads/gift-membership` (`server/`). The server checks it with the same schema as the form (`src/shared/leadSchema.ts`), drops bots (hidden honeypot field, submissions under 3 seconds, at most 5 requests per IP and per phone number in 10 minutes), saves it, and emails XING, the chosen salon and (if they gave an email) the client. It returns a lead ID like `XG-261024-7K3Q` and a WhatsApp link to that salon with the request written out, which the client taps to send. If the server can't be reached, the form still shows that WhatsApp button, so no request is lost.

```bash
cp .env.example .env.local   # development: fill in SMTP and emails, then
npm run dev                  # the API runs inside the dev server at /api
npm test                     # schema, endpoint, WhatsApp encoding and static-serving tests

cp .env.example .env         # production
npm run build && npm run build:api
npm start                    # serves dist/ and the API on PORT (default 8787); needs Node 22.9+
```

**Hosting.** No host was configured, so `npm start` runs one small Express server that serves the built site (gzipped, each page at its canonical address) and the API together; put it behind your usual proxy (Nginx, Render, Railway…). The pipeline itself is framework-free (`handleLead` in `server/handler.ts`), so it can also back a Vercel or Netlify function later. Leads are saved to `data/leads.json` (ignored by git: it holds personal data). On serverless or several instances, swap in a shared store (`LeadStore` in `server/adapters/leadStore.ts`, e.g. Google Sheets or a database) and a shared rate limiter (`server/rateLimit.ts`).

**Env vars** (all in `.env.example`): `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `XING_EMAIL`, `SALON_EMAIL_HSR`, `SALON_EMAIL_SARJAPUR`, `SALON_EMAIL_BROOKFIELD`, `WA_NUMBER_HSR`, `WA_NUMBER_SARJAPUR`, `WA_NUMBER_BROOKFIELD`, `WHATSAPP_API_ENABLED`, `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID`, `PAYMENTS_ENABLED`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RATE_LIMIT_WINDOW_MIN`. Without `SMTP_HOST` leads are saved but no email goes out (the log says so). Logs never contain a full phone number or email.

**Switching on the WhatsApp Cloud API later.** Today the client sends the request from their own WhatsApp (click-to-chat). To also message the salon and the client automatically: get two message templates approved in WhatsApp Manager, fill in their names and parameters in `WhatsAppCloudApiProvider` (`server/adapters/whatsapp.ts`), then set `WHATSAPP_API_ENABLED=true`, `WHATSAPP_TOKEN` and `WHATSAPP_PHONE_ID`.

**Switching on online payment later.** "Pay online" shows "Launching soon" and the server refuses it. Finish `RazorpayProvider` (`server/adapters/payment.ts`: where the amount comes from, given the page shows none, and a webhook that verifies the payment signature), then set `PAYMENTS_ENABLED=true`, `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` and rebuild (the form reads the flag at build time).

**First paint.** The build writes this page's hero into its HTML as plain markup (`SHELLS` in `vite.config.ts`), so the heading and gift card image show before any script loads.

**Analytics.** The page pushes `gm_chooser_select`, `gm_tier_view`, `gm_tier_cta`, `gm_occasion_cta`, `gm_form_open`, `gm_form_step`, `gm_form_submit_success`, `gm_form_submit_error`, `gm_whatsapp_click`, `gm_call_click` and `gm_compare_cta` to `window.dataLayer` (no personal data).

## Booking form

The booking modal validates the three steps and ends with a summary plus a "Confirm on WhatsApp" button that opens a pre-written message to the WhatsApp number of the salon the client chose. It does **not** send the request anywhere by itself — to store bookings or send notifications, post the form data to your booking system or API in `onSubmit` in `src/components/BookingModal.tsx`.

### The Offers page: `/offers/november`

The nav's **Offers** item opens this page while the campaign is open, and `/offers` after it ends. It runs 1–30 November 2026, ending 23:59 Asia/Kolkata, at all 3 salons. Prices appear on this campaign only, because the posters publish them.

| Offer | Was | Now | Saving |
| --- | --- | --- | --- |
| Global hair colour, any length | ₹5,999 | ₹3,999 | ₹2,000 (33%) |
| Highlights, per streak (8–10 recommended) | ₹499 | ₹399 | ₹100 (20%) |
| Crazy colour, per streak | ₹799 | ₹499 | ₹300 (37%) |
| Balayage, starting from | ₹7,999 | ₹5,499 | ₹2,500 (31%) |

**Where it lives.** Offers, dates, images and helpers: `novemberCampaign` in `src/data/offers.ts`. Page copy and the FAQ (also sent as schema): `src/data/novemberOffersPage.ts`. Parts: `src/components/offers/NovemberBits.tsx`, `NovemberHero.tsx`. Menu: `src/data/navMenus.ts`.

**States** (`campaignState`). *Upcoming*: "Starts 1 Nov", and the button is "Reserve a November slot". *Live*: "Valid till 30 Nov · N days left", and the button is "Claim on WhatsApp". *Ended*: every embed hides, the page stays at the same address saying the offers have ended, the salon FAQ drops its November sentence, and the schema says `Discontinued`. Embeds show while `isCampaignOpen()`, on the salon pages, `/offers`, the home page, the popup, the nav and the 4 colour service pages. Preview any stage with `?today=2026-12-01`.

**Images.** Offer cards and thumbnails use real salon photos (`poster` and `thumb` in `novemberCampaign`). The Global Hair Colour poster appears once, in the page's hero, and the poster's price list in `#prices` (`node scripts/offer-images.mjs` makes both). The other two posters print "-40% off", "Upto 50% off" and ₹599, so they aren't shown. **Owner TODO:** ask the designer for corrected highlights and menu posters (no "-40%", no "up to 50%", highlights was-price ₹499). Then the whole posters can be shown.

**Decisions.** Highlights "was" is ₹499 (the highlights poster says ₹599; the lower figure never overstates the saving). One offer per service, not with Tuesday Happy Hours. The patch test is "available on request". Olaplex is a paid add-on.

**Next month.** Change `start`, `end`, the labels and `offers` in `novemberCampaign`, make the new images, update `novemberOffersPage.ts`, and everything else follows. Rebuild the day a campaign ends, because the static HTML only changes on a build.

**Analytics.** `nov_offer_view`, `nov_offer_claim`, `nov_offer_book`, `nov_offer_details`, `nov_picker_result`, `nov_nav_click` and `sticky_cta_click`, with `offer_id`, `branch`, `placement` and `page` where they apply. No personal data.

**To confirm.** See the `TODO (owner to confirm)` comments in `novemberCampaign`: whether toning and the blow-dry are included in the highlights price, and how long highlights take. Also whether the patch test is free.

## Mobile text budget

`npm run mobile:audit` loads every page of the build at 4 phone sizes and prints one line per problem. Options: `--today=2026-11-10`, `--widths=375`, `--only=/offers/november`, `--shots` (saves `screenshots/mobile/`). Exit code 1 means errors.

| Element | Max at 375 px |
| --- | --- |
| Hero sub-text | 20 words, 2 lines |
| Section intro under a heading | 25 words, or remove it |
| Card text | 18 words |
| Paragraph | 3 lines visible; the rest behind "Read more" (`ReadMore`), still in the HTML |
| Section | 80 visible words, 1.2 screens (galleries and swipe rows excepted) |
| Lists | 5 visible items, or a swipe row |

Never cut prices, terms, FAQ answers (they stay in closed accordions), the H1, addresses, phone numbers or consent text. Add `data-swipe` to a swipe row and `data-gallery` (or `gallery` on `Section`) to a gallery so the audit treats them as such. Blog article bodies carry `data-article` and are exempt: long reading is what they are for.

## Salon details = Google Business Profile

Every salon fact on the site matches its Google Business Profile (GBP): name, address, call number, hours, pin, map link, rating, category. The source is `src/data/branches.ts`, and `tests/fixtures.ts` holds a copy of the profiles that `tests/gbp.test.ts` checks against, including across the built HTML. **When a profile changes, edit both and rebuild.** `SalonNap` (`src/components/SalonNap.tsx`) prints name, address, hours and phone, so the wording is the same everywhere.

- **Names:** `name` is the short label ("Sarjapur Road"). `fullName` is the exact GBP name, including its punctuation. "Sarjapura Road" appears only inside that full name.
- **Spelling:** the Brookfield GBP says "Brookefield". The site writes "Brookfield" until the owner corrects the profile.
- **Brookfield phone:** calls go to the GBP number, +91 79966 66012. WhatsApp stays on +91 81471 11344, because a landline can't take WhatsApp.
- **Hours:** each salon has its own. They drive the open-now chip, booking slots, schema and copy. Use `allHoursText` for all three.
- **Ratings:** exact figures are stored with `asOf`. The site shows them rounded down (`reviewsLabel`), and the totals are calculated, so they stay true as counts grow.
- **Schema:** no `aggregateRating` or `review`. Google doesn't allow third-party review markup on your own business, so ratings are visible text only, linked to the listing.

**Owner checklist, inside Google Business Profile:**
1. Point all 3 website fields at `https://www.xingsalons.com/salons/<id>`. If xingsalon.in and xingsalon.com are yours, 301-redirect them to xingsalons.com.
2. Fix the Brookfield typo "Brookefield", and add the missing comma after "SV Plaza" if Google allows it. Then update `street` and the fixture.
3. Confirm 079966 66012 rings at the Brookfield salon. If it's an agency tracking line you don't control, make the salon's own number primary, and update the site.
4. Optionally use one name pattern across the 3 profiles, within Google's naming rules, and update `gbpName` and the fixture the same day.
5. Make categories consistent: Hair salon primary, with Beauty salon, Nail salon and Hairdresser as secondary.
6. If HSR's 10 PM close or Brookfield's 9 AM open isn't right, fix the GBP first and the site follows. Add special hours for holidays.
7. Add the November offers as posts on all 3 profiles, linking to `https://www.xingsalons.com/offers/november?utm_source=google&utm_medium=organic&utm_campaign=gbp-post`.

## Content style

`CONTENT_STYLE.md` is the guide for writers. The rules live in `src/data/style.ts`: brand, city, the `ENTITY_DESCRIPTION` sentence, and every button label (`CTA`). Use `CTA.book`, never a typed label.

## Consistency audit

`npm run consistency:audit` scans the source and the built pages for wrong vocabulary, button labels, facts that don't come from the data, duplicate sentences and repeated titles. Blocks that repeat by design (offer cards, booking steps, sibling services' aftercare) are listed in `SHARED_COPY` in `style.ts` and reported as warnings.

## Performance budget

`npm run perf:budget` measures each page's first load and fails on a breach. `perf-budget.md` has the latest numbers, and `seo-cwv.md` the Lighthouse runs.

| Per page | Limit |
| --- | --- |
| HTML, gzip | 40 KB (`/`: 55 KB) |
| First JS, gzip | 110 KB, main entry 70 KB |
| Blocking CSS, gzip | 18 KB |
| `<img>` in the HTML | 30 (`/`: 40) |
| Fonts on first load | 3 files, 90 KB |

Animations load after first paint (`LazyMotion` in `App.tsx`), so use `m.div`, never `motion.div`.

## AEO and GEO

- **Quick answers:** service and salon pages open with `QuickAnswers`, built from each page's own FAQ.
- **`llms.txt` and `llms-full.txt`:** written from the data on every build (`src/data/llms.ts`).
- **AI crawlers:** allowed in `public/robots.txt`. `GPTBot` is a commented owner decision.
- **Sitemaps:** `sitemap.xml` is an index of `sitemap-pages.xml`, `sitemap-blog.xml` and `sitemap-images.xml`.
- **Keyword map:** `node scripts/keyword-map.mjs` writes `seo-keyword-map.md`.
- **IndexNow:** after a deploy, run `node scripts/indexnow.mjs`, or `--all` the first time. It tells Bing what changed, which also feeds ChatGPT search and Copilot. It never runs during a build. The key file is in `public/`.

## SEO & indexing

**Prerendering.** `npm run build` ends with `scripts/prerender.mjs`, which opens every page in headless Chromium and writes the result into that page's HTML, so content, links and images are there without JavaScript. The build fails if a page has no `<h1>`. It needs Playwright's Chromium on the build machine: run `npx playwright install chromium` once. When the app starts it loads the page's code first and then replaces that HTML with the same content, so nothing blanks. `?prerender=1` is how the app knows it is being snapshotted: animations, the popup and anything time-dependent (the open-now chip) stay out. Pages with a first-paint shell keep it, and the prerender fills in the rest.

**Audit.** `npm run seo:audit` checks the built site and exits 1 on any error: indexing, meta, headings, images, links, schema and weight. Run it after `npm run build`. External links are listed in `seo-external-links.txt` for a human to check. HTML over 150 KB is only a warning: the largest page, home, is about 346 KB raw and 41 KB gzipped.

**Where things live.** Titles and descriptions are in each page's data file (`content.ts`, `offersPage.ts`, `branchPages/*.ts`, `pages/*.ts`, blog front matter). Schema is in `src/data/seo.ts`. `sitemap.xml`, `robots.txt`, `_redirects` and each page's `<head>` are written by `seoPlugin` in `vite.config.ts`. Sitemap dates are a post's `updatedDate`, otherwise the last commit to the page's data file.

**URL rules.** One address per page: `https://www.xingsalons.com/<path>`, no trailing slash, no `.html`. Each page is one file, `dist/<path>.html`. Express applies this in `server/canonical.ts`; a static host uses `dist/_redirects` and `public/_headers`. Retired addresses go in `redirects` in `src/data/services.ts`, which feeds both. Hosts differ: Netlify reads the domain rules in `_redirects`, while Cloudflare Pages ignores them, so set bare domain → www and "Always use HTTPS" in its dashboard. On Netlify `/path/` can't be redirected to `/path` from `_redirects` (it would loop), but the canonical tag covers it.

**Headers.** HSTS (no `preload` until every subdomain is confirmed on HTTPS), `nosniff` and `strict-origin-when-cross-origin` everywhere. `/assets` and `/fonts` are cached for a year, `/images`, `/videos` and `/og` for a week, and HTML revalidates every time.

**Preview builds.** `npm run build:preview` marks every page `noindex,nofollow` and writes `Disallow: /`, so a preview deploy can't be indexed.

**Daily rebuild needed.** Scheduled blog posts only go live, and enter the sitemap, on a build. Campaign pages also change state by date, and their static HTML and schema only update on a build. No scheduler exists in this repo, so set a daily rebuild at the host. Nail and tattoo service pages link to fewer than 2 posts until their scheduled posts go live.

**Adding a page.**
1. Add its meta to `src/data/seo.ts`, with a title of 30–60 characters and a description of 70–155.
2. Register it in `extra()` in `vite.config.ts` if it isn't in `routes`, and map its chunk in `routeChunks`.
3. Add its route check in `src/lib/route.ts` and its `readyLazy` import and `preloadPage` entry in `src/App.tsx`.
4. Give it one `<h1>`, a `BreadcrumbList`, and links from at least 3 other pages.
5. If it replaces an address, add a `redirects` entry.
6. Run `npm run build && npm run seo:audit` and fix every error.

**Search Console and other owner steps.**
1. Make sure the site is live at `https://www.xingsalons.com`, with DNS and HTTPS working, and `http://xingsalons.com` redirecting there.
2. In Google Search Console, add a Domain property for `xingsalons.com` and verify it with the DNS TXT record. If you prefer the HTML-tag method, set `VITE_GSC_VERIFICATION` to the token and rebuild.
3. Submit `https://www.xingsalons.com/sitemap.xml` under Sitemaps.
4. In URL Inspection, request indexing for `/`, `/services`, `/offers` and the 3 salon pages, and the rest over a few days (there is a daily quota).
5. In Bing Webmaster Tools, import from Search Console.
6. Link each Google Business Profile's website field to its salon page (`SEO_BACKLINKS.md`, section 2).
7. After 7–14 days, check Search Console → Pages for reasons pages aren't indexed.

## Project layout

```
index.html                 fonts, meta tags (filled in per page at build time)
vite.config.ts             per-page HTML, SEO plugin, sitemap, first-paint shells, chunk preloads
tailwind.config.ts         design tokens: colors, fonts, spacing, shadows, animations
content/blog/              blog posts (Markdown with front matter)
src/App.tsx                picks the page for the URL (lazy chunks), booking modal, offer popup
src/lib/route.ts           which page the current URL is
src/data/                  all content: content.ts (shared), seo.ts (meta + schema), offers.ts,
                           offersPage.ts, branches.ts, branchPages/, pages/ (service pages), services.ts,
                           novemberOffersPage.ts, giftMembership.ts, media.ts (before/after, videos, gallery)
src/pages/                 one component per page type
src/components/            sections; offers/ (OfferCard, OfferSheet, OffersShowcase, OfferPopup),
                           service/ (SectionHeader, FAQAccordion, MobileStickyBar…), blog/, gift/, nav/, ui/
src/lib/                   analytics, WhatsApp links, offer helpers, chosen branch
src/hooks/                 scroll-spy, media query, salon status
src/context/booking.tsx    opens the booking modal from any "Book" button
server/                    Express API for gift/membership leads (built to server-dist/)
tests/                     vitest: schema, endpoint, WhatsApp encoding, static serving, catalogue, November offers
offers/, offers for november/   the salon's original offer posters (source files, not served)
```

## Change log

- **2026-10-31:** One house style (`style.ts`, `CONTENT_STYLE.md`), consistency and performance audits, animations loaded after first paint, Quick answers, `llms.txt`, AI crawler rules, split sitemaps, WebPage schema and visible breadcrumbs on every page.
- **2026-10-31:** Offers page rebuilt mobile-first (10.6 screens, 605 words, from 24 screens and 1,606 words) and the nav's Offers item now opens it. Campaign states, AVIF images, tap to zoom. Site-wide mobile pass with `npm run mobile:audit`.
- **2026-10-31:** Salon facts now match the 3 Google Business Profiles (per-salon hours, exact names and addresses, Brookfield's call number, calculated ratings, one schema node per salon), locked by `tests/gbp.test.ts`.
- **2026-10-31:** Technical SEO: every page prerendered, `npm run seo:audit`, one URL form, redirects and headers for Express and static hosts, sitemap dates and images, preview builds noindexed.
- **2026-10-31:** One salon order everywhere (`SALON_ORDER`). New nav with Offers and Gifts dropdowns. New `/faq` page, with "All FAQs" links from the home page, `/offers` and the salon pages.
- **2026-10-31:** Built `/offers/november` with its embeds on the salon pages, `/offers`, the home page, the popup, the nav and the colour service pages. Replaced "up to 50%" on hair colour with the real 37%.
- **2026-10-31:** README brought up to date with the multi-page site (pages table, layout, price policy). Recorded the November 2026 hair colour posters, the price conflicts the salon must confirm, and the planned `/offers/november` page.
