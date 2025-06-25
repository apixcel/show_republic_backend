import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { SendEmailService } from './Sendmail';
@Injectable()
export class OtpService {
  constructor(
    private configService: ConfigService,
    private emailService: SendEmailService,
  ) { }

  async customOtpGen(
    email: string,
    firstName: string,
  ): Promise<{ otp: number }> {
    const otp = Math.floor(100000 + Math.random() * 900000);

    this.sendOtpEmail(email, otp, firstName);
    console.log(otp, 'OTP generated for user registration');
    return { otp };
  }

  // Function to generate EXPIRY
  async customexpiry(): Promise<{ expiry: Date }> {
    const otpExpiryMinutes = this.configService.get<number>(
      'OTP_EXPIRY_MINUTES',
      10,
    ); // Default to 10 if not found
    const expiry = new Date(Date.now() + otpExpiryMinutes * 60000); // Calculate expiry time
    return { expiry };
  }

  // Function to send OTP to the email

  async sendOtpEmail(email: string, otp: number, name: string): Promise<void> {
    try {
      // Resolve the path and read the HTML template file
      const filePath = path.resolve(
        __dirname,
        'email-templates',
        'otp-verification-template.html',
      );
      if (!fs.existsSync(filePath)) {
        throw new Error(`Template file not found at ${filePath}`);
      }
      const htmlTemplate = fs.readFileSync(filePath, 'utf-8'); // Read the content of the file

      // Replace placeholders with actual values (OTP and name)
      const htmlContent = htmlTemplate
        .replace('{{user_name}}', name) // Replace the NAME placeholder
        .replace('{{otp_code}}', otp.toString()); // Replace the OTP value

      await this.emailService.sendMail({
        to: email,
        subject: 'Account Verification - OTP Code',
        html: htmlContent, // Use the HTML content
      });

      console.log('OTP email sent successfully', otp);
    } catch (error) {
      console.error('Error sending OTP email:', error);
      // throw new Error('Failed to send OTP email.');
    }
  }
}
