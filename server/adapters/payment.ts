// Online payment. Off until PAYMENTS_ENABLED=true; the form keeps "Pay online" disabled until then.

export interface PaymentOrder {
  /** Provider order id, passed to the checkout on the page. */
  orderId: string;
  /** Public key the checkout needs. */
  keyId: string;
}

export interface PaymentProvider {
  readonly enabled: boolean;
  createOrder(input: { leadId: string; amountPaise: number }): Promise<PaymentOrder>;
}

export class NotConfiguredProvider implements PaymentProvider {
  readonly enabled = false;
  async createOrder(): Promise<PaymentOrder> {
    throw new Error('Online payments are not configured');
  }
}

/**
 * Stub for Razorpay. TODO before switching on:
 *   1. Decide where the amount comes from: the page shows no prices, so the salon confirms the value on WhatsApp
 *      first and then sends a payment link, or the form gains an amount step after confirmation.
 *   2. Create orders with POST https://api.razorpay.com/v1/orders (basic auth: key id + secret).
 *   3. Verify the payment signature in a webhook route before marking a lead paid.
 *   4. Set PAYMENTS_ENABLED=true, RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.
 */
export class RazorpayProvider implements PaymentProvider {
  readonly enabled = true;
  constructor(private readonly keyId: string, private readonly keySecret: string) {}

  async createOrder({ leadId, amountPaise }: { leadId: string; amountPaise: number }): Promise<PaymentOrder> {
    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: amountPaise, currency: 'INR', receipt: leadId }),
    });
    if (!res.ok) throw new Error(`Razorpay ${res.status}`);
    const order = (await res.json()) as { id: string };
    return { orderId: order.id, keyId: this.keyId };
  }
}
