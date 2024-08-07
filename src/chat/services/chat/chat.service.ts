import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '@app/database';
import { MessageDto } from '../../dto/messageDto';
import { RoomsGateway } from '../../../gateways/rooms/rooms.gateway';
import cloudinary from '../../../services/cloudinary';
import { SOCKET_EVENTS } from 'src/lib/socket.events';

@Injectable()
export class ChatService {
  private logger = new Logger('ChatService');
  constructor(
    private databaseService: DatabaseService,
    private chatGateway: RoomsGateway,
  ) {}

  async sendMessage(files: Array<Express.Multer.File>, payload: MessageDto) {
    if (files.length < 1) {
      const newMessage = await this.databaseService.message.create({
        data: {
          roomId: payload.roomId,
          message: payload.message,
          creatorId: payload.creatorId,
          messageType: 'WITH_MEDIA',
          media: [],
          isEdited: false,
          seenByAll: [],
        },
      });
      this.chatGateway.server.emit(
        SOCKET_EVENTS.NEW_MESSAGE_FE(newMessage.roomId).event,
        { roomId: newMessage.roomId, message: newMessage },
      );

      return {
        message: 'message sent',
        data: newMessage,
      };
    } else {
      const urls = [];
      for (const file of files) {
        const url = await cloudinary.uploader.upload(file.path);
        urls.push(url.secure_url);
      }

      const newMessage = await this.databaseService.message.create({
        data: {
          roomId: payload.roomId,
          message: payload.message,
          creatorId: payload.creatorId,
          messageType: 'WITH_MEDIA',
          media: urls,
          isEdited: false,
          seenByAll: [],
        },
      });
      this.chatGateway.server.emit(
        SOCKET_EVENTS.NEW_MESSAGE_FE(newMessage.roomId).event,
        { roomId: newMessage.roomId, message: newMessage },
      );
      return {
        message: 'message sent',
        data: newMessage,
      };
    }
  }
}
