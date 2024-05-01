import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './services/chat/chat.service';
import { DatabaseModule } from '@app/database';
import { RoomsGateway } from '../gateways/rooms/rooms.gateway';

@Module({
  imports: [DatabaseModule],
  controllers: [ChatController],
  providers: [ChatService, RoomsGateway],
})
export class ChatModule {}
