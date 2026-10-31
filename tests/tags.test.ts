import { describe, expect, it } from 'vitest';
import { pageType, tagSnippets } from '../src/lib/tags';

describe('analytics tags', () => {
  it('adds nothing with no IDs', () => {
    expect(tagSnippets({}, '/')).toEqual({ head: '', body: '' });
  });

  it('sets consent defaults before Tag Manager, and loads each tag once', () => {
    const { head, body } = tagSnippets({ VITE_GTM_ID: 'GTM-TEST000', VITE_GA4_ID: 'G-TEST', VITE_CLARITY_ID: 'abc' }, '/offers');
    expect(head.indexOf("'consent', 'default'")).toBeLessThan(head.indexOf('gtm.js?id=GTM-TEST000'));
    expect(head).not.toContain('gtag/js');
    expect(head.match(/gtm\.js\?id=/g)).toHaveLength(1);
    expect(body).toContain('ns.html?id=GTM-TEST000');
    expect(head).toContain("page_type:'offers'");
  });

  it('uses direct GA4 only without Tag Manager', () => {
    expect(tagSnippets({ VITE_GA4_ID: 'G-TEST' }, '/').head).toContain('gtag/js?id=G-TEST');
  });

  it('names page types', () => {
    expect(['/', '/services/keratin-treatment', '/salons/brookfield', '/blog/x'].map(pageType)).toEqual(['home', 'service', 'salon', 'blog']);
  });
});
