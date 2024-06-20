import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FrinedsService } from './services/frineds/frineds.service';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [DatabaseModule],
  controllers: [FriendsController],
  providers: [FrinedsService],
})
export class FriendsModule {}
