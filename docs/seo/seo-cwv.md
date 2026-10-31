# Core Web Vitals: Lighthouse mobile

Measured 31 Oct 2026 on the production build, served by `npm start` on localhost. Simulated is the method the budget uses. Devtools applies real 4× CPU and slow-4G throttling during the load, which is closer to a real phone, because simulated throttling inflates pages whose HTML already paints without JavaScript.

Columns: Performance · SEO · Accessibility · Best Practices · LCP · CLS · TBT.

| Page | Simulated | Devtools |
| --- | --- | --- |
| `/` | 43 · 100 · 94 · 100 · 6.8 s · 0 · 2,660 ms | 51 · 100 · 94 · 100 · 3.8 s · 0 · 2,590 ms |
| `/services` | 93 · 100 · 100 · 100 · 1.7 s · 0 · 190 ms | 81 · 100 · 100 · 100 · 3.0 s · 0 · 350 ms |
| `/services/hair-care` | 100 · 100 · 100 · 100 · 0.8 s · 0 · 60 ms | 83 · 100 · 100 · 100 · 2.8 s · 0 · 350 ms |
| `/services/keratin-treatment` | 81 · 100 · 100 · 100 · 5.0 s · 0 · 60 ms | 63 · 100 · 100 · 100 · 3.4 s · 0.009 · 970 ms |
| `/salons/sarjapur-road` | 80 · 100 · 97 · 100 · 5.2 s · 0 · 90 ms | 54 · 100 · 97 · 100 · 4.0 s · 0 · 1,140 ms |
| `/offers` | 81 · 100 · 96 · 100 · 5.2 s · 0 · 60 ms | 62 · 100 · 96 · 100 · 3.5 s · 0 · 1,010 ms |
| `/offers/november` | 72 · 100 · 97 · 100 · 5.0 s · 0 · 230 ms | 63 · 100 · 97 · 100 · 3.1 s · 0 · 1,210 ms |
| `/faq` | 79 · 100 · 96 · 100 · 3.7 s · 0 · 410 ms | 71 · 100 · 96 · 100 · 2.9 s · 0.029 · 820 ms |
| `/membership-gift-cards` | 57 · 100 · 100 · 100 · 4.7 s · 0 · 870 ms | 56 · 100 · 100 · 100 · 3.5 s · 0 · 1,630 ms |
| `/blog` | 86 · 100 · 96 · 100 · 4.2 s · 0 · 30 ms | 77 · 100 · 96 · 100 · 2.7 s · 0 · 570 ms |
| `/blog/balayage-vs-highlights` | 74 · 100 · 96 · 100 · 4.0 s · 0 · 500 ms | 76 · 100 · 96 · 100 · 3.4 s · 0 · 360 ms |
| `/about` | 57 · 100 · 97 · 100 · 5.1 s · 0 · 800 ms | 65 · 100 · 97 · 100 · 2.7 s · 0 · 1,850 ms |
