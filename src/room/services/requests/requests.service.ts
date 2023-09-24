import { DatabaseService } from '@app/database';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class RequestsService {
  constructor(private databaseService: DatabaseService) {}

  public async joinRoom(userId: string, roomId: string) {
    const room = await this.databaseService.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new BadRequestException('Invalid room id');
    }

    // create request
    await this.databaseService.roomRequest.create({
      data: {
        creatorId: userId,
        roomId,
      },
    });

    return {
      message: 'Request sent',
    };
  }

  public async acceptRequest(userId: string, requestId: string) {
    const roomReqest = await this.databaseService.roomRequest.findUnique({
      where: { id: requestId },
    });

    if (!roomReqest) {
      throw new BadRequestException('Invalid request id');
    }

    // accept request
    await this.databaseService.roomMember.create({
      data: {
        creatorId: roomReqest.creatorId,
        memberType: 'MEMBER',
        roomId: roomReqest.roomId,
      },
    });

    // delete request
    await this.databaseService.roomRequest.delete({
      where: { id: roomReqest.id },
    });

    return {
      messge: 'Rquest Acceted',
    };
  }
}
