import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { locations } from '../src/data/branches';
import { whatsappLink } from '../src/lib/whatsapp';

// Booking has no backend yet: every booking ends on the chosen salon's WhatsApp, with the summary written out.
describe('booking', () => {
  const summary = "Hi Xing, I'd like to book Hydra Facial at HSR Layout on 2026-11-20 at 11:00 AM. Name: Asha, Phone: 9876543210";

  it("ends at each salon's own WhatsApp number, with the summary encoded", () => {
    const numbers = { 'sarjapur-road': '918970007440', 'hsr-layout': '919380812348', brookfield: '918147111344' };
    for (const salon of locations) {
      const href = whatsappLink(summary, salon.whatsappHref);
      expect(href).toBe(`https://wa.me/${numbers[salon.id as keyof typeof numbers]}?text=${encodeURIComponent(summary)}`);
    }
  });

  it("never sends Brookfield's WhatsApp to its landline", () => {
    const brookfield = locations.find((salon) => salon.id === 'brookfield')!;
    expect(brookfield.whatsappHref).toContain('918147111344');
    expect(brookfield.whatsappHref).not.toContain(brookfield.phoneHref.replace(/\D/g, ''));
  });

  it('makes no network request from the booking form', () => {
    const source = readFileSync('src/components/BookingModal.tsx', 'utf8') + readFileSync('src/context/booking.tsx', 'utf8');
    expect(source).not.toMatch(/\bfetch\(|XMLHttpRequest|sendBeacon/);
  });

  it('requires a salon before the last step', () => {
    expect(readFileSync('src/components/BookingModal.tsx', 'utf8')).toContain("errors.location = 'Please choose a salon.'");
  });
});
