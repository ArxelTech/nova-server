import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomCrudService } from './services/room-crud/room-crud.service';
import { DatabaseModule } from '@app/database';
import { RequestsService } from './services/requests/requests.service';
import { MessagesService } from './services/messages/messages.service';

@Module({
  controllers: [RoomController],
  providers: [RoomCrudService, RequestsService, MessagesService],
  imports: [DatabaseModule],
})
export class RoomModule {}
