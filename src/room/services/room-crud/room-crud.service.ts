import { DatabaseService } from '@app/database';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateRoomDTO } from 'src/room/dto/CreateRoomDTo';
import { uniq } from 'lodash';
import { RoomsGateway } from 'src/gateways/rooms/rooms.gateway';
// eslint-disable-next-line @typescript-eslint/no-var-requires

@Injectable()
export class RoomCrudService {
  constructor(
    private databaseService: DatabaseService,
    private gateWay: RoomsGateway,
  ) {}

  public async createRoom(id: string, payload: CreateRoomDTO) {
    try {
      const createRoom = await this.databaseService.room.create({
        data: {
          link: payload.link,
          title: 'youtube video',
          creatorId: id,
          platform: payload.platform,
          type: payload.type,
        },
      });
      // TODO SEND NOTIFICATIONS TO FRIENDS
      return {
        message: 'Room created',
        data: createRoom,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async getRooms(id: string) {
    const firends = await this.databaseService.friends.findMany({
      where: {
        OR: [{ userId: id }, { friendId: id }],
      },
    });

    const rooms = await this.databaseService.room.findMany({});

    // const friendsRoom = await Promise.all(
    //   [...firends].map(async (friend) => {
    //     return await this.databaseService.room.findMany({
    //       where: {
    //         OR: [{ creatorId: friend.userId }, { creatorId: friend.friendId }],
    //       },
    //     });
    //   }),
    // );

    return {
      message: 'Active rooms',
      data: uniq(rooms),
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
      orderBy: {
        createdAt: 'asc',
      },
    });

    return {
      message: 'Room message',
      data,
    };
  }

  public async joinRoom(userId: string, roomId: string) {
    const member = await this.databaseService.roomMember.findFirst({
      where: {
        creatorId: userId,
      },
    });

    if (member) {
      throw new BadRequestException('You are already a member of this group');
    }

    const room = await this.databaseService.room.findUnique({
      where: {
        id: member.roomId,
      },
    });

    if (room.type === 'PRIVATE') {
      await this.databaseService.roomRequest.create({
        data: {
          creatorId: userId,
          roomId: room.id,
        },
      });

      const roomRequest = await this.databaseService.roomRequest.findMany({
        where: {
          roomId: room.id,
        },
        include: {
          creator: true,
          room: true,
        },
      });

      this.gateWay.server.emit(`ROOM-REQUEST-${room.id}`, roomRequest);

      return {
        message: 'Request sent!',
      };
    }

    // create new member
    await this.databaseService.roomMember.create({
      data: {
        creatorId: userId,
        memberType: 'MEMBER',
        roomId,
        isAdmitted: true,
      },
    });

    return {
      message: 'You have joined the room',
    };
  }
}
