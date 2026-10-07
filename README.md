# XING Premium Unisex Salon — website

Single-page salon site built with Vite, React, TypeScript, Tailwind CSS, Framer Motion and Lucide icons.

## Setup

```bash
npm install
npm run dev       # local dev server (http://localhost:5173)
npm run build     # type-check + production build into /dist
npm run preview   # serve the production build (http://localhost:4173)
```

Requires Node 18 or newer. Deploy the `dist` folder to any static host.

## Changing content

All copy, links, phone numbers, opening hours, offers, FAQs, reviews and locations live in one file:

**`src/data/content.ts`**

Edit it and the page, the booking form, the page title/description and the Google `HairSalon` schema for each location all update together. Things to set before going live:

| What | Where in `content.ts` |
| --- | --- |
| Live domain (used for canonical URL, Open Graph, schema) | `site.url` |
| Opening hours (drives the "Open now / Closed" badge and booking slots) | `site.hours` |
| Each salon: address, phone, email, Google Maps link, description | `locations` |
| Which salon's phone/WhatsApp the header and chat button use | `primaryLocation` |
| Social profile links | `footer.socials` |
| Full service menu (categories and service names, no prices) | `serviceMenu` |

## Swapping images

Images are in **`public/images`**. The logo, hero, service cards, "Why Choose XING" photo, salon gallery and location galleries use real XING photos. Guides, hair color, offers, transformations and the bridal banner are still Unsplash placeholders.

To replace one, save your photo over the file with the **same name**, as WebP, at roughly the same size:

| Files | Used for | Size (px) |
| --- | --- | --- |
| `hero.webp` | Hero salon photo | 1200 × 858 |
| `hero-arch.webp` | Hero arched salon photo | 520 × 800 |
| `svc-hair`, `svc-skin`, `svc-nails`, `svc-men` | Service cards | 640 × 480 |
| `guide-*.webp` | Beauty guide cards | 640 × 400 |
| `color-global`, `color-balayage`, `color-ombre`, `color-fashion` | Hair color circles | 400 × 400 |
| `offer-*.webp` | Offer cards | 560 × 400 |
| `tf-*.webp` | Before/after sliders | 720 × 480 |
| `why-salon.webp` | "Why Choose XING" photo | 520 × 700 |
| `bridal.webp` | Bridal banner | 1200 × 700 |
| `loc-<salon>-1.webp`, `-2`, … | Location card photo galleries | 800 × 600 |
| `logo.webp`, `logo-light.webp` | Logo for light / dark backgrounds (transparent) | 480 × 235 |
| `og.jpg` | Link-preview image (JPEG) | 1200 × 630 |

If you use a different file name or size, update the matching `img(...)` entry in `content.ts` (name, alt text, width, height).

**Salon photos:** each location card shows a small gallery. To add photos for a salon (e.g. Brookefield), save them as `loc-brookefield-1.webp`, `loc-brookefield-2.webp`, … and add one description per photo to that salon's `photos` list in `content.ts`. A salon with an empty list shows "Photos coming soon".

**Before/after photos:** each slider currently uses one placeholder photo for both sides, with the "before" side automatically dimmed. Once you have real pairs, add files such as `tf-haircolor-1-before.webp` and point the `before` / `after` entries in `transformations` at them — the dimming switches off as soon as the two files differ.

`npm run images` re-downloads the placeholder set (it will overwrite files of the same name).

## Booking form

The booking modal validates the three steps and ends with a summary plus a "Confirm on WhatsApp" button that opens a pre-written message to the WhatsApp number of the salon the client chose. It does **not** send the request anywhere by itself — to store bookings or send notifications, post the form data to your booking system or API in `onSubmit` in `src/components/BookingModal.tsx`.

## Project layout

```
index.html                 fonts, meta tags (filled in from content.ts at build time)
tailwind.config.ts         design tokens: colors, fonts, spacing, shadows, animations
src/data/content.ts        all content
src/components/            one component per section, plus BookingModal, BeforeAfter, FloatingActions
src/components/ui/         shared pieces: Button, Modal, CountUp, Floral line-art, Reveal, etc.
src/hooks/                 scroll-spy, media query, open-now
src/context/booking.tsx    opens the booking modal from any "Book" button
```
