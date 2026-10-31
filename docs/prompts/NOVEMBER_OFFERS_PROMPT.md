# Prompt: build the November 2026 hair colour offers page (`/offers/november`)

> Paste everything below the line into your coding agent, run from the project root (`xing salon 1`).
> First fill in **section 0**. It decides the highlights price, which the posters disagree on.

---

You are working in an existing Vite + React 18 + TypeScript + Tailwind + Framer Motion site for XING Premium Unisex Salon (3 salons in Bangalore). It is a multi-page site: each route is its own HTML document, built by the SEO plugin in `vite.config.ts`. Your job is to add a **standalone, conversion-focused November offers page** for 3 hair colour offers, and show the same offers on all 3 salon pages, `/offers`, the home page and the offer popup. Work efficiently: follow the reading budget, reuse what exists, and make edits, not rewrites.

## 0. Decisions (the owner fills these in; if any is still `ASK`, stop and ask before building)

```
HIGHLIGHTS_WAS      = 499     # The posters disagree: highlights poster ₹599, "up to 50%" poster ₹499. Use the real regular price.
                              # Default 499 never overstates the saving.
ROUTE               = /offers/november
CAMPAIGN_START      = 2026-11-01
CAMPAIGN_END        = 2026-11-30   # From the posters ("Valid until November 30th"). Ends 23:59 Asia/Kolkata.
COMBINE_OFFERS      = no      # Can a client combine November offers with each other or with Tuesday 25%?
                              # Default: one offer per service, not with Tuesday Happy Hours.
PATCH_TEST_FREE     = ASK     # Is the patch test free? If unknown, say "available on request".
OLAPLEX_ADDON       = paid add-on   # From the site: Olaplex can be added to any colour.
```

## 1. Facts: the ONLY prices, claims and dates you may use

The source posters are in `offers for november/` (PNG, ~2 MB each):

| id | Poster file | Offer | Was | Now | Unit | Saving (computed) |
|---|---|---|---|---|---|---|
| `nov-global-colour` | `Global Hair Color Offer.png` | Global Hair Colour, flat price at **any length** | ₹5,999 | ₹3,999 | per service | ₹2,000 · 33% |
| `nov-highlights` | `Premium Highlights Salon Offer.png` | Hair Highlights | ₹`HIGHLIGHTS_WAS` | ₹399 | per streak; **8–10 streaks recommended** | computed |
| `nov-colour-menu` | `Pink Salon Promotion_ Up to 50% Off.png` | Hair Colour Menu: Global ₹5,999→₹3,999 (any length) · Highlights ₹499→₹399/streak · **Crazy Colour ₹799→₹499/streak** · **Balayage from ₹7,999→₹5,499** | — | — | — | max real saving 37% |

Each poster also says: valid until 30 November, Premium products · Expert stylists · Stunning results. They are valid at all 3 salons (`brookfield`, `hsr-layout`, `sarjapur-road`).

**Trust rules. These are hard requirements: the client must feel these offers are genuine.**
1. **Never print "up to 50%" or "-40%".** The posters' own numbers don't support them. Compute every percentage with the existing `savingPercent()` in `src/data/offers.ts`, which rounds down. Lead with **rupees saved**, which Indian shoppers trust more: "Save ₹2,000", "Save up to ₹2,500 on hair colour this November".
2. Show the full price for highlights, not just "₹399": "8–10 streaks ≈ ₹3,192–₹3,990 total". Calculate it from the data. Never hardcode it.
3. Countdown: allowed **only** because the end date is real. Show "Ends 30 Nov · N days left", calculated in Asia/Kolkata. No ticking seconds, no fake "only 2 slots left", no fake viewer counts, no pre-ticked add-ons. India's CCPA 2023 dark-pattern guidelines ban false urgency, false scarcity and drip pricing.
4. The poster models are promotional images, not clients. Never caption them as client results. For "real results" use only the existing client media in `src/data/media.ts` and the `work-*` photos.
5. The highlights poster tagline "Global color. Stunning you." is a poster mistake. Don't copy it.
6. Reviews: reuse only the real ones in `content.ts` (`reviews.items`). Don't invent reviews, counts or ratings. Rating and count come from `site.rating` / `site.reviewCount`.
7. Every price line says "Price confirmed at consultation before we start · Pay at the salon, nothing online" (the existing policy).

## 2. Reading budget (read only these; use `grep -n` / `sed -n` ranges, not whole-file dumps)

- `README.md` (offers + pages sections), `src/data/offers.ts`, `src/data/offersPage.ts`, `src/lib/offers.ts`, `src/lib/route.ts`, `src/App.tsx`
- `src/pages/OffersPage.tsx` and `src/components/offers/*`: reuse `OfferCard`, `OfferSheet(s)`, `OffersShowcase` patterns
- `src/pages/BranchPage.tsx`, `src/data/branchPages/{types,brookfield,hsr-layout,sarjapur-road}.ts` (the offers + FAQ parts only)
- `src/data/seo.ts`: `PageMeta`, `offerNode`, `offersMeta`, `routes`, the breadcrumb helper, `og()`
- `vite.config.ts`: `SHELLS`, the page→chunk map (~line 170–200), `extra()` in `seoPlugin`
- `src/components/service/{SectionHeader,FAQAccordion,MobileStickyBar,Sections}.tsx`, `src/components/BeforeAfter.tsx`, `Reels.tsx`, `Reviews.tsx`, `blog/FromOurBlog.tsx`, `blog/BlogCard.tsx`
- `src/lib/analytics.ts`, `src/lib/whatsapp.ts`, `src/data/media.ts` (grep for colour/highlight/balayage entries only)
- `src/data/pages/hair-color.ts`: only for linking to the service pages `global-hair-color`, `highlights`, `balayage`, `fashion-color`

**Never open** `node_modules/`, `dist/`, `server-dist/`, any photo/video folders, or `package-lock.json`. Don't read blog bodies; `ls content/blog` and grep front matter for title/slug. Don't take screenshots unless a check fails.

## 3. Data: one source of truth

Add to `src/data/offers.ts` (keep the file free of React/asset imports: `vite.config.ts` reads it):

```ts
export interface CampaignOffer {
  id: 'nov-global-colour' | 'nov-highlights' | 'nov-colour-menu';
  title: string; hook: string; sub: string;
  lines: Array<{ label: string; was: number; now: number; unit?: 'per streak'; from?: boolean; note?: string }>;
  includes: string[]; idealFor: string[]; duration: string; upkeep: string;
  serviceLink: string; bookingService: string;  // bookingService must exist in booking.services
  poster: OfferImage;                           // offer-nov-<slug>-480/800/1200.webp
  tag?: 'Best value' | 'Most popular';          // only if true: "Best value" = biggest ₹ saving (balayage/global)
  terms: string[]; faq: Array<{ q: string; a: string }>;
  relatedBlog: string[];                        // slugs that exist in content/blog
}
export const novemberCampaign = {
  id: 'november-2026', path: '/offers/november',
  start: '2026-11-01', end: '2026-11-30', timeZone: 'Asia/Kolkata',
  showPrices: true,   // campaign-only override; the site-wide SHOW_PRICES stays false
  branches: ALL_BRANCHES, offers: [/* 3 CampaignOffer */] as CampaignOffer[],
};
export const isCampaignLive = (now = new Date()) => /* start ≤ now ≤ end 23:59:59 IST */;
export const daysLeft = (now = new Date()) => /* whole days, IST */;
export const maxSavingRupees = () => /* max(was-now) across lines → 2500 */;
```

- Durations and upkeep: reuse the existing site copy (global 1.5–2 h, root touch-up every 4–6 weeks; balayage 3–4 h, gloss every 6–8 weeks). Don't invent new ones.
- Highlights `includes`: consultation, strand/shade selection, placement plan (8–10 streaks recommended), toning where needed, blow-dry finish. Mark anything not confirmed with `// TODO owner`.
- **Expiry behaviour:** after `end`, every embed (salon pages, `/offers` banner, home, popup) hides itself automatically. The page stays at the same URL so its search ranking isn't lost: it shows "The November offers have ended" plus links to `/offers` and the colour service pages, schema offers get `availability: Discontinued`, and the countdown disappears. Before `start`, show "Starts 1 Nov".
- Add each id to `OFFER_ALIASES` or a campaign lookup so `promoHref` and hash links work: `/offers/november#nov-highlights`.

## 4. Images

Convert the 3 posters to WebP at 480/800/1200 px wide, named `public/images/offer-nov-global-colour-*.webp`, `offer-nov-highlights-*.webp`, `offer-nov-colour-menu-*.webp`, quality ~78. Use `npx --yes sharp-cli` or `cwebp`, whichever installs. Don't add a runtime dependency. Also make one 1200×630 share image, `public/og/og-offers-november.jpg`, with **no prices** (same rule as the other OG images): the global colour poster's photo side plus "November Hair Colour Offers · Xing". Alt text example: "November hair colour offer at Xing Salon Bangalore – global hair colour at any length, save ₹2,000".

## 5. The page `/offers/november` (new `src/pages/NovemberOffersPage.tsx`, copy in new `src/data/novemberOffersPage.ts`)

It should be about as long as `/services/keratin-treatment` (~15 sections). Mobile first: the price, saving and Claim button must be visible on the first screen at 390 px. Sections in this order (ids in brackets):

1. **Hero** `#top`: eyebrow "November Offers · Valid till 30 Nov". H1 **"Hair Colour Offers in Bangalore this November"**. Sub: "Save up to ₹2,500 on global colour, highlights, crazy colour and balayage at all 3 Xing salons." (₹ figure from `maxSavingRupees()`). Three jump chips (Global · Highlights · Balayage & Crazy). Primary "Claim on WhatsApp", secondary "Book a slot". Trust row: ★ rating Google · review count · 3 salons · Price confirmed before we start. Live "N days left" chip. Add the hero to `SHELLS` in `vite.config.ts` so the H1 and price show before any script loads (copy the membership pattern).
2. **The 3 offer cards** `#offers` (the main conversion block). Per card: poster 4:5 image (`srcSet`, lazy except the first), title, the **familiar price pattern** ~~₹5,999~~ **₹3,999** + a pill "Save ₹2,000 · 33% off", unit ("per streak", "from"), 3 includes, duration, "Valid till 30 Nov · all 3 salons", a primary **Claim** (opens the existing salon picker → WhatsApp prefilled via `claimText`, extended with the price, e.g. "…claim the *Global Hair Colour* November offer (₹3,999, any length)…"), a secondary **Book** (`bookingService`), and a **"Details & terms"** sheet (reuse `OfferSheet`). The menu card shows all 4 lines as a mini price table. Use the `tag` only where it is true.
3. **"Which offer is right for me?"** `#choose`: a 3-question picker (Full colour change or grey coverage → Global · Natural dimension, low upkeep → Highlights/Balayage · Bold statement → Crazy colour). The result scrolls to the card. Pure client-side state, no new libraries.
4. **Price transparency table** `#prices`: every line with Was / Now / You save ₹ / %. Highlights row: "8–10 streaks ≈ ₹3,192–₹3,990". Below it: "No hidden charges. Olaplex is an optional add-on; your colourist confirms the final price before starting."
5. **Global Hair Colour deep-dive** `#nov-global-colour`: answer-first paragraph (40–60 words: what, price, any length, duration), who it suits, what happens, how long it lasts, aftercare, link to `/services/global-hair-color`.
6. **Highlights deep-dive** `#nov-highlights`: the same structure, plus "How many streaks do I need?" with a 6 / 8 / 10 streak cost example calculated from the data. Link `/services/highlights`.
7. **Balayage & Crazy Colour deep-dive** `#nov-colour-menu`. Links `/services/balayage`, `/services/fashion-color`.
8. **Real results** `#results`: existing colour before/after pairs (`BeforeAfter`) + highlights/balayage reels (`Reels`) + 6 `work-balayage`/`work-highlights` photos. Caption: "Our own clients, photographed in our salons."
9. **Safe colour promise** `#safety`: free consultation, patch test (`PATCH_TEST_FREE` wording), hair-health check, Olaplex option, shade matched to skin tone. Reuse the existing home-page copy where possible.
10. **How to claim, in 3 steps** `#how`: Claim on WhatsApp → salon confirms time & price → visit & pay at salon.
11. **Why are these offers genuine?** `#genuine`: it's a seasonal November campaign; same stylists, same premium products and same service as full price; what is NOT included (e.g. Olaplex add-on, extra streaks beyond those booked); one offer per service; not with Tuesday Happy Hours (`COMBINE_OFFERS`); the price is locked at consultation.
12. **Reviews** `#reviews`: the colour-related real reviews + rating + "Read all reviews on Google".
13. **Claim at your nearest salon** `#salons`: the 3 branch cards (reuse `LocationCards` / branch data): address, open-now chip, call, directions, "Claim at <salon>" (WhatsApp prefilled with that salon).
14. **FAQ** `#faq` (10 questions, answer-first, 40–60 words, exactly the same text in the page and in the schema): How much is global hair colour at Xing Bangalore? · Is ₹3,999 the price for long hair too? · How much do highlights cost in total? · How many streaks do I need? · How much is balayage this November? · Till when is the November offer valid? · Is the offer valid at all branches? · Can I combine offers? · Do I need a patch test? · Will colour damage my hair? · Do I pay online?
15. **Blog** `#guides`: 4 existing posts via `BlogCard`. Prefer `balayage-vs-highlights`, `hair-colour-indian-skin-tone`, `make-hair-colour-last`, `grey-hair-coverage-options`. Fallbacks: `what-is-olaplex`, `root-touch-up-frequency`, `fashion-hair-colour-guide`, `ammonia-free-hair-colour`. Check each slug exists. Add "View all articles".
16. **Final CTA band** + the existing `MobileStickyBar` showing "Claim November offer · N days left".

Copy tone: warm, specific and plain, in Indian English, with rupee formatting `₹3,999` (`formatPrice`). No hype words like "unbelievable" or "crazy deal".

## 6. Embeds (the same data everywhere; each embed shows only while `isCampaignLive()`)

- **Salon pages** (`BranchPage.tsx`): above the existing "Offers at Xing <Salon>" grid, add a compact **"November Hair Colour Offers"** strip with the 3 cards in the compact variant, showing the price, saving, "N days left" and **Claim prefilled with that salon** (no picker). Add a link "See all November offer details → /offers/november#<id>". Update each branch's offer FAQ answer (`brookfield.ts`, `hsr-layout.ts`, `sarjapur-road.ts`) to mention the November prices and **remove "up to 50%"**. Add the 3 offers to each branch's JSON-LD.
- **`/offers`**: a featured banner at the top: "November: Save up to ₹2,500 on hair colour → View November offers". Also fix the existing "up to 50%" claims in `offersPage.ts` (seo.description, hero.text) and in the `hair-colour` offer `badge` to real figures ("Save up to 37%" / "Save up to ₹2,500"). Keep the other offers.
- **Home** (`#offers` section / `promos`): during the campaign, the first card becomes the November colour offer, linking to `/offers/november`.
- **Offer popup**: during the campaign, show the November offer (global colour, ₹3,999, any length, N days left) with Claim + "See all 3".
- **Nav / footer**: if there is an Offers link, add a small "Nov" badge while the campaign is live.

## 7. SEO + AEO

- `src/data/seo.ts`: add `novemberOffersMeta: PageMeta`. Title (≤60): **"Hair Colour Offers Bangalore – November | Xing Salon"**. Description (≤155): "Global hair colour ₹3,999 at any length, highlights ₹399/streak, balayage from ₹5,499. Valid till 30 Nov at Xing HSR, Sarjapur Road & Brookfield." Register it in `extra()` in `vite.config.ts`, add `if (path === '/offers/november') return novemberPage;` to the chunk map, a route check in `src/lib/route.ts` (`isNovemberOffers`, also excluded from `isNotFound`/`isHome`) and a lazy import in `App.tsx`. It must appear in `sitemap.xml`.
- JSON-LD: `BreadcrumbList` (Home › Offers › November Offers); `OfferCatalog` whose items are `Offer` with `price`, `priceCurrency: "INR"`, `priceValidUntil: "2026-11-30"`, `validFrom`, `availability` (InStock while live, Discontinued after), `url` with `#anchor`, `priceSpecification` (`UnitPriceSpecification`, `referenceQuantity` "streak" for per-streak lines), `itemOffered: Service` → `provider` = the 3 existing HairSalon `@id`s, `areaServed` Bangalore; `FAQPage` from the same FAQ array. **No AggregateRating** on this page.
- AEO: question-style H2/H3s; an answer-first first sentence in every section; a visible "Last updated: <build date>" line; one comparison table (section 4); concrete numbers in the text, not only in images. Internal links to the 4 colour service pages + 3 salon pages + `/offers`. Add a "November hair colour offer" link block to `/services/global-hair-color`, `/highlights` and `/balayage` (the existing offers slot, while live). If `public/llms.txt` exists, add the page with a one-line summary; if not, skip it.

## 8. Analytics (`src/lib/analytics.ts`; no personal data)

Push `nov_offer_view` (once per card in view), `nov_offer_claim`, `nov_offer_book`, `nov_offer_details`, `nov_picker_result`, each with `{ offer_id, branch, placement: 'november' | 'salon' | 'offers' | 'home' | 'popup' }`. Keep the existing `whatsapp_click`.

## 9. Tests (vitest, add `tests/november.test.ts`)

- No string anywhere in `novemberCampaign`, `novemberOffersPage` or the rendered meta contains "50%" or "40%".
- Every displayed % equals `savingPercent()` of its line; `maxSavingRupees() === 2500`.
- `isCampaignLive` / `daysLeft` at 2026-10-31 23:59 IST, 2026-11-01 00:00, 2026-11-30 23:59 and 2026-12-01 00:00.
- The claim WhatsApp text includes the offer name, price and salon, and encodes correctly (follow `whatsapp.test.ts`).
- Every `relatedBlog` slug exists in `content/blog`; every `bookingService` exists in `booking.services`.

## 10. Check, then report (do this once, at the end)

1. `npm run build && npm test`. Fix all type, lint and test errors.
2. `npm run dev`, then open `/offers/november`, `/offers`, `/`, and the 3 salon pages at 390 px and 1280 px: no console errors, no horizontal overflow, all images load, anchor links scroll to the right card, the countdown shows the right days, Claim opens WhatsApp with the right salon and price, the JSON-LD parses (`JSON.parse` on each `script[type="application/ld+json"]`), and title/description lengths are within limits.
3. Fake the date (`?today=2026-12-01`, like the membership page) and confirm: embeds hidden, page shows the ended state, schema says Discontinued.
4. **Update `README.md`**: replace the section "November 2026 hair colour offers (planned, not built yet)" with what was built: the route; where the data lives (`novemberCampaign` in `offers.ts`, `novemberOffersPage.ts`); the poster image names; how to end, extend or replace the campaign next month (change `start`/`end`/`offers`, convert the new posters, done); expiry behaviour; analytics events; the decisions from section 0 and any TODOs. Add the page to the **Pages** table and add a dated line to the **Change log**.
5. Reply with ONLY: the files changed (one line each), owner TODOs, and anything you couldn't verify. No long summary.
