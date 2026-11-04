// The salon offer pages (content/offer-pages/*.html) as the site serves them: the supplied files with only their look
// changed to the site's. Their text, pictures, sections and scripts stay exactly as supplied. What changes:
//   - colours: every colour in the pages' CSS moves onto the site's palette (berry, blush, cream, ink), keeping its
//     lightness and transparency, so light stays light and dark stays dark;
//   - fonts: Poppins and Cormorant Garamond (public/offer-pages/site-theme.css) instead of Manrope;
//   - logo: the site's logo in place of the "xing." wordmark in the footer;
//   - header: the site's own header (src/embed/siteHeader.tsx) in place of the page's.
// Used by the build (vite.config.ts writes dist/<slug>.html) and by the dev server, which serves the same result.

/** Colours the pages use as their accents, set to the site's own exactly. */
const EXACT: Record<string, string> = {
  // The hot pinks: buttons, links, accent words.
  e42b88: 'a8325e', c41769: 'a8325e', d30d72: 'a8325e', e72d8b: 'a8325e', e52d8b: 'a8325e', e93490: 'a8325e',
  c91b71: 'a8325e', d9237d: 'a8325e', bb1769: 'a8325e',
  // Their darker shades: hovers and the end of the button gradient.
  a71058: '87244a', ac2181: '87244a', '9f205d': '87244a', '8e1859': '87244a', b12ca9: '87244a', '9a2b68': '87244a',
  // Text and dark sections: ink.
  '111': '27151c', '111111': '27151c', '19151d': '27151c', '211521': '27151c', '18151e': '27151c',
  // Page backgrounds: cream and blush.
  fff6fa: 'fff9f8', fff8fb: 'fff9f8', fff8fc: 'fff9f8', fffafd: 'fff9f8', fff9fc: 'fff9f8', fff7fb: 'fff9f8',
  fff9fb: 'fff9f8', fffdfe: 'fff9f8', fff4fa: 'fff9f8', ffd3e8: 'fce4ea', ffcce5: 'fce4ea', ffedf6: 'fdeef2', fff0f8: 'fdeef2',
  // Muted text.
  '6b5e6a': '6b5b5e',
};

/** The site's berry hue, and blush's for the pale tints. */
const BERRY_HUE = 337;
const BLUSH_HUE = 345;

type Rgb = [number, number, number];

const toHsl = ([r, g, b]: Rgb): Rgb => {
  const [rr, gg, bb] = [r / 255, g / 255, b / 255];
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === rr ? (gg - bb) / d + (gg < bb ? 6 : 0) : max === gg ? (bb - rr) / d + 2 : (rr - gg) / d + 4;
  return [h * 60, s, l];
};

const toRgb = ([h, s, l]: Rgb): Rgb => {
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map((v) => Math.round(v * 255)) as Rgb;
};

/**
 * One colour on the site's palette. Pinks, magentas and violets take berry's hue (blush's for pale tints) at their own
 * lightness, no more saturated than the site's own; near-black becomes ink. Greys, the gold stars and WhatsApp green
 * stay as they are.
 */
export function siteColour(rgb: Rgb): Rgb {
  const [h, s, l] = toHsl(rgb);
  if (s < 0.12) return l < 0.16 ? [39, 21, 28] : rgb;
  const pinkish = h >= 250 || h <= 15;
  if (!pinkish) return rgb;
  if (l >= 0.8) return toRgb([BLUSH_HUE, Math.min(s, 0.8), l]);
  if (l >= 0.25) return toRgb([BERRY_HUE, Math.min(s, 0.55), l]);
  return toRgb([BERRY_HUE, Math.min(s, 0.3), l]);
}

const hex = (rgb: Rgb) => rgb.map((v) => v.toString(16).padStart(2, '0')).join('');

const mapHex = (value: string) => {
  const raw = value.toLowerCase();
  const full = raw.length === 3 || raw.length === 4 ? [...raw].map((c) => c + c).join('') : raw;
  const [colour, alpha = ''] = [full.slice(0, 6), full.slice(6)];
  const exact = EXACT[raw.length <= 4 ? raw.slice(0, 3) : colour] ?? EXACT[colour];
  const rgb = [0, 2, 4].map((i) => parseInt(colour.slice(i, i + 2), 16)) as Rgb;
  return `#${exact ?? hex(siteColour(rgb))}${alpha}`;
};

/** Every colour in a piece of CSS, on the site's palette. */
export function siteColours(css: string) {
  return css
    .replace(/#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g, (_, value: string) => mapHex(value))
    .replace(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*[\d.]+\s*)?\)/g, (_, r, g, b, alpha = '') => {
      const [nr, ng, nb] = siteColour([Number(r), Number(g), Number(b)]);
      return alpha ? `rgba(${nr},${ng},${nb}${alpha.replace(/\s/g, '')})` : `rgb(${nr},${ng},${nb})`;
    });
}

/** The site's logo for dark backgrounds, as in the site footer. */
const FOOTER_LOGO =
  '<img class="site-logo" src="/brand/logo-light.webp" srcset="/brand/logo-light.webp 1x, /brand/logo-light@2x.webp 2x" alt="Xing Premium Unisex Salon" width="240" height="118" loading="lazy" decoding="async">';

interface Inject {
  /** Into <head>, after the page's own styles. */
  head: string;
  /** At the end of <body>. */
  body: string;
}

const must = (html: string, pattern: RegExp, what: string) => {
  if (!pattern.test(html)) throw new Error(`offer page: no ${what} to replace`);
};

/** A supplied offer page with the site's colours, fonts, logo and header. */
export function blendOfferPage(html: string, inject: Inject) {
  const header = /<header class="header">[\s\S]*?<\/header>\s*/;
  const wordmark = /(<footer[\s\S]*?)<span class="wordmark">[\s\S]*?<\/span>(<span class="brand-detail">)/;
  must(html, header, 'header');
  must(html, wordmark, 'footer wordmark');
  return (
    html
      // The site's fonts (site-theme.css) instead of Manrope from Google Fonts.
      .replace(/@import url\('https:\/\/fonts\.googleapis\.com\/[^']*'\);?/g, '')
      .replace(/\s*<link rel="preconnect" href="https:\/\/fonts\.(googleapis|gstatic)\.com"[^>]*>/g, '')
      .replace(/'Manrope',\s*Arial,\s*sans-serif/g, "Poppins,'Poppins Fallback',system-ui,sans-serif")
      // Colours, in the pages' styles, inline styles and the browser's theme colour.
      .replace(/(<style[^>]*>)([\s\S]*?)(<\/style>)/g, (_, open: string, css: string, close: string) => open + siteColours(css) + close)
      .replace(/ style="([^"]*)"/g, (_, css: string) => ` style="${siteColours(css)}"`)
      .replace(/(<meta name="theme-color" content=")(#[0-9a-fA-F]{3,8})"/g, (_, open: string, value: string) => `${open}${siteColours(value)}"`)
      // The site's header in place of the page's: its slot opens the body, above the page's promo bar.
      .replace(header, '')
      .replace(/<body([^>]*)>/, '<body$1>\n<div data-site-header></div>')
      .replace(wordmark, `$1${FOOTER_LOGO}$2`)
      .replace('</head>', `${inject.head}\n</head>`)
      .replace(/<\/body>(?![\s\S]*<\/body>)/, `${inject.body}\n</body>`)
  );
}

/** What the built pages load: the theme after the pages' own styles, and the header's script. */
export const offerPageAssets: Inject = {
  head: '<link rel="stylesheet" href="/offer-pages/site-theme.css">',
  body: '<script type="module" src="/embed/site-header.js"></script>',
};
