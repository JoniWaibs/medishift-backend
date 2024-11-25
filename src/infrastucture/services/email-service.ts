import nodemailer from 'nodemailer';
import { envs } from '../../config/envs';
interface Attachment {
  filename: string;
  path: string;
}

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Attachment[];
}

export class EmailService {
  #transporter: nodemailer.Transporter;

  constructor() {
    this.#transporter = nodemailer.createTransport({
      host: envs.MAILER_HOST, // e.g., 'smtp.gmail.com' for Gmail
      service: envs.MAILER_SERVICE,
      port: envs.MAILER_PORT || 587, // 587 is standard for TLS, 465 for SSL
      secure: envs.MAILER_SECURE, // true for 465, false for other ports
      auth: {
        user: envs.MAILER_EMAIL,
        pass: envs.MAILER_API_KEY,
      },
    });
  }

  async sendEmail({
    to,
    subject,
    text,
    html,
    attachments,
  }: SendEmailOptions): Promise<void> {
    const mailOptions = {
      from: envs.MAILER_FROM,
      to,
      subject,
      text,
      html,
      ...(attachments && { attachments })
    };

    try {
      await this.#transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
