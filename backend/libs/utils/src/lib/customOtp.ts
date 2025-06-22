import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
@Injectable()
export class OtpService {
  constructor(private configService: ConfigService) {}

  async customOtpGen(
    email: string,
    firstName: string
  ): Promise<{ otp: number }> {
    const otp = Math.floor(1000 + Math.random() * 9000);

    this.sendOtpEmail(email, otp, firstName);
    return { otp };
  }

  // Function to generate EXPIRY
  async customexpiry(): Promise<{ expiry: Date }> {
    const otpExpiryMinutes = this.configService.get<number>(
      'OTP_EXPIRY_MINUTES',
      10
    ); // Default to 10 if not found
    const expiry = new Date(Date.now() + otpExpiryMinutes * 60000); // Calculate expiry time
    return { expiry };
  }

  // Function to send OTP to the email

  async sendOtpEmail(email: string, otp: number, name: string): Promise<void> {
    try {
      // Create the transporter using your Gmail credentials
      const transporter = nodemailer.createTransport({
        service: 'gmail', // Use the appropriate email service
        auth: {
          user: this.configService.get<string>('EMAIL'), // Get email from ConfigService
          pass: this.configService.get<string>('PASS'), // Get password from ConfigService
        },
      });

      // Resolve the path and read the HTML template file
      const filePath = path.resolve(
        __dirname,
        'email-templates',
        'otp-verification-template.html'
      );
      if (!fs.existsSync(filePath)) {
        throw new Error(`Template file not found at ${filePath}`);
      }
      const htmlTemplate = fs.readFileSync(filePath, 'utf-8'); // Read the content of the file

      // Replace placeholders with actual values (OTP and name)
      const htmlContent = htmlTemplate
        .replace('NAME', name) // Replace the NAME placeholder
        .replace('123456', otp.toString()); // Replace the OTP value

      // Define the email options
      const mailOptions = {
        from: this.configService.get<string>('EMAIL'),
        to: email,
        subject: 'Account Verification - OTP Code',
        html: htmlContent, // Use the HTML content
      };

      // Send the OTP email
      // await transporter.sendMail(mailOptions);
      console.log('OTP email sent successfully', otp);
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw new Error('Failed to send OTP email.');
    }
  }
}
