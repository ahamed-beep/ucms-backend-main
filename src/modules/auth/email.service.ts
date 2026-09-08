import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { getAdminLoginAlertTemplate } from './templates/admin-login-alert.template';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;
   private adminAlertTransporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
 this.transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',   
  port: 587,                
  secure: false,
  auth: {
    user: this.configService.get<string>('SMTP_USER'), 
    pass: this.configService.get<string>('SMTP_PASS'), 
  },
});
   this.adminAlertTransporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get<string>('ADMIN_ALERT_SMTP_USER'),
        pass: this.configService.get<string>('ADMIN_ALERT_SMTP_PASS'),
      },
    });
  }

  async sendOtpEmail(email: string, otp: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"Support" <${this.configService.get<string>('SMTP_USER')}>`,
        to: email,
        subject: 'Password Reset OTP',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
            <h2>Password Reset Request</h2>
            <p>Your OTP code is:</p>
            <h1 style="letter-spacing: 8px; color: #4F46E5;">${otp}</h1>
            <p>This OTP is valid for <strong>5 minutes</strong>.</p>
            <p>If you did not request this, please ignore this email.</p>
          </div>
        `,
      });
      this.logger.log(`OTP email sent to ${email}`);
    } catch (error) {
      this.logger.error('sendOtpEmail error:', error);
      throw error;
    }
  }

async sendAdminLoginAlert(
  firstName: string,
  lastName: string,
  loggedInEmail: string,
): Promise<void> {
  try {
    const loginTime = new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'medium',
    });

    const resetPasswordUrl = 'https://ucms.net.au/verify';
    const adminNotifyEmail = this.configService.get<string>('ADMIN_ALERT_SMTP_USER');

    await this.adminAlertTransporter.sendMail({
      from: `"Support" <${adminNotifyEmail}>`,
      to: adminNotifyEmail,
      subject: '⚠️ Admin Login Alert',
      html: getAdminLoginAlertTemplate(firstName, lastName, loggedInEmail, loginTime, resetPasswordUrl),
    });

    this.logger.log(`Admin login alert sent to ${adminNotifyEmail}`);
  } catch (error) {
    this.logger.error('sendAdminLoginAlert error:', error);
  }
}
}