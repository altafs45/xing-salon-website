// Events go to Google Analytics (gtag) and to window.dataLayer (Google Tag Manager) when the site has them,
// and nowhere otherwise.

export type AnalyticsEvent =
  | 'offer_view'
  | 'offer_switch'
  | 'form_step1'
  | 'form_submit'
  | 'form_error'
  | 'popup_shown'
  | 'popup_dismissed'
  | 'popup_claim'
  | 'offer_details_open'
  | 'offer_claim_start'
  | 'offer_claim_whatsapp'
  | 'offer_claim_call'
  | 'offer_claim_book'
  | 'branch_select'
  | 'filter_select'
  | 'whatsapp_click'
  | 'call_click'
  | 'directions_click'
  | 'offer_claim'
  | 'branch_card_click'
  // November colour offers. No personal data.
  | 'nov_offer_view'
  | 'nov_offer_claim'
  | 'nov_offer_book'
  | 'nov_offer_details'
  | 'nov_picker_result'
  // Gift cards & membership page. No personal data in any of them.
  | 'gm_chooser_select'
  | 'gm_tier_view'
  | 'gm_tier_cta'
  | 'gm_occasion_cta'
  | 'gm_form_open'
  | 'gm_form_step'
  | 'gm_form_submit_success'
  | 'gm_form_submit_error'
  | 'gm_whatsapp_click'
  | 'gm_call_click'
  | 'gm_compare_cta';

export function track(event: AnalyticsEvent, params: Record<string, string | number | boolean> = {}) {
  const w = window as { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
  if (w.gtag) w.gtag('event', event, params);
  else w.dataLayer?.push({ event, ...params });
}

/**
 * Where a tap happened, from the markup around it: `data-cta` names the place on the page ("hero", "offers",
 * "sticky_bar"…) and `data-branch` the salon. Either can sit on the link itself or on any element around it.
 */
function context(el: Element) {
  const params: Record<string, string> = { page: location.pathname };
  const place = el.closest<HTMLElement>('[data-cta]')?.dataset.cta;
  const branch = el.closest<HTMLElement>('[data-branch]')?.dataset.branch;
  if (place) params.location_on_page = place;
  if (branch) params.branch = branch;
  return params;
}

/** Counts every tap on a WhatsApp, phone or directions link, wherever it is on the page. */
export function trackContactClicks() {
  const onClick = (e: MouseEvent) => {
    const link = (e.target as Element | null)?.closest?.('a[href]');
    // Links that aren't the salon's own (the site credit) are left out of the salon's numbers.
    if (!link || link.closest('[data-no-track]')) return;
    const href = link.getAttribute('href') ?? '';
    const params = context(link);
    if (link.hasAttribute('data-offer')) track('offer_claim', { ...params, offer: link.getAttribute('data-offer')! });
    if (href.startsWith('https://wa.me')) track('whatsapp_click', params);
    else if (href.startsWith('tel:') || href === '#call-a-salon') track('call_click', params);
    else if (/google\.com\/maps|maps\.app\.goo\.gl/.test(href) || href === '#directions-to-a-salon') track('directions_click', params);
    else if (link.hasAttribute('data-branch-card')) track('branch_card_click', params);
  };
  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
}
