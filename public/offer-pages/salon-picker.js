// On the six offer pages, every WhatsApp button asks which salon first, as across the site
// (src/components/BranchPicker.tsx), then opens that salon's WhatsApp with the page's own message, addressed to it.
// With data-mode="marked" on the script tag (/offers), only links marked data-pick-salon ask: the page's own
// per-salon buttons go straight to their salon. A marked tel: link asks which salon to call.
// The choice is remembered under the site's key, so the main site preselects it too.
(() => {
  const markedOnly = document.currentScript?.dataset.mode === 'marked';
  // Site order and numbers: src/data/branches.ts.
  const SALONS = [
    { id: 'sarjapur-road', name: 'Sarjapur Road', whatsapp: '918970007440', phone: '+918970007440', phoneLabel: '+91 89700 07440', areas: 'Sarjapur Road, Kasavanahalli, Kaikondrahalli' },
    { id: 'hsr-layout', name: 'HSR Layout', whatsapp: '919380812348', phone: '+919380812348', phoneLabel: '+91 93808 12348', areas: 'HSR Layout Sector 1, Sector 2, Sector 3' },
    { id: 'brookfield', name: 'Brookfield', whatsapp: '918147111344', phone: '+917996666012', phoneLabel: '+91 79966 66012', areas: 'AECS Layout, Brookfield, Kundalahalli' },
  ];
  const STORAGE_KEY = 'xing-branch';
  const remembered = () => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  };
  const remember = (id) => {
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // Storage blocked: the choice simply isn't remembered.
    }
  };

  /** The page's message, addressed to the chosen salon: "Hi Xing HSR!" → "Hi Xing Brookfield!". */
  const addressTo = (text, salon) => text.replace(/Xing (Salon, )?(HSR Layout|HSR|Sarjapur Road|Sarjapur)/g, (_, salonComma = '') => `Xing ${salonComma}${salon.name}`);

  const style = document.createElement('style');
  style.textContent = `
    .xsp-backdrop{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:flex-end;justify-content:center;background:rgba(39,21,28,.45);backdrop-filter:blur(6px)}
    @media(min-width:640px){.xsp-backdrop{align-items:center}}
    .xsp-sheet{width:min(440px,100%);max-height:calc(100dvh - 24px);overflow:auto;background:#FFF9F8;border-radius:24px 24px 0 0;padding:24px 24px calc(24px + env(safe-area-inset-bottom));box-shadow:0 30px 80px rgba(39,21,28,.35);font-family:Poppins,Arial,sans-serif;color:#27151C}
    @media(min-width:640px){.xsp-sheet{border-radius:24px}}
    .xsp-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}
    .xsp-head h2{margin:0;font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:26px;line-height:1.2;letter-spacing:0;color:#27151C}
    .xsp-close{display:grid;place-items:center;width:44px;height:44px;margin:-8px -8px 0 0;border:0;border-radius:50%;background:transparent;color:#27151C;font-size:26px;line-height:1;cursor:pointer}
    .xsp-close:hover{background:#FCE4EA;color:#A8325E}
    .xsp-list{list-style:none;margin:16px 0 0;padding:0}
    .xsp-list li+li{border-top:1px solid rgba(39,21,28,.1)}
    .xsp-item{display:flex;align-items:center;gap:16px;width:100%;min-height:64px;padding:16px 0;border:0;background:none;text-align:left;font:inherit;color:inherit;cursor:pointer}
    .xsp-icon{display:grid;place-items:center;flex-shrink:0;width:44px;height:44px;border-radius:50%;background:#FCE4EA;color:#A8325E}
    .xsp-icon svg{width:20px;height:20px}
    .xsp-text{flex:1;min-width:0}
    .xsp-name{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;font-size:16px;font-weight:600}
    .xsp-badge{border-radius:999px;background:#D2A445;padding:2px 8px;font-size:12px;font-weight:600;color:#27151C;white-space:nowrap}
    .xsp-areas{display:block;margin-top:2px;font-size:14px;color:#6B5B5E;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .xsp-arrow{flex-shrink:0;color:#A8325E;font-size:20px;transition:transform .2s}
    .xsp-item:hover .xsp-arrow{transform:translateX(4px)}
    .xsp-item:focus-visible,.xsp-close:focus-visible{outline:2px solid #A8325E;outline-offset:2px}
  `;
  document.head.appendChild(style);

  const WA_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-2.97.78.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.97-.14.16-.29.18-.53.06a6.7 6.7 0 0 1-1.98-1.22 7.4 7.4 0 0 1-1.37-1.7c-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.83-.2-.48-.4-.42-.56-.42h-.47a.9.9 0 0 0-.66.31c-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.16 1.74 2.65 4.21 3.72.59.25 1.05.4 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.46-.6 1.67-1.17.2-.58.2-1.07.14-1.17-.06-.11-.22-.17-.47-.29Z"/></svg>';

  let open = null;

  function close() {
    if (!open) return;
    open.backdrop.remove();
    document.removeEventListener('keydown', open.onKey, true);
    document.documentElement.style.overflow = open.overflow;
    open.returnFocus?.focus?.();
    open = null;
  }

  function ask(text, opener, call = false) {
    close();
    const last = remembered();
    const backdrop = document.createElement('div');
    backdrop.className = 'xsp-backdrop';
    backdrop.innerHTML = `
      <div class="xsp-sheet" role="dialog" aria-modal="true" aria-labelledby="xsp-title">
        <div class="xsp-head">
          <h2 id="xsp-title">Which salon would you like to ${call ? 'call' : 'book'}?</h2>
          <button type="button" class="xsp-close" aria-label="Close">×</button>
        </div>
        <ul class="xsp-list">
          ${SALONS.map((salon) => `
            <li><button type="button" class="xsp-item" data-salon="${salon.id}">
              <span class="xsp-icon">${WA_ICON}</span>
              <span class="xsp-text">
                <span class="xsp-name">Xing ${salon.name}${salon.id === last ? '<span class="xsp-badge">Last used</span>' : ''}</span>
                <span class="xsp-areas">${call ? salon.phoneLabel : salon.areas}</span>
              </span>
              <span class="xsp-arrow" aria-hidden="true">›</span>
            </button></li>`).join('')}
        </ul>
      </div>`;
    backdrop.addEventListener('click', (event) => {
      if (event.target === backdrop || event.target.closest('.xsp-close')) return close();
      const item = event.target.closest('[data-salon]');
      if (!item) return;
      const salon = SALONS.find((s) => s.id === item.dataset.salon);
      remember(salon.id);
      close();
      if (call) {
        window.location.href = `tel:${salon.phone}`;
        return;
      }
      const href = `https://wa.me/${salon.whatsapp}${text ? `?text=${encodeURIComponent(addressTo(text, salon))}` : ''}`;
      window.open(href, '_blank', 'noopener');
    });
    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        close();
      }
    };
    document.addEventListener('keydown', onKey, true);
    open = { backdrop, onKey, returnFocus: opener, overflow: document.documentElement.style.overflow };
    document.documentElement.style.overflow = 'hidden';
    document.body.appendChild(backdrop);
    backdrop.querySelector('.xsp-item').focus();
  }

  // Capture phase, so it also catches buttons the page builds or rewires in its own scripts.
  document.addEventListener(
    'click',
    (event) => {
      const link = event.target.closest?.(markedOnly ? 'a[data-pick-salon]' : 'a[href*="wa.me/"], a[href*="api.whatsapp.com/"]');
      if (!link || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      // Only the navigation is stopped: the click still reaches any tag that counts it.
      event.preventDefault();
      if (link.href.startsWith('tel:')) return ask('', link, true);
      const url = new URL(link.href);
      ask(url.searchParams.get('text') || '', link);
    },
    true,
  );
})();
