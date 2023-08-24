import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';
import { OtpService } from 'libs/otp/src';
import { User } from '@prisma/client';

@Injectable()
export class EmailService {
  private logger = new Logger(EmailService.name);
  constructor(
    private otpService: OtpService,
    private mailService: MailerService,
  ) {}
  async sendEmailVerificationOTP(user: User) {
    const otp = await this.otpService.generateOtp({
      isUser: true,
      type: 'VERIFICATION',
      userId: user.id,
    });
    const emailFeedBack = await this.mailService.sendMail({
      to: user.email,
      subject: 'Verify your email',
      template: join(process.cwd(), 'templates/verify-email.hbs'),
      context: {
        code: otp,
      },
    });
    this.logger.log(emailFeedBack);
  }

  async sendPasswordResetLink(user: User) {
    console.log(user);
    const otp = await this.otpService.generateOtp({
      isUser: true,
      type: 'PASSWORD_RESET',
      userId: user.id,
    });
    const emailFeedBack = await this.mailService.sendMail({
      to: user.email,
      subject: 'Verify your email',
      template: join(process.cwd(), 'templates/passwordReset.hbs'),
      context: {
        url: `${otp}`,
      },
    });
    this.logger.log(emailFeedBack);
  }
}
