// One JSON line per event. Never pass a full phone number or email: mask them first.

export function log(level: 'info' | 'warn' | 'error', event: string, fields: Record<string, unknown> = {}) {
  const line = JSON.stringify({ time: new Date().toISOString(), level, event, ...fields });
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

/** "+919876543210" → "+91******3210". */
export const maskPhone = (phone: string) => (phone.length > 4 ? `${phone.slice(0, phone.startsWith('+') ? 3 : 0)}******${phone.slice(-4)}` : '****');

/** "priya.s@gmail.com" → "p***@gmail.com". */
export function maskEmail(email: string) {
  const [user, domain] = email.split('@');
  return domain ? `${user.slice(0, 1)}***@${domain}` : '***';
}
