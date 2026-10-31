// WhatsApp. ClickToChatProvider only builds the wa.me link the client taps to send the request themselves.
// WhatsAppCloudApiProvider (off by default) will also message the salon and the client directly once Meta's
// WhatsApp Cloud API is set up: WHATSAPP_API_ENABLED=true, WHATSAPP_TOKEN and WHATSAPP_PHONE_ID.
import { whatsappUrl } from '../../src/shared/leadMessages';
import { log } from '../log';

export interface Notification {
  leadId: string;
  salonNumber: string;
  customerPhone: string;
  text: string;
}

export interface WhatsAppProvider {
  /** The link the client opens to send `text` to the salon's number. */
  clickToChatUrl(salonNumber: string, text: string): string;
  /** Sends notifications directly. A no-op unless the Cloud API is enabled. */
  notify(input: Notification): Promise<void>;
}

export class ClickToChatProvider implements WhatsAppProvider {
  clickToChatUrl(salonNumber: string, text: string) {
    return whatsappUrl(salonNumber, text);
  }
  async notify(_input: Notification) {
    // Click-to-chat sends nothing itself: the client sends the message from their own WhatsApp.
  }
}

export interface CloudApiSettings {
  token: string;
  phoneId: string;
  /** Approved template names in WhatsApp Manager. */
  salonTemplate: string;
  customerTemplate: string;
}

/**
 * Stub for Meta's WhatsApp Cloud API. TODO before switching on:
 *   1. Create and get approval for two message templates (salon alert, customer confirmation) in WhatsApp Manager.
 *   2. Fill in the template names and their parameters below.
 *   3. Set WHATSAPP_API_ENABLED=true, WHATSAPP_TOKEN and WHATSAPP_PHONE_ID.
 */
export class WhatsAppCloudApiProvider extends ClickToChatProvider {
  constructor(private readonly settings: CloudApiSettings) {
    super();
  }

  override async notify({ leadId, salonNumber, customerPhone }: Notification) {
    const send = (to: string, template: string) =>
      fetch(`https://graph.facebook.com/v21.0/${this.settings.phoneId}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.settings.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to.replace(/\D/g, ''),
          type: 'template',
          // TODO: the template's language and body parameters, once approved.
          template: { name: template, language: { code: 'en' }, components: [{ type: 'body', parameters: [{ type: 'text', text: leadId }] }] },
        }),
      }).then((res) => {
        if (!res.ok) throw new Error(`WhatsApp Cloud API ${res.status}`);
      });
    const results = await Promise.allSettled([send(salonNumber, this.settings.salonTemplate), send(customerPhone, this.settings.customerTemplate)]);
    results.forEach((result, i) => {
      if (result.status === 'rejected') log('warn', 'whatsapp_api_failed', { leadId, recipient: i === 0 ? 'salon' : 'customer' });
    });
  }
}
