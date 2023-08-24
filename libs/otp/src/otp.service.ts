import { DatabaseService } from '@app/database';
import { Injectable, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { OTP, OTP_TYPE } from '@prisma/client';
import { randomInt } from 'crypto';

@Injectable()
export class OtpService {
  private logger = new Logger(OtpService.name);
  constructor(private databaseService: DatabaseService) {}

  private generateNumber(): string {
    const code = randomInt(100, 999);
    const code2 = randomInt(100, 999);
    return `${code}-${code2}`;
  }

  async generateOtp({
    isUser,
    type,
    userId,
  }: {
    isUser: boolean;
    type: OTP_TYPE;
    userId?: string;
  }): Promise<string> {
    const code = this.generateNumber();
    const otp: OTP = await this.databaseService.oTP.create({
      data: {
        code,
        isExpired: false,
        type,
        userId,
      },
    });
    const timeout = setTimeout(() => {
      this.markAsExpired(otp.id);
      clearTimeout(timeout);
    }, 5 * 60000);
    this.logger.verbose(otp);
    return code;
  }

  async verifyEmailOtp(code: string, userId: string): Promise<boolean> {
    const otp = await this.databaseService.oTP.findFirst({
      where: {
        AND: [{ userId }, { code }, { type: 'VERIFICATION' }],
      },
    });
    if (!otp) {
      return false;
    }
    if (otp.isExpired) {
      return false;
    } else {
      await this.databaseService.oTP.update({
        where: { id: otp.id },
        data: { isExpired: true },
      });
      return true;
    }
  }

  async verifyResetOtp(code: string, userId: string): Promise<boolean> {
    const otp = await this.databaseService.oTP.findFirst({
      where: {
        AND: [{ userId }, { code }, { type: 'PASSWORD_RESET' }],
      },
    });
    if (!otp) {
      return false;
    }
    if (otp.isExpired) {
      return false;
    } else {
      await this.databaseService.oTP.update({
        where: { id: otp.id },
        data: { isExpired: true },
      });
      return true;
    }
  }

  async markAsExpired(id: string) {
    const otp = await this.databaseService.oTP.update({
      where: { id },
      data: { isExpired: true },
    });
    this.logger.verbose(otp);
  }
}
