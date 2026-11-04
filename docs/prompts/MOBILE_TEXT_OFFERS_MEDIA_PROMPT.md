# Prompt: 30% less text on mobile, the Offers dropdown, the home offers section, ratings, tattoo and blog photos, auto-loading maps, transformation videos

> Paste everything below the line into your coding agent from the project root (`xing salon 1`). It replaces `docs/prompts/CONSISTENCY_COPY_CUT_PROMPT.md`; don't run both.

---

**Context.** Vite + React + TypeScript multi-page site with prerendering. Audits exist (`seo:audit`, `mobile:audit`, `consistency:audit`, `perf:budget`, `seo:checklist`, `load:check`), and tests live in `tests/`. Facts live in `src/data/branches.ts` (GBP, locked by `tests/gbp.test.ts`), `offers.ts` and `style.ts`. The 3 offer pages are kept static HTML: `/hsrhaircoloroffers`, `/hsrhairtreatmentoffers` and `/hsrskincareoffers` (plus the Sarjapur copies), listed in `src/data/staticOfferPages.ts`.

**Rules:**
- Don't open `node_modules/`, `dist/`, media folders or `package-lock.json`. Use scripts and `grep`; read source by line ranges.
- Fix at the source, once.
- Don't change URLs, prices, NAP or the salon order Sarjapur Road → HSR Layout → Brookfield.
- After each step, run `npm run build && npm test`, all the audits and `load:check` until there are 0 errors. Commit per step.

## Baseline: iPhone 16 (393 × 852), measured 4 Nov

| Page | Screens | Visible words | Text % of page area | Media % |
|---|---|---|---|---|
| `/` | 29.9 | 2,211 | 22 | 54 |
| `/hsrhaircoloroffers` | 11.5 | 766 | 16 | 59 |
| `/hsrhairtreatmentoffers` | 11.8 | 776 | 18 | 51 |
| `/hsrskincareoffers` | 11.3 | 730 | 17 | 61 |
| `/offers` | 10.4 | 654 | 18 | 74 |
| Salon pages (Sarjapur / HSR / Brookfield) | 15.0 / 14.6 / 16.0 | 1,000 / 1,007 / 1,083 | 20 | 33–38 |
| `/services` | 3.8 | 373 | 28 | 1 |
| `/services/keratin-treatment` | 16.5 | 1,046 | 20 | 31 |
| `/services/global-hair-color` | 16.1 | 1,149 | 21 | 59 |
| `/services/tattoo` | 11.7 | 806 | 22 | 12 |
| `/blog` | 10.1 | 727 | 21 | 26 |
| `/blog/balayage-vs-highlights` | 16.0 | 1,683 | **36** | 8 |
| `/faq` | 15.4 | 1,177 | 18 | 0 |
| `/about` | 11.1 | 857 | 25 | 52 |
| `/membership-gift-cards` | 16.7 | 1,197 | 23 | 2 |

Pages run at about **63–105 visible words per screen**. Target: **≤ 50**.

## Step 1: measure on every page (one script)

Extend `scripts/mobile-audit.mjs` at **393 × 852** (iPhone 16; add it to the widths) to write `reports/copy/<date>/text-<before|after>.csv`. Per URL, include every sitemap page + the 6 static offer pages:
- screens
- visible words (not inside a closed `<details>`, sheet or accordion)
- total HTML words
- text area % (text-node client rects ÷ page area)
- media area %
- words per screen

## Step 2: cut visible text by 30% on every page (SEO, AEO and GEO kept)

**Target per page:** −30% visible words (± 5%), ≤ 50 words per screen, and total HTML words down by ≤ 15%. Cut in this order:
1. **Delete:** filler and marketing fluff, sentences that repeat a heading, section or page, long intros (> 20 words), duplicate trust lines (one trust row per page), duplicate sections (home: one hair-colour section, not three), and "Learn more"-style lines next to buttons.
2. **Shorten:** hero sub-text ≤ 18 words; cards ≤ 15 words; benefits and steps as icon + 2–5 words; lists ≤ 5 visible items, then "Show all".
3. **Move** into `<details>` "Read more", sheets or accordions (the text stays in the HTML): process detail, aftercare, who-it's-for depth, and long answers.
4. **Blog posts:** keep the title, key takeaways, question H2s with their first answer sentence, tables and FAQ. Put the remaining paragraphs of each H2 behind "Read more". Intros ≤ 50 words.

**Never cut:**
- H1s and the primary keyword in the first 100 words
- the Quick-answers `<dl>`
- every FAQ question and answer (identical to `FAQPage`)
- the quotable fact sentence per service and salon page
- the entity description
- NAP, hours, prices and terms
- internal links: if a sentence with a link goes, move the link to a nearby line
- legal and consent text

**Writing rules:** plain Indian English per `style.ts`, sentences ≤ 20 words, "you", numbers instead of adjectives, no hype or exclamation marks. Run `cspell` (en-GB, plus `cspell-words.txt` with salon, area and product names); 0 issues.

## Step 3: Offers in the nav (a dropdown only)

- In `Header.tsx` and `MobileMenu.tsx`, the **Offers** label **doesn't navigate**. It's a `<button aria-expanded>` that only opens the dropdown (desktop: click or hover; mobile: the sub-panel). Remove `offersHref()` and its use. The `/offers` page stays reachable by URL and keeps its redirects; it just isn't linked from the label.
- The dropdown (`offersMenu()` in `navMenus.ts`) contains exactly:
  - **Hair Colour Offers** → `/hsrhaircoloroffers`
  - **Hair Treatment Offers** → `/hsrhairtreatmentoffers`
  - **Skin Care Offers** → `/hsrskincareoffers`
  - a divider, then Membership Offers and Gift Cards

  Each item gets a short "from ₹X" line computed from data, and the note "All 3 salons". Remove the "View all offers" link.
- The labels match the pages' H1s and titles, with the same names everywhere: nav, home, cards, footer, `llms.txt` and the sitemap.

## Step 4: the 3 offer pages (keep images and structure, blend the rest)

**Don't change** these pages' images, section order, layout or offers. **Do:**
1. **Navigation:** every page uses the site's own header (already done) and the site's footer. Add a **3-tab switcher** under the hero (Hair Colour · Hair Treatment · Skin Care). The current page is active, the tabs never wrap at 320 px, and it's the same component on all 3 pages.
   - Fix every `href="#"`.
   - The logo goes to `/`.
   - Remove duplicate in-page menus that the site header already covers.
2. **Text:** cut it 30% as in Step 2, in the pages' own HTML text only, without touching the markup structure.
   - Same tone, CTA labels (`style.ts`: "Claim on WhatsApp", "Book Appointment", "Call", "Directions"), names, prices and salon order as the rest of the site.
   - No "1,000+ happy clients" and no stale review counts: ratings follow Step 6.
   - No ALL-CAPS buttons.
3. **Conversion:**
   - The hero shows the lead offer's price, the saving and **Claim on WhatsApp** on the first screen at 393 × 852.
   - Every offer card has one primary Claim button (WhatsApp prefilled with offer, price and salon, using the existing salon picker in Sarjapur → HSR → Brookfield order).
   - A one-line sticky bottom bar on mobile ("Claim · from ₹X" + Call).
   - Trust strip: free consultation, price fixed before we start, pay at the salon.
   - "More offers" cross-links to the other 2 pages at the bottom.
   - Consistent `data-cta` tracking.
4. **Speed without changing the images:** re-compress the images these pages use **in place**, keeping the same file names, formats and dimensions (where the image is larger than 1,200 px, resize it to 1,200 px): JPG q78 and PNG via `oxipng`/`pngquant` (`npx --yes`).
   - The folders: `public/images/xinghaircolor/` 39 MB, `xinghairtreatment/` 12 MB, `skincareoffers/` 7 MB, `facialfeedback/`, `keyoffers/`, `hairtreatmentoffers/`, `interiors/`, `offer-*.jpg`, `haircare.jpg`.
   - Add `loading="lazy" decoding="async"` and width/height to every image below the first screen.
   - First, back up the originals to `../xing-media-originals/offer-pages/`.
5. **Commit** the untracked image folders the pages use, so a fresh checkout works.

## Step 5: home page offers section, and offers across the site

- Replace the home page's Offers section with **3 cards that match the dropdown**: Hair Colour · Hair Treatment · Skin Care. Each card has the offer page's hero image (a 4:5 crop), the name, "From ₹X · Save up to ₹Y" and the 2–3 offer names as chips. The whole card links to its page.
  - Remove the old 4 offer cards, the duplicate "Global Hair Colour" headings and the November block from home.
- Use the **same card component** in the other offer slots:
  - salon pages (the offers strip)
  - `/services` and the category pages
  - service pages: only the relevant card, e.g. colour services → Hair Colour Offers; keratin, nanoplastia and hair spa → Hair Treatment; facials and body polish → Skin Care
  - the offer popup (one card)
  - the footer link list
  - `llms.txt`

## Step 6: ratings

The owner wants **4.9** shown. Google Maps today shows **HSR Layout 4.9**, **Sarjapur Road 4.8 (458)** and **Brookfield 4.8**. Showing 4.9 for the 2 salons Google shows at 4.8 would contradict their own Google listings, which visitors can check in one tap. Apply this, which shows 4.9 everywhere it's true:
- **Site-wide rating line** (hero trust row, `/about`, offer pages, `/offers`, schema-free text): **"Rated up to 4.9 ★ on Google · 2,550+ reviews"**, from a single `ratingHeadline` in `branches.ts`. The maximum salon rating is 4.9 (HSR).
- **Per-salon blocks:** each salon's real Google value from `branches.ts`.
- **Replace every remaining hardcoded "4.8"** (and "4.9") in copy or static HTML with these helpers. `grep -rnE "4\.[0-9] ?(★|on Google|·)"` across `src content public/*.html` must find nothing hardcoded.
- **When Google shows 4.9 for Sarjapur or Brookfield,** change only that salon's value in `branches.ts`, and the site follows. Add an `// OWNER:` comment saying so.
- **Sarjapur Road's GBP name changed** to **"Xing Premium Unisex Salon - Kasavanahalli, Sarjapura Road"**. Update `fullName` in `branches.ts` and `tests/fixtures.ts`.

## Step 7: tattoo photo

- Source: `tattoo picture.jpeg` in the project root (800 × 1000).
  1. Move it to `../xing-media-originals/tattoo/`.
  2. Generate `public/images/tattoo-work-1-{480,800}.{avif,webp}` (4:5).
  3. Generate a 1200 × 630 crop for OG and blog images.
- Use it:
  - in the `/services/tattoo` hero, replacing the current graphic, plus its gallery
  - on the home and `/services` Tattoo service card, replacing the "Stories on Skin" placeholder
  - in the Brookfield salon page's tattoo-studio mention
  - as the featured image of `content/blog/first-tattoo-guide.md`
- Alt text: "Tattoo work by Xing Premium Tattoo Studio, Brookfield, Bangalore". **Owner: confirm it's the studio's own work.**

## Step 8: blog photos (relevant, not interiors)

- **Today almost every post's `featuredImage` is a salon interior** (e.g. `/images/svc-hair.webp`).
- **Write `scripts/blog-images.mjs`.** It lists each post's slug, category, `primaryKeyword` and current image, plus the candidate images from `public/images` matching that topic. Candidates come from:
  - `work-<category>-*`, `ba-*`, `color-*`, `svc-*`, `gal-*`, `nail-*`, `men-*`, `kids-*`, `facial-*`, `tattoo-*`
  - the new crops from the offer-page folders (`xinghaircolor`, `xinghairtreatment`, `skincareoffers`)
- **Pick one relevant image per post,** for example:
  - balayage posts → a `work-balayage` photo
  - keratin → a keratin before/after or `xinghairtreatment` photo
  - facials → a `skincareoffers` or facial photo
  - nails → nail work
  - men's grooming → men's work
  - kids → kids' haircut
  - tattoo → the tattoo photo

  Use the same image for 2 posts at most. Use an interior only for salon-visit topics, such as "pre-wedding salon timeline".
- **For each chosen image:**
  - generate a 1200 × 630 crop (`public/og/blog/<slug>.webp` + `.jpg`) and a 640 × 400 card crop
  - update `featuredImage` and `featuredImageAlt` (describe what's in the photo plus the topic, without keyword stuffing)
  - check the crop with a quick visual look; faces must not be cut off
- **Client photos:** use only ones already published on the site. Never use the `facialfeedback` chat screenshots as blog images.

## Step 9: maps load automatically

In the home `#map` section (and in `LocationCards`/`MapPanel` everywhere):
- Remove the facade, the "Show Map" button and any "click to load" text.
- Render the Google Maps `<iframe>` directly with `loading="lazy"`, so the browser loads it automatically as it nears the screen and it doesn't slow the first paint. Keep the `title`, `referrerpolicy`, a fixed aspect ratio (no layout shift) and a placeholder background.
- Salon tabs switch the iframe `src`. Only the visible salon's map is mounted.
- Keep `perf-budget` and `load:check` green. If Lighthouse fails because of the iframe, mount it when it's 1 screen away (IntersectionObserver, `rootMargin: '100%'`), still with no click.

## Step 10: transformation videos on mobile (`Reels`, "Transformations in Motion")

Today the cards are 217 × 385 px (≈ 55% of the screen width), with no controls, in a snap row.
- **Cards:** about 72% of the screen width (9:16, ≈ 283 × 503 at 393 px), snapping to the centre, with the next card peeking. 12 px gaps, rounded corners, and a caption under each card (≤ 6 words).
- **Playback:** the card ≥ 60% in view **autoplays muted** (`playsinline`, `muted`, `loop`), and the others pause. Use `preload="none"` with a poster; when a card becomes active, set `preload="metadata"` on the next one.
- **Tap a card** to open a full-screen viewer:
  - vertical swipe (or arrows) moves to the next or previous video
  - tap toggles mute, with a visible 44 px mute/unmute button and a close button
  - a progress bar
  - Back and swipe-down close it (`useHistoryClose`)
  - a "Book this look" CTA (WhatsApp prefilled with the service)
- **Navigation:** visible prev/next buttons (44 px) on the row, a "3 / 10" counter, and dots. Keyboard and screen-reader labels.
- **Performance:** no video bytes before the section is near the screen, at most 1 video playing at a time, and `perf-budget` green.

## Step 11: verify, then report

1. Run `npm run build && npm test`, all the audits, `load:check` and `cspell` → 0 errors.
2. Compare `text-after.csv` with `text-before.csv`: every page shows **−25% to −35%** visible words and ≤ 50 words per screen.
3. Run `npm run seo:checklist`: still 20/20 PASS or MANUAL. The `FAQPage` Q&A counts, H1s, titles, internal link counts and the `llms.txt` facts are the same as before (or better).
4. Check with Playwright at 393 × 852:
   - Offers in the nav opens the dropdown only, with no navigation.
   - The 3 items open their pages.
   - The tab switcher works on all 3 pages.
   - The logo goes to `/`.
   - The home page shows the 3 offer cards.
   - The maps load without a click.
   - The reel autoplays only when in view; the viewer swipes, mutes and closes.
   - The tattoo photo shows in its 4 places.
   - Every blog card has a relevant image.
5. Save 393 px screenshots of `/`, the 3 offer pages, a salon page, a service page, a blog post and `/services/tattoo` to `reports/copy/<date>/`. Read every line and fix anything cut off, repeated or misspelt.
6. **README:** add sections on the offers nav, the offer cards, the ratings helper, the map, the reels and the blog-image script, plus a dated **Change log** line.
7. **Reply with ONLY:**
   - the files changed
   - the before → after table (screens, visible words, words per screen)
   - owner TODOs: confirm the tattoo photo is the studio's work, and update the ratings when Google changes
