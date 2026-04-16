import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { paymentSuccessUserTemplate } from './templates/payment-success-user.template';
import { paymentSuccessAdminTemplate } from './templates/payment-success-admin.template';

export interface PaymentEmailData {
  paymentId: string;
  serviceTitle: string;
  amount: number;
  currency: string;
  paypalOrderId: string;
  paypalCaptureId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  paymentDate: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT', 587),
      secure: false,
      auth: {
        user: this.configService.getOrThrow<string>('SMTP_USER'),
        pass: this.configService.getOrThrow<string>('SMTP_PASS'),
      },
    });
  }


  async sendPaymentSuccessToUser(data: PaymentEmailData): Promise<void> {
    const appName = this.configService.get<string>('APP_NAME', 'UCMS');
    const appUrl  = this.configService.get<string>('APP_URL', '#');

    const html = paymentSuccessUserTemplate({
      paymentId:     data.paymentId,
      serviceTitle:  data.serviceTitle,
      amount:        data.amount.toFixed(2),
      currency:      data.currency,
      paypalOrderId: data.paypalOrderId,
      customerName:  data.customerName,
      customerEmail: data.customerEmail,
      paymentDate:   data.paymentDate,
      appName,
      appUrl,
    });

    await this.sendMail({
      to:      data.customerEmail,
      subject: `✅ Payment Confirmed – ${data.serviceTitle} | ${appName}`,
      html,
    });

    this.logger.log(`Payment success email sent to user: ${data.customerEmail}`);
  }


  async sendPaymentSuccessToAdmin(data: PaymentEmailData): Promise<void> {
    const appName        = this.configService.get<string>('APP_NAME', 'UCMS');
    const appUrl         = this.configService.get<string>('APP_URL', '#');
    const adminEmail     = this.configService.getOrThrow<string>('SMTP_USER');
    const adminDashboard = `${appUrl}/admin/payments`;

    const html = paymentSuccessAdminTemplate({
      paymentId:         data.paymentId,
      serviceTitle:      data.serviceTitle,
      amount:            data.amount.toFixed(2),
      currency:          data.currency,
      paypalOrderId:     data.paypalOrderId,
      paypalCaptureId:   data.paypalCaptureId ?? 'N/A',
      customerName:      data.customerName,
      customerEmail:     data.customerEmail,
      customerPhone:     data.customerPhone ?? 'N/A',
      paymentDate:       data.paymentDate,
      adminDashboardUrl: adminDashboard,
      appName,
      appUrl,
    });

    await this.sendMail({
      to:      adminEmail,
      subject: `💰 New Payment Received – ${data.currency} ${data.amount.toFixed(2)} from ${data.customerName}`,
      html,
    });

    this.logger.log(`Payment notification sent to admin: ${adminEmail}`);
  }


  private async sendMail(options: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    const from = `"${this.configService.get('APP_NAME', 'UCMS')}" <${this.configService.get('SMTP_USER')}>`;

    try {
      await this.transporter.sendMail({
        from,
        to:      options.to,
        subject: options.subject,
        html:    options.html,
      });
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}`, error);
    }
  }
}