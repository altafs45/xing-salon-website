# Prompt: fix the unstyled flash and blank screen on page load

> Paste everything below the line into your coding agent from the project root (`xing salon 1`).
> It's a short, focused fix. Run it before the copy and consistency prompt.

---

**The bug (seen on a screen recording, 3 Nov, `localhost:5173/#home`):** on every load, the page shows these stages, in order:
1. An **unstyled list of blue links**: "• Sarjapur Road +91 89700 07440 • HSR Layout +91 93808 12348 • Brookfield +91 79966 66012 • Open daily" in Times New Roman on white.
2. Only the berry phone bar on a **blank white page** for several seconds.
3. A pink blank area with the header.
4. Finally, the page.

Clicking a number in the bar on desktop opens Windows' "Open Pick an app?" dialog.

**Causes (found in the code):**
1. **`UtilityBar` is written outside the React root.** `withPageExtras()` in `vite.config.ts` injects `renderToStaticMarkup(UtilityBar)` straight after `<body>`, and the bar is hidden on mobile only by Tailwind classes (`hidden … lg:flex`). Before the CSS arrives, it shows as a raw `<ul>` with default blue links, on every screen size.
2. **CSS is loaded by JavaScript in dev.** `src/main.tsx` does `import './index.css'`, so in dev, Vite injects styles only after the JS runs, and the static bar paints unstyled. (The production build links the CSS in `<head>`, but nothing guarantees that for injected markup.)
3. **There's no prerendered content in dev, and `createRoot` replaces it in production.** `main.tsx` calls `createRoot(...).render()` after `preloadPage()`. In production, this **throws away the prerendered HTML and re-renders it**, so some pages flash. In dev, `#root` is empty, so the visitor sees white until the lazy page chunk loads. The route `Suspense` fallback is a blank `bg-blush` box.
4. The nav's "Home" link goes to `/#home` instead of `/`.

**Rules:** edit in place. Don't open `node_modules/`, `dist/` or media folders. After each step, run `npm run build && npm test && npm run seo:audit && npm run perf:budget`, then commit (`load: <step>`).

## Step 1: put the utility bar inside the app

- Render `UtilityBar` inside `Header` (in `#root`), so it's prerendered with the page and styled by the same CSS. It is desktop-only (`hidden lg:flex`) and takes its values from `locations`, as now.
- Delete the `<body>` injection in `withPageExtras()`, and the regex that strips `data-utility-bar` from the home HTML (around line 319 of `vite.config.ts`).
- **Phones in the bar:** on desktop, `tel:` links open an app picker. In the bar, show each number as plain, selectable text with a small "Copy" icon button (`navigator.clipboard`, with an `aria-live` "Copied" message). Make the salon name link to `/salons/<id>`. Keep `tel:` links on touch devices only, through `@media (pointer: coarse)` or the existing call buttons.
- Check the header's height reservation includes the bar at ≥ 1024 px, with no layout shift.

## Step 2: CSS is render-blocking everywhere (dev and production)

- Remove `import './index.css'` from `src/main.tsx`. Add `<link rel="stylesheet" href="/src/index.css" />` to the `<head>` of `index.html`. Vite processes it in dev and emits the hashed CSS file in the build. Check `dist/index.html` still has exactly one stylesheet link per page.
- Add a **small inline critical style** (≤ 2 KB) to `index.html`'s `<head>`, before anything else, so the very first paint is on-brand even before the stylesheet arrives. It covers:
  - `html,body{margin:0;background:#FFF8F6;color:#2A1A20}`
  - a system-font stack with size-adjusted fallbacks that match Poppins and Cormorant (reuse the `size-adjust` fallback faces if they already exist)
  - `a{color:inherit}`
  - `[data-utility-bar]{display:none}` with `@media (min-width:1024px){[data-utility-bar]{display:flex}}`
  - a reserved header height
- If the earlier perf prompt added async CSS loading (beasties, or `media="print" onload`), keep it only if its critical CSS covers **everything on the first screen**, the header and bar included. Otherwise go back to the normal blocking stylesheet. The 18 KB CSS budget allows it.

## Step 3: no blank screen; hydrate instead of replacing

- In `src/main.tsx`:
  - If `#root` has prerendered children, use **`hydrateRoot`** after `preloadPage()`.
  - If `#root` is empty, use `createRoot`.
  - Keep `StrictMode`.
- Make the first client render **identical** to the prerender, so hydration produces no warnings:
  - Anything that depends on the current time, `localStorage`, the window size or `?today=` is rendered after mount, in `useEffect`, or wrapped with `suppressHydrationWarning` on that one text node. That covers the campaign countdown ("N days left"), open-now chips, the "Today" Tuesday tag, the chosen salon, the consent bar, the popup and the random or rotating content.
  - The prerender writes a neutral value first (for example "Valid till 30 Nov"). The client then updates it.
- **Route `Suspense` fallback:** while hydrating, React keeps the server HTML. For client-side navigation, the fallback becomes a branded skeleton (header space + hero block in `bg-blush`, with a soft shimmer), never an empty box.
- **The `#first-paint` shells (`SHELLS`):** make sure they aren't duplicated or removed when hydration takes over.
- **Dev mode:** put a lightweight branded skeleton (logo + hero placeholder, inline-styled) inside `<div id="root">` in `index.html`. React replaces it on mount; in production, the prerender replaces it at build time.

## Step 4: small fixes

- The "Home" nav link and any `/#home` link become `/`. Remove the `#home` id hand-off for the home page.
- Fonts: `font-display: swap`, at most 2 preloads (already the case), with the fallback metrics from Step 2, so the text doesn't jump when the fonts arrive.
- No `opacity: 0` on first-screen content while JS loads: reveal animations start visible for the hero.

## Step 5: verify (dev and production)

Add `scripts/load-check.mjs` (Playwright, already installed) and `"load:check"` to `package.json`. For `/`, `/offers`, an offer category page, a salon page and a service page, at 390 × 844 and 1440 × 900:

1. **Throttled load:** CPU slowdown 4× (CDP `Emulation.setCPUThrottlingRate`) and a slow-4G network. Record screenshots at 50, 200, 500, 1,000 and 2,000 ms into `reports/load/<date>/`.
2. **No unstyled frame (ERROR):** in every captured frame, no visible element has the default link colour `rgb(0, 0, 238)` / `rgb(85, 26, 139)`, the default font `Times New Roman`, or bullet `list-style` on the utility bar. The utility bar is never visible below 1024 px.
3. **No blank frame (ERROR):** in production (`npm run build && npm run preview`), the H1 and the primary CTA are visible from the **first** non-white frame (≤ 1.0 s on throttled load). In dev, the skeleton is visible within 300 ms.
4. **Hydration:** 0 console errors or warnings containing "hydrat" or "did not match". The prerendered DOM nodes of the hero are still the same nodes after hydration (mark one with a data attribute before hydration and check it's still there after).
5. **Layout shift:** CLS ≤ 0.05 during load (PerformanceObserver).
6. **Desktop bar:** clicking a salon name goes to its page; Copy copies the number; no `tel:` dialog on desktop.

Then run `npm run mobile:audit` and Lighthouse mobile on `/` and `/offers`: CLS ≤ 0.05, LCP ≤ 2.5 s.

**README:** add a short "Page loading" note covering:
- CSS is linked in `index.html`
- critical inline CSS
- hydration rules (render time-dependent values after mount)
- `npm run load:check`
- a dated **Change log** line

**Reply with ONLY:** the files changed, the load-check results (pass/fail per page and width), and the CLS/LCP numbers.
