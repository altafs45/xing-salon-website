# Core Web Vitals: Lighthouse mobile

Measured 5 Nov 2026 on the production build, served by `npm start` on localhost, with Lighthouse's simulated mobile
throttling. No analytics IDs were set. Targets: Performance ≥ 90, LCP ≤ 2.5 s, CLS ≤ 0.05, TBT ≤ 150 ms, SEO and Best
Practices 100.

| Page | Performance | SEO | Accessibility | Best Practices | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | 80 | 100 | 97 | 100 | 5.4 s | 0 | 30 ms |
| `/offers` | 100 | 100 | 96 | 100 | 0.9 s | 0 | 30 ms |
| `/offers/hair-colour` | 88 | 100 | 96 | 100 | 3.9 s | 0 | 30 ms |
| `/offers/hair-treatment` | 89 | 100 | 96 | 100 | 3.8 s | 0 | 10 ms |
| `/offers/skin-care` | 89 | 100 | 96 | 100 | 3.8 s | 0 | 30 ms |
| `/salons/hsr-layout` | 86 | 100 | 97 | 100 | 4.2 s | 0.009 | 30 ms |
| `/services` | 100 | 100 | 100 | 100 | 0.9 s | 0 | 20 ms |
| `/services/hair-care` | 100 | 100 | 100 | 100 | 0.9 s | 0 | 10 ms |
| `/services/balayage` | 86 | 100 | 100 | 100 | 4.2 s | 0 | 30 ms |
| `/faq` | 100 | 100 | 96 | 100 | 0.9 s | 0 | 20 ms |
| `/about` | 86 | 100 | 97 | 100 | 4.2 s | 0 | 20 ms |
| `/membership-gift-cards` | 90 | 100 | 100 | 100 | 3.6 s | 0 | 10 ms |
| `/blog` | 87 | 100 | 96 | 100 | 4.0 s | 0 | 0 ms |
| `/blog/balayage-vs-highlights` | 89 | 100 | 96 | 100 | 3.7 s | 0.04 | 20 ms |

What holds LCP back: the largest image on the first screen (the hero photo, or the first offer card on an offer page)
on the simulated slow 4G link, and ~170 KB of JavaScript (gzip) that shares the bandwidth. Next steps: smaller first
images on phones, and splitting the header's menus and the booking form out of the first JavaScript.
