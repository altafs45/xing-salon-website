// Analytics snippets, written into the page at build time only when their env var is set. With no IDs, nothing loads.
// Consent Mode defaults come first, and every tag waits for the page to load or the first tap, so none of them can
// slow the first paint. No window access here: vite.config.ts runs this.

export interface TagEnv {
  VITE_GTM_ID?: string;
  VITE_GA4_ID?: string;
  VITE_CLARITY_ID?: string;
  /** Google Ads accounts, AW-XXXXXXXXXX, comma-separated. Ignored when a Tag Manager container is set: add them
   * there instead. */
  VITE_GOOGLE_ADS_IDS?: string;
  /** Google Ads conversion targets, AW-XXXXXXXXXX/label, comma-separated: sent on WhatsApp and Call taps on the
   * offer pages. */
  VITE_GOOGLE_ADS_SEND_TO?: string;
}

const safeId = (id = '') => id.replace(/[^\w-]/g, '');
/** "AW-1, AW-2" → ['AW-1', 'AW-2'], keeping "/" for conversion labels. */
const safeList = (list = '') => list.split(',').map((id) => id.trim().replace(/[^\w/-]/g, '')).filter(Boolean);

/** Runs `load` on the first tap, key or scroll, or 4 seconds after the page has loaded. */
const deferred = (load: string) => `(function(){var d;function l(){if(d)return;d=1;${load}}['pointerdown','keydown','scroll'].forEach(function(e){addEventListener(e,l,{once:true,passive:true})});addEventListener('load',function(){setTimeout(l,4000)})})();`;

const script = (src: string) => `var s=document.createElement('script');s.async=true;s.src='${src}';document.head.appendChild(s);`;

/** Which kind of page a path is, for reports. */
export function pageType(path: string) {
  if (path === '/') return 'home';
  if (path.startsWith('/offers')) return 'offers';
  if (path.startsWith('/salons/')) return 'salon';
  if (path.startsWith('/blog')) return 'blog';
  if (path === '/about') return 'about';
  if (path === '/faq') return 'faq';
  if (path === '/membership-gift-cards') return 'gifts';
  if (/^\/services\/(hair-care|skin-body|nail-care)$/.test(path) || path === '/services') return 'category';
  if (path.startsWith('/services/')) return 'service';
  return 'other';
}

/** The snippets for <head> and just after <body>. Empty strings when no ID is set. */
export function tagSnippets(env: TagEnv, path: string) {
  const gtm = safeId(env.VITE_GTM_ID);
  const ga4 = gtm ? '' : safeId(env.VITE_GA4_ID);
  const clarity = safeId(env.VITE_CLARITY_ID);
  const ads = gtm ? [] : safeList(env.VITE_GOOGLE_ADS_IDS);
  const sendTo = gtm ? [] : safeList(env.VITE_GOOGLE_ADS_SEND_TO);
  if (!gtm && !ga4 && !clarity && !ads.length) return { head: '', body: '' };

  const lines = [
    "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}",
    "gtag('consent', 'default', {ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});",
    `dataLayer.push({page_type:'${pageType(path)}'});`,
  ];
  if (gtm) lines.push(`dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});`, deferred(script(`https://www.googletagmanager.com/gtm.js?id=${gtm}`)));
  if (ga4) lines.push(`gtag('js',new Date());gtag('config','${ga4}',{send_page_view:true});`, deferred(script(`https://www.googletagmanager.com/gtag/js?id=${ga4}`)));
  // Google Ads, under the same Consent Mode defaults (ad storage denied until the visitor agrees). One gtag.js loads
  // every ID, so the script is added only when GA4 hasn't already added it.
  if (ads.length) {
    lines.push(`${ga4 ? '' : "gtag('js',new Date());"}${ads.map((id) => `gtag('config','${id}');`).join('')}`);
    if (!ga4) lines.push(deferred(script(`https://www.googletagmanager.com/gtag/js?id=${ads[0]}`)));
    if (sendTo.length) lines.push(`window.xingAdsSendTo=${JSON.stringify(sendTo)};`);
  }
  // Clarity waits for consent: ConsentBar calls this.
  if (clarity) {
    lines.push(`window.xingLoadClarity=function(granted){window.clarity=window.clarity||function(){(window.clarity.q=window.clarity.q||[]).push(arguments)};clarity('consentv2',{ad_Storage:'denied',analytics_Storage:granted?'granted':'denied'});if(!granted||window.xingClarity)return;window.xingClarity=1;${script(`https://www.clarity.ms/tag/${clarity}`)}};`);
  }
  return {
    head: `<script>${lines.join('')}</script>`,
    body: gtm ? `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtm}" height="0" width="0" style="display:none;visibility:hidden" title="Tag Manager"></iframe></noscript>` : '',
  };
}
