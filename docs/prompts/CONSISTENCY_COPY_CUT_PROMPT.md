# Prompt: zero inconsistencies, zero spelling mistakes, 30% less text on mobile (SEO, AEO and GEO kept)

> Paste everything below the line into your coding agent from the project root (`xing salon 1`).
> Run it **after** `docs/prompts/OFFERS_RESTRUCTURE_MOBILE_PROMPT.md` has finished. Its first two steps are done; the six old `public/*.html` offer pages still exist.

---

**Context.** Vite + React + TypeScript multi-page site for Xing Premium Unisex Salon. Prerendered, with existing audits (`seo:audit`, `mobile:audit`, `consistency:audit`, `perf:budget`, `seo:checklist`) and tests. The sources of truth are:

| What | Source |
|---|---|
| Salon facts (exact GBP) | `src/data/branches.ts` (+ `tests/fixtures.ts`) |
| Offers | `offerCatalog.ts` / `offers.ts` |
| Wording | `src/data/style.ts` + `docs/CONTENT_STYLE.md` |

**Goal:**
1. **Zero** inconsistencies across every page, the offer pages above all.
2. **Zero** spelling mistakes.
3. **About 30% fewer visible words on mobile**, with the same SEO, AEO and GEO strength.
4. No broken links.
5. Cleaner reading on phones.

**Rules:**
- Don't open `node_modules/`, `dist/`, media folders or `package-lock.json`; use scripts and `grep`.
- Fix at the source (data, Markdown, shared components), never page by page in the JSX.
- Never change facts, URLs or slugs, FAQ meaning, or the salon order Sarjapur Road → HSR Layout → Brookfield.
- After each step, run `npm run build && npm test` and all the audits, plus the new ones, until there are 0 errors. Commit per step (`copy: <step>`).

## 1. Find every inconsistency: extend `scripts/consistency-audit.mjs`

Add these checks to the existing script (ERROR unless marked). It scans `src/**`, `content/blog/*.md`, the built `dist/**/*.html` text, `llms*.txt`, JSON-LD and `public/*.html` (if any remain).

1. **NAP:** every salon name, address, phone, hours, plus code and map link in the visible text, JSON-LD, `tel:`/`wa.me` links and `llms.txt` must equal `branches.ts`, character for character. The only allowed forms are:

   | Field | Allowed forms |
   |---|---|
   | Short label | `Sarjapur Road`, `HSR Layout`, `Brookfield` |
   | Full name | the GBP `fullName` |
   | Address | the GBP `addressLine` |
   | Phone | `+91 XXXXX XXXXX` |

   Known bad forms found today: "Sarjapura Road" used as a short label (4×), "Brookefield" (4×), "AECS Layout, Brookfield" (7×), "24th Main Road" vs "24th Main Rd", "Sarjapur–Marathahalli" vs "Sarjapur - Marathahalli", and the old domains `xingsalon.com` and `xingsalon.in` (3×). Allowed exceptions: inside the exact GBP strings, and as an area name in prose ("near AECS Layout").
2. **Ratings and counts:** only `ratingLabel()` / `overallRating` output (4.8 overall; 4.8 / 4.9 / 4.8 per salon). No "1,000+ clients", "326+", "393", "319", "1,552" or "2,264".
3. **Prices:** every ₹ amount and % equals `offerCatalog.ts` (via `formatPrice`/`savingPercent`). The same offer has the same name everywhere (for example "Fashion (Crazy) Colour", never "Crazy Fashion Colors" or "crazy colour").
4. **Service names:** one spelling per service, taken from `services.ts`, everywhere: menus, cards, titles, alt text, schema and the blog. Examples: "Hydra Facial", "Nanoplastia", "Olaplex", "Balayage", "Global Hair Colour", "Hair Spa", "De-tan" (pick the one in `services.ts`).
5. **Wording:** the `style.ts` rules (brand, city, colour/color in copy, CTA labels, WhatsApp, times, dates, ₹, en dashes). No ALL-CAPS headings or buttons in the markup or via `uppercase` on headings.
6. **Repeated text:** the same sentence of 12+ words on 2 or more indexable pages (excluding the footer, nav, NAP and legal text) is a WARN. The same sentence twice on one page is an ERROR.
7. **Headings:** heading casing per `style.ts`; no duplicate H2 text on one page (for example "Global Hair Colour" twice on the home page); 1 H1 per page.

Save the first run to `reports/copy/<date>/consistency-before.txt`. Fix everything, in this order: facts → names → wording → headings → duplicates.

## 2. Zero spelling mistakes: add `npm run spell`

1. Install `cspell` as a devDependency, with `cspell.json`:
   - language `en-GB` (Indian English follows British spelling)
   - files: `src/**/*.{ts,tsx}` (strings only, through `cspell`'s default code parsing), `content/blog/*.md`, `docs/CONTENT_STYLE.md`, `README.md`, plus a text dump of `dist/**/*.html` produced by a small script (`scripts/dist-text.mjs` → `reports/copy/dist-text.txt`)
   - ignore paths: `node_modules`, `dist`, `reports`, `*.lock`
2. Create `cspell-words.txt`. Add **only real terms**, each one checked:
   - brand and salon words: Xing, Sarjapur, Sarjapura (GBP name only), Kasavanahalli, Kaikondrahalli, Samvit, Marathahalli, Kundalahalli, Whitefield, AECS, Bengaluru
   - service and product words: Nanoplastia, Olaplex, Schwarzkopf, Keratin, Balayage, De-tan
   - Indian English words such as lakh
   - code and URL tokens
3. Fix every real misspelling in data and Markdown. Never "fix" text by adding a typo to the dictionary.
4. Also flag these (in a small custom script added to the consistency audit):
   - doubled words ("the the")
   - double spaces
   - a space before punctuation
   - mismatched quotes or brackets
   - `'` vs `’` used inconsistently: pick `’` in copy
   - trailing spaces in headings
   - "a" or "an" before the wrong sound
   - en dash vs hyphen per `style.ts`
5. Add `"spell": "cspell --no-progress --unique ..."` and add it to the step command. Target: **0 issues**.

## 3. Broken links: add `npm run links`

`scripts/link-check.mjs` crawls `dist/` (it can reuse the `seo-audit` link logic) and reports:
- every internal `href`/`src`/`srcset` that doesn't resolve to a page, a redirect, a file or an existing `#id`
- every link that goes to a redirect instead of its final URL
- `href="#"`, empty and `javascript:` links
- `tel:`/`wa.me` numbers not in `branches.ts`
- `mailto:` addresses not in `branches.ts`
- external links, checked with a HEAD request (falling back to GET) and a 10 s timeout. Report 4xx/5xx and redirects. For `xingsalon.com` / `xingsalon.in` links, replace the link with the internal equivalent.

Fix every ERROR at its source. 0 broken internal links, 0 links to old slugs or domains. Any external link that is down gets replaced or removed.

## 4. Cut 30% of visible text on mobile (SEO, AEO and GEO kept)

**Measure first.** Extend `mobile-audit.mjs` to record, per page at 390 px, the **visible words** (text not inside a closed `<details>`, sheet or accordion) and the **total words in the HTML**. Save the result to `reports/copy/<date>/words-before.csv`.

Baseline (31 Oct–3 Nov, 390 px, visible words):

| Page | Words | Page | Words |
|---|---|---|---|
| Home | 2,591 | Offers hub | 1,086 |
| Sarjapur / HSR / Brookfield salon pages | 1,182 / 1,183 / 1,272 | Keratin service page | 1,088 |
| FAQ | 1,019 | Gift cards & membership | 928 |
| About | 742 | Blog hub | 571 |

**Target:**
- **Visible words −30% per page** (± 5%). Offer pages stay within their own limits (≤ 750 for a category page, ≤ 550 for the hub).
- **Total HTML words drop by no more than about 15%.** Most of the cut moves behind accordions; only the truly useless text is deleted.

**What to cut (delete):**
- sentences that repeat the heading, the previous section or another page
- filler and marketing fluff ("designed around you", "a space where beauty, care and confidence come together", "more than a salon")
- generic claims with no fact behind them
- second and third paragraphs that restate the first
- duplicate sections (the home page has 3 hair-colour sections; keep one)
- intros longer than 25 words under section headings
- "Learn more"-style lines next to a button that already says so
- repeated trust lines (keep one trust row per page)

**What to shorten:**
- Cards: ≤ 18 words.
- Hero sub-text: ≤ 20 words.
- Section intros: ≤ 20 words, or none.
- Steps and benefits: icon + 2–5 words.
- Lists: ≤ 5 visible items, then "Show all".

**What to move** (into `<details>` "Read more", sheets or accordions, so it stays in the HTML):
- explanations, process details, aftercare, who-it's-for depth
- long FAQ answers (they stay in full inside the accordion)

**Never cut:**

| Kept for | What |
|---|---|
| SEO | H1s; one primary-keyword mention in the first 100 words |
| AEO | the "Quick answers" `<dl>`; every FAQ question and answer (text identical to the `FAQPage`); the first answer sentence under each question H2 |
| GEO | the quotable fact sentence on each service and salon page; the entity description; NAP and hours; prices and terms; internal links (keep their anchor text; if a sentence carrying a link goes, move the link to a nearby line) |
| Legal and consent | all of it |
| Blog posts | key takeaways and article bodies. **Blog posts are exempt from the 30% cut**; shorten only their intros to ≤ 60 words |

**How to write the shorter copy:**
- plain Indian English, using `style.ts` terms
- sentences ≤ 20 words, active voice, "you"
- one idea per paragraph, and paragraphs ≤ 3 lines at 360 px
- numbers instead of adjectives ("lasts 3–5 months", not "long-lasting")
- no emoji, no hype, no exclamation marks in body copy

## 5. Mobile reading polish (shared components)

- **Type:** body 16 px / 1.6, section headings 24–28 px, card titles 18–20 px, captions 13 px (12 px minimum), and a maximum width of about 65 characters on tablet and desktop.
- **Spacing:** one rhythm. Sections 48 px apart on mobile, cards 16–24 px apart, 16 px gutters.
- **Headings:** `text-wrap: balance`, no orphan words, no trailing full stops.
- **Structure aids:** a scannable layout of a heading, a short line and an icon list or card. Bold only key facts (price, duration), at most once per paragraph.
- **One primary CTA per screen.** No two identical CTAs stacked.
- Run the `mobile:audit` checks (no overflow, tap targets ≥ 44 px, text ≥ 12 px, the sticky bar not covering content) at 320, 360, 390 and 430 px → 0 errors.

## 6. Verify, then report

1. Run `npm run build && npm test && npm run seo:audit && npm run mobile:audit && npm run consistency:audit && npm run spell && npm run links && npm run perf:budget && npm run seo:checklist`. **Every one returns 0 errors.**
2. Compare `words-after.csv` with `words-before.csv`: every non-blog page shows −25% to −35% visible words.
3. Check that SEO, AEO and GEO are intact, using the checklist script. Every page must still have:
   - its title, description and H1 unchanged, unless a fix needed them
   - the same `FAQPage` Q&A count as before
   - its Quick answers and quotable fact
   - the same or more internal links
   - the same `llms.txt` facts

   The checklist must PASS all 20 items.
4. Read through the 390 px screenshots of `/`, `/offers`, the 3 offer category pages, the 3 salon pages, one service page, `/faq` and `/about` (in `reports/copy/<date>/`). Fix anything cut off, repeated, inconsistent or misspelt, then re-run step 1.
5. **README:** add a "Copy rules" section that links to `CONTENT_STYLE.md` and covers the word limits from step 4 and `npm run spell` / `npm run links`. Add a dated **Change log** line.
6. Reply with ONLY:
   - the files changed
   - the before → after counts for: consistency errors, spelling issues, broken links, and visible words per page
   - anything you couldn't verify
