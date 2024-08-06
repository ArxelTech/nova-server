import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ transports: ['polling'], cors: '*' })
export class RoomsGateway {
  @WebSocketServer()
  server: Server;

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
