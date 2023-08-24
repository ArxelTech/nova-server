import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { DatabaseModule } from '@app/database';
import { AuthModule } from '@app/auth';
import { EmailModule } from '@app/email';
import { OtpModule } from '@app/otp';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    EmailModule,
    OtpModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService]
})
export class AuthenticationModule {}
