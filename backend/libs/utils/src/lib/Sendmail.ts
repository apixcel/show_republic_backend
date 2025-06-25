import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
@Injectable()
export class SendEmailService {
  constructor(private configService: ConfigService) {}

  async sendMail({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL'),
        pass: this.configService.get<string>('PASS'),
      },
    });

    const mailOptions = {
      from: this.configService.get<string>('EMAIL'),
      to,
      subject,
      html,
    };

    // Send the OTP email
    await transporter.sendMail(mailOptions);
  }
}
