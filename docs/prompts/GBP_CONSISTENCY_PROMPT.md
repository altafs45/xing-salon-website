# Prompt: make the website match the 3 Google Business Profiles exactly (NAP + hours + ratings + schema)

> Paste everything below the line into your coding agent from the project root (`xing salon 1`).
> Run this **before** `OFFERS_PAGE_FINAL_PROMPT.md` and `SEO_INDEXING_PROMPT.md`.
> **Part D** lists changes only the owner can make inside Google Business Profile. Do those too, or the two sides will still disagree.

---

You are editing an existing Vite + React + TypeScript multi-page site for XING Premium Unisex Salon. **Goal:** every salon fact on the website (name, address, phone, hours, coordinates, map link, rating, review count, category, attributes) must match that salon's **Google Business Profile (GBP)** exactly, on every page, in visible text, meta tags, JSON-LD, WhatsApp/tel links, emails and tests. **The GBP is the source of truth.**

Work efficiently:
- Change data in **one place** (`src/data/branches.ts` and `src/data/content.ts`).
- Then find leftover hardcoded copies with the greps below. Edit in place.
- Never open `node_modules/`, `dist/`, `server-dist/`, media folders or `package-lock.json`.
- Commit after each step.

## A. The GBP data (read from Google Maps on 31 Oct 2026, 18:30 IST; use exactly these values)

| Field | Sarjapur Road | HSR Layout | Brookfield |
|---|---|---|---|
| **GBP name (exact)** | `Xing Premium Unisex Salon, Sarjapura Road` | `Xing Premium Unisex Salon - HSR Layout` | `Xing Premium Unisex Salon - Brookfield, Whitefield` |
| **Address line (exact, as shown on GBP)** | `1st Floor, Samvit Greens, 71/1A, Sarjapur - Marathahalli Rd, Kasavanahalli, Kaikondrahalli, Bengaluru, Karnataka 560035` | `1st Floor, 150/3, GSR Arcade, 9th Cross, 24th Main Rd, Bengaluru, Karnataka 560102` | `1st floor, Number 267, SV Plaza 60 Feet Road AECS Layout, Whitefield, Brookefield, Bengaluru, Karnataka 560037` ⚠ see decision D2 |
| → `streetAddress` (schema) | `1st Floor, Samvit Greens, 71/1A, Sarjapur - Marathahalli Rd, Kasavanahalli, Kaikondrahalli` | `1st Floor, 150/3, GSR Arcade, 9th Cross, 24th Main Rd` | `1st floor, Number 267, SV Plaza 60 Feet Road AECS Layout, Whitefield, Brookfield` |
| → `addressLocality` / `addressRegion` / `postalCode` / `addressCountry` | Bengaluru / Karnataka / 560035 / IN | Bengaluru / Karnataka / 560102 / IN | Bengaluru / Karnataka / 560037 / IN |
| **Phone (GBP, call)** | 089700 07440 → `+91 89700 07440`, `tel:+918970007440` | 093808 12348 → `+91 93808 12348`, `tel:+919380812348` | **079966 66012** → `+91 79966 66012`, `tel:+917996666012` ⚠ D3 |
| **Hours (all 7 days)** | 10:00 am – 9:30 pm | **10:00 am – 10:00 pm** | **9:00 am – 9:30 pm** |
| Rating · reviews (on 31 Oct) | 4.8 · 459 | 4.9 · 493 | 4.8 · 1,638 |
| Primary category on GBP | Beauty Parlour | Hairdresser | Beauty Parlour |
| Coordinates (GBP pin) | 12.9133092, 77.6789381 | 12.9186529, 77.6492076 | 12.9636011, 77.7093299 |
| Plus code | WM7H+8H | WJ9X+FM | XP75+CP |
| Google Maps link (opens this exact listing) | `https://www.google.com/maps?cid=2447554241101026298` | `https://www.google.com/maps?cid=17729263556490350929` | `https://www.google.com/maps?cid=3366119781327561907` |
| Attributes | LGBTQ+ friendly · Identifies as women-owned | LGBTQ+ friendly · Identifies as women-owned | LGBTQ+ friendly · Identifies as women-owned |
| Website field on GBP | xingsalon.in ⚠ | xingsalons.com | xingsalon.com (booking: salonboost.online) ⚠ |

**Totals across the 3 profiles:** 2,590 reviews; weighted average rating 4.82, displayed as **4.8**.

## B. What the website currently gets wrong (from `src/data/branches.ts` + a repo grep)

| # | Site today | GBP | Fix |
|---|---|---|---|
| 1 | One shared `SALON_HOURS` = 10:00 AM – 9:30 PM for all salons ("All three salons keep the same hours") | HSR is open until **10 pm**; Brookfield opens at **9 am** | **Per-salon hours** (Step 1). Remove every "all salons 10 AM – 9:30 PM" claim (Step 3) |
| 2 | HSR `fullName` "Xing Premium Unisex Salon, HSR Layout" | "Xing Premium Unisex Salon - HSR Layout" | Use the exact GBP name |
| 3 | Brookfield `fullName` "Xing Premium Unisex Salon, Brookfield" | "Xing Premium Unisex Salon - Brookfield, Whitefield" | Use the exact GBP name |
| 4 | HSR street "150/3, GSR Arcade, 9th Cross, 24th Main Rd, HSR Layout" | Starts with **"1st Floor,"** and has no "HSR Layout" in the address | Use the exact GBP address |
| 5 | Brookfield street "1st Floor, SV Plaza, No. 267, 60 Feet Rd, AECS Layout, Brookfield" | "1st floor, Number 267, SV Plaza 60 Feet Road AECS Layout, Whitefield, Brookefield" | Use the GBP wording, with D2 for the spelling |
| 6 | Brookfield phone **8147111344** | **079966 66012** | Calls use the GBP number; WhatsApp stays on 8147111344 (D3) |
| 7 | Ratings: Sarjapur 319, HSR 393, Brookfield 4.9 · 1,552; site-wide "4.9 · 2,264+" | 459; 493; 4.8 · 1,638; total 2,590, average 4.8 | Step 1 + Step 4 |
| 8 | HSR coordinates 12.9186477, 77.6491593; Brookfield has none | See table A | Use the GBP pin for all 3 |
| 9 | Map links: short `maps.app.goo.gl` links for 2 salons, none for Brookfield | — | Use the `cid` links for all 3 |
| 10 | Schema type is probably the same for all 3 salons | GBP categories differ | Step 5 |

## C. Owner decisions (already made; apply them)

- **D1, display names.** In headings and running text the site keeps the short salon names ("Sarjapur Road", "HSR Layout", "Brookfield"). These are labels, not legal names. Wherever the **full business name** appears (salon page H1 sub-line, footer address blocks, contact cards, schema `name`, emails, `/salons` cards, About), use the **exact GBP name** from table A, character for character, including the hyphen and comma.
  - Change the short label "Sarjapura Road" to **"Sarjapur Road"**. That matches the GBP *address* ("Sarjapur - Marathahalli Rd") and the owner's wording.
  - The **full** Sarjapur name keeps "Sarjapura Road", because that is the exact GBP name.
- **D2, Brookfield spelling.** The GBP address has a typo: "Brook**e**field". The website writes **"Brookfield"**. The owner fixes the GBP typo (Part D). Everything else in that address follows the GBP wording and order exactly.
- **D3, Brookfield phone.** GBP lists **079966 66012** (it looks like a call-tracking number, since "079" is an Ahmedabad area code).
  - Call links and the displayed phone use it, because the GBP is the priority.
  - **WhatsApp stays on 8147111344**, because a landline can't receive WhatsApp. Use the existing `whatsapp?` field in the `salon()` input: `phone: '7996666012', whatsapp: '8147111344'`.
  - Put a `// OWNER: confirm 079966 66012 rings at the Brookfield salon` comment next to it, and list it in the final report.
- **D4, review counts change every day.** Store the exact values with `ratingAsOf: '2026-10-31'`.
  - **Display** them rounded down with a "+": 450+, 490+, 1,600+, total **2,550+**. Rating to 1 decimal: 4.8 / 4.9 / 4.8, overall 4.8.
  - Rounding down keeps the site true as counts grow. Calculate the total and average from the 3 salons. Never type them by hand.
- **D5, schema ratings.** Don't put `aggregateRating` or `review` in JSON-LD built from Google reviews. Google's guidelines don't allow self-serving or third-party review markup on your own LocalBusiness, so remove it if it's there. Ratings stay as visible text only, with a link to the salon's Google reviews.
- **D6, website URL.** The site is `https://www.xingsalons.com` (`site.url`). The GBPs point to three different domains. That is fixed on the GBP side (Part D). The website code doesn't change for it.

## Step 1: one source of truth in `src/data/branches.ts`

1. Extend the `salon()` input and output type with these fields:
   - `gbpName`
   - `street` (exact GBP street, table A)
   - `locality: 'Bengaluru'`, `region: 'Karnataka'`
   - `addressLine` (the exact one-line GBP address, built from the parts and asserted in a test)
   - `phone`, `whatsapp?`
   - `hours: { opens: 'HH:MM', closes: 'HH:MM', days: 7 }`
   - `rating: { value, count, asOf }`
   - `gbpCategory`
   - `lat`, `lng`, `plusCode`
   - `mapsUrl` (the `cid` link)
   - `attributes: ['LGBTQ+ friendly', 'Women-owned']`

   Fill them **exactly** from table A, applying D1–D3. Keep `id`, `name` (short label), `area`, `areasServed`, `photos` and the rest as they are.
2. Replace the shared `SALON_HOURS` with a per-salon getter, `hoursFor(salon)`, which returns `{ opens, closes, label: '10:00 AM – 10:00 PM', opensLabel, closesLabel }`. Keep `SALON_HOURS.timeZone` and `dayNames`.
   - Make `SALON_HOURS` a derived summary for places that need one line: **"Open daily · hours vary by salon"**.
   - Delete the comment "All three salons keep the same hours".
3. Make these read from the salon's own hours:
   - `useSalonStatus` (open-now chip)
   - the booking form's time slots
   - the salon status chip (`StatusChip.tsx`)

   So HSR shows "Open · closes 10 PM", and Brookfield's slots start at 9:00.
4. `phone` is formatted by the existing helper (`+91 79966 66012`, `tel:+917996666012`). `whatsappHref` uses `whatsapp ?? phone`.
   - In `server/config.ts` and `.env.example`, the default `WA_NUMBER_BROOKFIELD` stays `8147111344`.
   - Check `src/lib/whatsapp.ts` and `src/shared/leadMessages.ts` use the WhatsApp number, not the call number.
5. In `content.ts`, `site.rating` / `site.reviewCount` (and `reviews.ratingLabel`) are **calculated** from `locations` (D4): `4.8` and `'2,550+'`. `ratingLabel()` shows the rounded-down count.

## Step 2: find every hardcoded copy (one grep, then fix each hit)

```bash
grep -rnE "8147111344|81471 11344|9:30|9\.30|21:30|10:00 ?AM|10 ?AM|9 ?AM|10 ?PM|hours vary|every day|same hours|2,264|2264|1,552|1552|\b393\b|\b319\b|4\.9|Sarjapura Road|GSR Arcade|SV Plaza|Samvit Greens|AECS Layout, Brookfield|60 Feet Rd|No\. 267|maps\.app\.goo\.gl|12\.9186477|77\.6491593" \
  src content server index.html vite.config.ts public/site.webmanifest public/robots.txt tests README.md \
  > /tmp/gbp-hits.txt; wc -l /tmp/gbp-hits.txt
```

For each hit:
- **Data values** (addresses, phones, coordinates, map links, ratings) → replace them with a reference to the `locations` field. Never retype the value. This covers `content.ts` (`locationsSection`, the footer, the 404 page), `about.ts`, `branchPages/*.ts`, `faqPage.ts`, `offersPage.ts`, `novemberOffersPage.ts`, `giftMembership.ts`, `src/data/pages/*.ts`, `seo.ts` and `server/emails.ts`.
- **Copy text** that states hours or ratings, in FAQs, intros, blog posts in `content/blog/*.md` and meta descriptions:
  - **Per salon:** "Xing HSR Layout is open every day, 10 AM – 10 PM."
  - **All salons:** "Open every day: Sarjapur Road 10 AM – 9:30 PM, HSR Layout 10 AM – 10 PM, Brookfield 9 AM – 9:30 PM." Or the short form "Open daily · hours vary by salon" in tight UI.
  - FAQ text that's sent in schema must stay **identical** to the visible text.
- **"Sarjapura Road" as a short label** → "Sarjapur Road" (D1). Keep it only inside the exact GBP name.
- **Ratings in copy**, e.g. "4.9 on Google · 2,264+ reviews" in the hero trust row, `/offers`, About, the membership page and meta → use the calculated values: "4.8 on Google · 2,550+ reviews".
- **The home `<title>` and descriptions** that list salons keep Sarjapur → HSR → Brookfield order and stay ≤ 60 / ≤ 155 characters.
- **Blog posts:** change only the sentences that state salon facts. Don't rewrite the articles. Update `updatedDate` only on posts you change.

## Step 3: every place the salon facts appear must render from `locations`

Check each of these renders from `locations` and shows the right fields. Fix any that don't.

| Place | Must show |
|---|---|
| Header call button / salon picker / sticky bottom bar / floating WhatsApp | per-salon **call** number and **WhatsApp** number (Brookfield: 79966 66012 to call, 81471 11344 for WhatsApp) |
| Footer | the 3 GBP names, GBP address lines, phones, hours (per salon), "Directions" → `mapsUrl` |
| `/salons` cards, the 3 salon pages (hero, "How to reach", hours block, FAQ), home "Our Branches" + "Inside Xing" tabs, About, `/faq` "Our salons" group, offers pages' salon rows, booking form salon step, gift/membership form salon select, 404 page | the same fields, in Sarjapur → HSR → Brookfield order |
| Emails (`server/emails.ts`) and lead WhatsApp text | GBP name + address line + call number of the chosen salon |
| "Directions" buttons | `https://www.google.com/maps/dir/?api=1&destination=<encoded GBP name + address>&destination_place_id` is not available, so use `mapsUrl` (cid) for "View on Google", and `dir/?api=1&destination=<lat>,<lng>` for turn-by-turn |
| Google reviews links | `mapsUrl` (opens the listing's reviews) |

**Address display format:** show the exact GBP line, wrapped naturally on 2–3 lines. Don't reorder the parts or abbreviate them differently ("Rd" stays "Rd", "Road" stays "Road", exactly as on GBP). Phone display is always `+91 XXXXX XXXXX`.

## Step 4: SEO-strong local content structure (keeps NAP exact)

- **Each salon page** (`/salons/<id>`):
  - H1 keeps its keyword ("Premium Unisex Salon in HSR Layout, Bangalore").
  - Directly under the hero, add a **NAP block**:
    - the exact GBP name in bold, address line, phone
    - today's hours plus a "See all hours" disclosure with the 7-day table
    - an open-now chip and a rating line ("4.9 ★ · 490+ Google reviews", linking to `mapsUrl`)
    - Call / WhatsApp / Directions buttons
    - the plus code in small grey text
  - This block uses `<address>` markup.
  - Add a "Hours" FAQ answer generated from the data ("Is Xing HSR Layout open on Sunday?" → "Yes. Xing Premium Unisex Salon - HSR Layout is open every day, 10 AM – 10 PM.").
- **Footer:** the 3 NAP blocks in salon order. This is the strongest site-wide NAP signal, so it must be byte-identical to the salon pages (same component, `SalonNap`).
- **One shared `SalonNap` component** used by the footer, salon pages, `/salons`, About, the contact sections and the offers salon rows. No other component prints an address or phone.
- Hours, phone and address are plain HTML text (not images) and are in the prerendered HTML.

## Step 5: schema (in `src/data/seo.ts`, built from `locations`)

For each salon, emit **one** node with a stable `@id` `${site.url}/salons/<id>#salon`:
- `@type`:
  - Sarjapur Road and Brookfield: `["BeautySalon", "HairSalon"]` (GBP "Beauty Parlour").
  - HSR Layout: `["HairSalon", "BeautySalon"]` (GBP "Hairdresser").
- `name`: the exact GBP name.
- `address`: `PostalAddress` (streetAddress / addressLocality / addressRegion / postalCode / addressCountry), exactly from table A.
- `telephone`: `+91-XXXXX-XXXXX` (the call number).
- `geo`: lat/lng from table A.
- `hasMap`: `mapsUrl`.
- `url`: the salon page.
- `openingHoursSpecification`: one entry, all 7 `dayOfWeek`, with that salon's `opens`/`closes`.
- `priceRange: "₹₹"` (only if it's already present).
- `image`: 3 salon photos.
- `parentOrganization`: `{ "@id": "${site.url}/#organization" }`.
- `areaServed`: from `areasServed`.
- `amenityFeature` for the GBP attributes, using `LocationFeatureSpecification` (`"LGBTQ+ friendly"`, value true).
- `sameAs: [mapsUrl]`.
- **No `aggregateRating` or `review`** (D5).

The `Organization` node lists the 3 salons in `subOrganization` (or `department`), in salon order. Every other page that references a salon (offers, services, blog posts) points to these `@id`s instead of repeating the address.

## Step 6: tests that lock it in (`tests/gbp.test.ts`)

- For each salon, assert every table-A field equals a constant `GBP` fixture: `gbpName`, `addressLine`, `phone`, `whatsapp`, `hours`, `lat`/`lng`, `mapsUrl` and `plusCode`. The fixture lives in `tests/fixtures.ts`, with a comment "copied from Google Business Profile on 2026-10-31; update both together".
- Build `dist/`, then for every HTML file assert:
  - No phone number appears other than the 3 call numbers, the Brookfield WhatsApp number (only inside `wa.me` links) and the grievance number.
  - No `8147111344` appears in a `tel:` link.
  - No "2,264", "1,552", "393 Google" or "319 Google" appears.
  - No "10:00 AM – 9:30 PM" appears for HSR or Brookfield.
  - "Sarjapura Road" appears only inside the exact GBP name.
  - Every JSON-LD salon node's name, address, telephone, geo and hours match the fixture.
  - No `aggregateRating` appears.
- The open-now test at 21:45 IST: HSR is open, Sarjapur and Brookfield are closed. At 09:30 IST: Brookfield is open, the other two are closed.

## Step 7: verify, then report

1. `npm run build && npm test`, then `node scripts/seo-audit.mjs` if it exists. 0 errors.
2. Re-run the Step 2 grep. Every remaining hit must be intentional; paste the remaining lines with one-word reasons.
3. Run `npm run dev` and, at 390 px, check:
   - the footer, the 3 salon pages, `/salons`, the home branch tabs, the booking form salon step, `/offers/november` salon rows and the `/faq` salon group all show identical names, addresses and phones, with HSR closing at 10 PM and Brookfield opening at 9 AM
   - tapping Call on Brookfield dials 79966 66012 and WhatsApp opens 81471 11344
4. Update **README.md**:
   - a new section "Salon details = Google Business Profile", saying the source is `branches.ts` and the fixture is `tests/fixtures.ts`, how to update them when the GBP changes (edit both, rebuild), the D1–D6 decisions, and the Part D checklist
   - a dated **Change log** line
5. Reply with ONLY: the files changed, the remaining intentional grep hits, the owner TODOs (D3 phone check + Part D).

## Part D: the owner fixes these inside Google Business Profile (code can't)

1. **Website field: point all 3 to the same domain.** Each salon's GBP website should be **`https://www.xingsalons.com/salons/<id>`** (sarjapur-road / hsr-layout / brookfield). Today Sarjapur points to xingsalon.**in**, Brookfield to xingsalon.**com** (with a salonboost.online booking link) and HSR to xingsalons.com. If xingsalon.in and xingsalon.com are yours, 301-redirect them to xingsalons.com.
2. **Brookfield address typo:** change "Brook**e**field" to "Brookfield". Also add the missing comma, "SV Plaza, 60 Feet Road", if Google allows it. Then tell the agent to update `street` and the fixture to the exact new text.
3. **Brookfield phone:** confirm 079966 66012 is your number. If it's an agency tracking line you don't control, change the primary phone to the salon's own number (and add it as the secondary), then update the site.
4. **Names:** the three names use different punctuation (comma vs hyphen). Optional cleanup, within Google's naming rules (real-world signage name + location only if it's part of the branding): use one pattern, e.g. "Xing Premium Unisex Salon - Sarjapur Road". If you change any name, update `gbpName` + the fixture the same day.
5. **Categories:** make them consistent. Primary **Hair salon** (or Beauty salon) on all 3, with secondary Beauty salon, Nail salon, Hairdresser. Today it's Beauty Parlour / Hairdresser / Beauty Parlour.
6. **Hours:** if HSR's 10 PM close and Brookfield's 9 AM open aren't right, fix them on GBP first. The site follows the GBP. Add **special hours** for holidays (Google already flags 1 Nov, Karnataka Rajyotsava, as "hours might differ").
7. **Services, products and offer posts:** add the November offers as GBP posts on all 3 profiles, with the "Learn more" button linking to `https://www.xingsalons.com/offers/november?utm_source=google&utm_medium=organic&utm_campaign=gbp-post`.
