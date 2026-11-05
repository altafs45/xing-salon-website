import { describe, expect, it } from 'vitest';
import { blendOfferPage, siteColours } from '../src/lib/offerPageHtml';

const PAGE = `<html><head><link rel="preconnect" href="https://fonts.googleapis.com">
<style>@import url('https://fonts.googleapis.com/css2?family=Manrope');:root{--sans:'Manrope',Arial,sans-serif}a{color:#e42b88}</style></head>
<body><header class="header"><a>Old nav</a></header><main style="color:#111"><h1>Offer</h1><img src="/images/a.png"></main>
<footer class="footer"><a class="brand"><span class="wordmark">xing.</span><span class="brand-detail">Salon</span></a></footer></body></html>`;

describe('offer pages in the site’s look', () => {
  it('moves colours onto the palette, keeping transparency, gold and green', () => {
    expect(siteColours('#e42b88')).toBe('#a8325e');
    expect(siteColours('#a71058aa')).toBe('#87244aaa');
    expect(siteColours('#fff')).toBe('#ffffff');
    expect(siteColours('#25d366 #ffbc59')).toBe('#25d366 #ffbc59');
  });

  it('swaps the header, fonts and footer wordmark and keeps the content', () => {
    const html = blendOfferPage(PAGE, { head: '<link id="theme">', body: '<script id="nav"></script>' });
    expect(html).not.toMatch(/Old nav|Manrope|googleapis|wordmark|e42b88/);
    expect(html).toMatch(/<body>\n<div data-site-header><\/div>/);
    expect(html).toContain('/brand/logo-light.webp');
    expect(html).toContain('<link id="theme">\n</head>');
    expect(html).toContain('<h1>Offer</h1><img src="/images/a.png">');
    expect(html).toContain('style="color:#27151c"');
  });

  it('loads photos from this site', () => {
    const html = blendOfferPage(PAGE.replace('/images/a.png', 'https://xingsalons.com/images/a.png'), { head: '', body: '' });
    expect(html).toContain('<img src="/images/a.png">');
  });

  it('keeps photos working under any address', () => {
    const html = blendOfferPage(PAGE.replace('/images/a.png', 'images/a.png').replace('</main>', "<script>x={src:'images/b.png'}</script></main>"), { head: '', body: '' });
    expect(html).toContain('<img src="/images/a.png">');
    expect(html).toContain("{src:'/images/b.png'}");
  });

  it('stops the build if a page no longer has what it replaces', () => {
    expect(() => blendOfferPage('<body></body>', { head: '', body: '' })).toThrow(/header/);
  });
});
