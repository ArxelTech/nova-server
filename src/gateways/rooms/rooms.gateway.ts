import { DatabaseService } from '@app/database';
import { BadRequestException } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Room } from '@prisma/client';
import { Server } from 'socket.io';
import { SOCKET_EVENTS } from 'src/lib/socket.events';

@WebSocketGateway({ transports: ['polling'], cors: '*' })
export class RoomsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private databaseService: DatabaseService) {}

  @SubscribeMessage(SOCKET_EVENTS.PLAY_PAUSE.event)
  async handlePlayPause(@MessageBody() body: { roomid: string }) {
    const room = await this.databaseService.room.findUnique({
      where: {
        id: body.roomid,
      },
    });

    if (!room) {
      throw new BadRequestException('Room not found');
    }

    const updated = await this.databaseService.room.update({
      where: {
        id: room.id,
      },
      data: {
        isPlaying: room.isPlaying ? false : true,
      },
    });

    this.server.emit(SOCKET_EVENTS.PLAY_PAUSE_FE(room.id).event, {
      room: updated,
    });

    console.log({
      message: SOCKET_EVENTS.UPDATE_PLAYBACK_FE + 'Event sent',
    });
    console.log('--------UPDATED ROOM PLAY PAUSE DETAILS----------');
    console.log(updated);
    return {
      message: updated.isPlaying ? 'Is now playing' : 'Is Paused',
      data: updated,
    };
  }

  @SubscribeMessage(SOCKET_EVENTS.UPDATE_PLAYBACK.event)
  async handlePlayback(@MessageBody() body: { id: string; playback: number }) {
    const room = await this.databaseService.room.findUnique({
      where: {
        id: body.id,
      },
    });

    if (!room) {
      throw new BadRequestException('Room not found');
    }

    const updated = await this.databaseService.room.update({
      where: {
        id: room.id,
      },
      data: {
        playback: body.playback,
      },
    });

    console.log(room.id === room.id);
    this.server.emit(SOCKET_EVENTS.UPDATE_PLAYBACK_FE(room.id).event, {
      room: updated,
    });
    console.log({
      message: SOCKET_EVENTS.UPDATE_PLAYBACK_FE + 'Event sent',
    });
    console.log('--------UPDATED ROOM PLAY BACK DETAILS----------');
    console.log(updated);
  }

  @SubscribeMessage('connected')
  handleEvent(@MessageBody() data: unknown): WsResponse<unknown> {
    this.server.emit('message', {
      data: 'This is from the server',
      msg: 'New message',
    });
    console.log(data);
    const event = 'events';
    return { event, data };
  }
}
