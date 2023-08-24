import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DatabaseModule } from '@app/database';

@Module({
  providers: [AuthService],
  exports: [AuthService],
  imports: [DatabaseModule],
})
export class AuthModule {}
