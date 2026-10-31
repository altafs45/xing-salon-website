// Sending email. SmtpMailProvider works with any SMTP inbox (Gmail app password, Zoho, SES SMTP…). For Resend or
// the SES API, implement MailProvider and choose it in server/config.ts.
import nodemailer, { type Transporter } from 'nodemailer';
import { log, maskEmail } from '../log';

export interface MailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export interface MailProvider {
  send(message: MailMessage): Promise<void>;
}

export interface SmtpSettings {
  host: string;
  port: number;
  user?: string;
  pass?: string;
  from: string;
}

export class SmtpMailProvider implements MailProvider {
  private readonly transport: Transporter;

  constructor(private readonly settings: SmtpSettings) {
    this.transport = nodemailer.createTransport({
      host: settings.host,
      port: settings.port,
      // Port 465 is TLS from the start; 587 upgrades with STARTTLS.
      secure: settings.port === 465,
      auth: settings.user ? { user: settings.user, pass: settings.pass } : undefined,
    });
  }

  async send(message: MailMessage) {
    await this.transport.sendMail({ from: this.settings.from, ...message });
  }
}

/** Used when SMTP isn't configured: logs that an email would have gone out (addresses masked) and sends nothing. */
export class ConsoleMailProvider implements MailProvider {
  async send(message: MailMessage) {
    log('info', 'mail_not_configured', { to: maskEmail(message.to), subject: message.subject });
  }
}
