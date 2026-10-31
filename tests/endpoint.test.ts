import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MemoryStore } from '../server/adapters/leadStore';
import type { MailMessage, MailProvider } from '../server/adapters/mail';
import { NotConfiguredProvider } from '../server/adapters/payment';
import { ClickToChatProvider } from '../server/adapters/whatsapp';
import { createApp, LEAD_PATH } from '../server/app';
import type { LeadDeps } from '../server/handler';
import { RateLimiter } from '../server/rateLimit';
import { LEAD_ID_PATTERN } from '../src/shared/leadMessages';
import { giftLead, membershipLead } from './fixtures';

class MockMail implements MailProvider {
  sent: MailMessage[] = [];
  fail = false;
  async send(message: MailMessage) {
    if (this.fail) throw new Error('SMTP down');
    this.sent.push(message);
  }
}

let server: Server;
let url: string;
let mail: MockMail;
let store: MemoryStore;
let deps: LeadDeps;

const post = (body: unknown) =>
  fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(async (res) => ({ status: res.status, body: await res.json() }));

beforeEach(async () => {
  mail = new MockMail();
  store = new MemoryStore();
  deps = {
    store,
    mail,
    whatsapp: new ClickToChatProvider(),
    payments: new NotConfiguredProvider(),
    ipLimiter: new RateLimiter(5, 10 * 60_000),
    phoneLimiter: new RateLimiter(5, 10 * 60_000),
    xingEmail: 'hello@xing.example',
    route: (salon) => ({ email: `${salon.key}@xing.example`, whatsapp: { hsr: '919380812348', sarjapur: '918970007440', brookfield: '918147111344' }[salon.key] }),
  };
  server = createApp(deps).listen(0);
  await new Promise((done) => server.once('listening', done));
  url = `http://127.0.0.1:${(server.address() as AddressInfo).port}${LEAD_PATH}`;
});

afterEach(() => new Promise((done) => server.close(done)));

describe(`POST ${LEAD_PATH}`, () => {
  it('saves a gift lead, emails XING, the branch and the client, and returns the branch WhatsApp link', async () => {
    const res = await post(giftLead());
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.leadId).toMatch(LEAD_ID_PATTERN);
    expect(res.body.whatsappUrl).toMatch(/^https:\/\/wa\.me\/919380812348\?text=/);
    expect(decodeURIComponent(res.body.whatsappUrl.split('?text=')[1])).toContain(`Request ID: ${res.body.leadId}`);

    expect(store.records).toHaveLength(1);
    expect(store.records[0].lead.phone).toBe('+919876543210');
    expect(store.records[0].lead).not.toHaveProperty('company_website');

    expect(mail.sent.map((m) => m.to).sort()).toEqual(['hello@xing.example', 'hsr@xing.example', 'priya@example.com']);
    const staff = mail.sent.find((m) => m.to === 'hsr@xing.example')!;
    expect(staff.subject).toBe(`New Gift Card Request · Birthday Glow Ritual gift card · HSR Layout · ${res.body.leadId}`);
    expect(staff.text).toContain('Reply to the client on WhatsApp within 30 minutes.');
    const customer = mail.sent.find((m) => m.to === 'priya@example.com')!;
    expect(customer.subject).toBe('Your XING Gift Card request is received 💖');
    // The client's email carries no internal data and no amounts.
    expect(customer.html + customer.text).not.toMatch(/₹|INR|minimum load|internal/i);
  });

  it('routes a membership to its branch, sends no client email without an address, and shows the tier minimum to staff only', async () => {
    const res = await post(membershipLead());
    expect(res.status).toBe(200);
    expect(res.body.whatsappUrl).toMatch(/^https:\/\/wa\.me\/918147111344\?/);
    expect(mail.sent.map((m) => m.to).sort()).toEqual(['brookfield@xing.example', 'hello@xing.example']);
    expect(mail.sent[0].text).toContain('Tier minimum load (internal)');
  });

  it('answers a filled honeypot with a silent 200 and keeps nothing', async () => {
    const res = await post(giftLead({ company_website: 'http://spam.example' }));
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(store.records).toHaveLength(0);
    expect(mail.sent).toHaveLength(0);
  });

  it('rejects a form sent in under 3 seconds', async () => {
    const res = await post(giftLead({ formStartedAt: Date.now() - 500 }));
    expect(res.status).toBe(422);
    expect(res.body.code).toBe('too_fast');
    expect(store.records).toHaveLength(0);
  });

  it('returns field errors for invalid input', async () => {
    const res = await post(giftLead({ phone: '12345' }));
    expect(res.status).toBe(400);
    expect(res.body.errors.phone).toBeDefined();
  });

  it('allows 5 requests per IP in the window, then 429', async () => {
    const phones = ['9000000001', '9000000002', '9000000003', '9000000004', '9000000005', '9000000006'];
    const statuses = [];
    for (const phone of phones) statuses.push((await post(giftLead({ phone }))).status);
    expect(statuses).toEqual([200, 200, 200, 200, 200, 429]);
  });

  it('limits repeat requests for the same phone number across IPs', async () => {
    deps.ipLimiter = new RateLimiter(100, 60_000);
    for (let i = 0; i < 5; i++) expect((await post(giftLead())).status).toBe(200);
    expect((await post(giftLead())).status).toBe(429);
  });

  it('refuses online payment while payments are off', async () => {
    const res = await post(giftLead({ payment: 'online' }));
    expect(res.status).toBe(400);
    expect(res.body.errors.payment).toMatch(/launching soon/i);
  });

  it('still succeeds when email fails but the lead was saved', async () => {
    mail.fail = true;
    const res = await post(giftLead());
    expect(res.status).toBe(200);
    expect(store.records).toHaveLength(1);
  });

  it('fails with a generic code when the lead can be neither saved nor emailed', async () => {
    mail.fail = true;
    deps.store = { save: async () => Promise.reject(new Error('disk full')) };
    const res = await post(giftLead());
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ ok: false, code: 'not_delivered' });
  });

  it('rejects malformed JSON with a generic error', async () => {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{oops' });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, code: 'bad_request' });
  });
});
