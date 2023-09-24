import { DatabaseService } from '@app/database';
import { Injectable } from '@nestjs/common';
import { CreateRoomDTO } from 'src/room/dto/CreateRoomDTo';
import { uniq } from 'lodash';

@Injectable()
export class RoomCrudService {
  constructor(private databaseService: DatabaseService) {}

  public async createRoom(id: string, payload: CreateRoomDTO) {
    const createRoom = await this.databaseService.room.create({
      data: {
        ...payload,
      },
    });

    // TODO SEND NOTIFICATIONS TO FRIENDS

    return {
      message: 'Room created',
      data: createRoom,
    };
  }

  public async getRooms(id: string) {
    const firends = await this.databaseService.friends.findMany({
      where: {
        OR: [{ userId: id }, { friendId: id }],
      },
    });

    const friendsRoom = await Promise.all(
      [...firends].map(async (friend) => {
        return await this.databaseService.room.findMany({
          where: {
            OR: [{ creatorId: friend.userId }, { creatorId: friend.friendId }],
          },
        });
      }),
    );

    return {
      message: 'Active rooms',
      data: uniq(friendsRoom),
    };
  }

  public async getRoomById(id: string) {
    const data = await this.databaseService.room.findUnique({
      where: { id },
      include: {
        creator: true,
        Message: true,
        RoomMembers: true,
        RoomRequest: true,
      },
    });
    return {
      message: 'Room',
      data,
    };
  }

  public async getRoomMembers(id: string) {
    const data = await this.databaseService.roomMember.findMany({
      where: { roomId: id },
    });

    return {
      message: 'Room members',
      data,
    };
  }

  public async getRoomRequest(id: string) {
    const data = await this.databaseService.roomRequest.findMany({
      where: { roomId: id },
    });

    return {
      message: 'Room request',
      data,
    };
  }

  public async getRoomMessages(id: string) {
    const data = await this.databaseService.message.findMany({
      where: { roomId: id },
    });

    return {
      message: 'Room message',
      data,
    };
  }
}
