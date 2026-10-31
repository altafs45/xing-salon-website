# Core Web Vitals: Lighthouse mobile

Measured 31 Oct 2026 on the production build, served by `npm start` on localhost, so network time is small. Three runs:

- **Before:** simulated throttling, after prerendering but before the bundle split and image sizes.
- **After:** the same method, on the final build.
- **Devtools:** real 4× CPU and slow-4G throttling applied during the load. This is closer to a real phone, because simulated throttling inflates pages whose HTML already paints without JavaScript.

Columns: Performance, SEO, Accessibility, Best Practices, LCP, CLS, TBT. INP needs real users, so it is not measured here; TBT is the lab stand-in.

| Page | Before | After | Devtools |
| --- | --- | --- | --- |
| `/` | 52 · 100 · 97 · 100 · 6.5 s · 0 · 630 ms | 78 · 100 · 97 · 100 · 5.8 s · 0 · 90 ms | 87 · 100 · 97 · 100 · 2.2 s · 0.002 · 390 ms |
| `/services` | 98 · 100 · 100 · 100 · 0.8 s · 0 · 150 ms | 100 · 100 · 100 · 100 · 0.8 s · 0 · 0 ms | 95 · 100 · 100 · 100 · 2.3 s · 0 · 100 ms |
| `/services/hair-care` | 97 · 100 · 100 · 100 · 0.9 s · 0 · 160 ms | 100 · 100 · 100 · 100 · 0.8 s · 0 · 0 ms | 97 · 100 · 100 · 100 · 2.1 s · 0 · 30 ms |
| `/services/keratin-treatment` | 77 · 100 · 100 · 100 · 4.4 s · 0 · 300 ms | 86 · 100 · 100 · 100 · 4.2 s · 0.009 · 20 ms | 96 · 100 · 100 · 100 · 1.9 s · 0.028 · 160 ms |
| `/salons/sarjapur-road` | 61 · 100 · 96 · 100 · 4.4 s · 0 · 660 ms | 82 · 100 · 96 · 100 · 4.9 s · 0 · 20 ms | 96 · 100 · 96 · 100 · 2.0 s · 0 · 170 ms |
| `/offers` | 65 · 100 · 96 · 100 · 4.3 s · 0 · 500 ms | 81 · 100 · 96 · 100 · 5.3 s · 0 · 10 ms | 92 · 100 · 96 · 100 · 2.2 s · 0 · 240 ms |
| `/membership-gift-cards` | 55 · 100 · 100 · 100 · 4.8 s · 0 · 890 ms | 90 · 100 · 100 · 100 · 3.6 s · 0 · 10 ms | 93 · 100 · 100 · 100 · 2.2 s · 0 · 230 ms |
| `/blog` | 83 · 100 · 100 · 100 · 4.1 s · 0 · 160 ms | 87 · 100 · 100 · 100 · 4.1 s · 0 · 0 ms | 99 · 100 · 100 · 100 · 1.9 s · 0 · 60 ms |
| `/blog/balayage-vs-highlights` | 72 · 100 · 100 · 100 · 3.7 s · 0 · 450 ms | 93 · 100 · 100 · 100 · 3.2 s · 0 · 10 ms | 98 · 100 · 100 · 100 · 1.9 s · 0 · 100 ms |
| `/about` | 65 · 100 · 97 · 100 · 4.1 s · 0 · 600 ms | 90 · 100 · 97 · 100 · 3.6 s · 0 · 20 ms | 96 · 100 · 97 · 100 · 1.8 s · 0 · 180 ms |

## Top opportunities (after)

- `/`: Reduce unused JavaScript; Use efficient cache lifetimes; Minimize main-thread work
- `/services`: Render-blocking requests; Reduce unused CSS; Reduce unused JavaScript
- `/services/hair-care`: Render-blocking requests; Reduce unused CSS; Reduce unused JavaScript
- `/services/keratin-treatment`: Improve image delivery; Reduce unused CSS; Reduce unused JavaScript
- `/salons/sarjapur-road`: Reduce unused JavaScript; Use efficient cache lifetimes; Improve image delivery
- `/offers`: Reduce unused JavaScript; Reduce unused CSS; Improve image delivery
- `/membership-gift-cards`: Reduce unused JavaScript; Use efficient cache lifetimes; Improve image delivery
- `/blog`: Reduce unused JavaScript; Reduce unused CSS; Use efficient cache lifetimes
- `/blog/balayage-vs-highlights`: Reduce unused JavaScript; Reduce unused CSS; Use efficient cache lifetimes
- `/about`: Reduce unused JavaScript; Reduce unused CSS; Use efficient cache lifetimes
