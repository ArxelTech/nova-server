import { DatabaseService } from '@app/database';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FrinedsService {
  constructor(private databaseService: DatabaseService) {}

  async getFriends(userId: string) {
    const friends = await this.databaseService.friends.findMany({
      where: {
        OR: [{ userId }, { friendId: userId }],
      },
      include: {
        friend: true,
      },
    });

    return {
      message: 'Friend',
      data: friends,
    };
  }

  async addFriend(userId: string, receiverId: string) {
    const request = await this.databaseService.friendRequest.create({
      data: {
        senderId: userId,
        receiverId,
      },
    });

    // send notifications

    return {
      message: 'Friend request sent',
      data: request,
    };
  }

  async acceptRequest(requestId: string) {
    const request = await this.databaseService.friendRequest.findUnique({
      where: {
        id: requestId,
      },
    });

    if (!request) {
      throw new BadRequestException('Request not found!');
    }

    await this.databaseService.friends.create({
      data: {
        userId: request.receiverId,
        friendId: request.senderId,
      },
    });

    await this.databaseService.friendRequest.delete({
      where: { id: requestId },
    });

    return {
      message: 'Friend request accepted',
    };
  }

  async declineRequest(requestId: string) {
    const request = await this.databaseService.friendRequest.findUnique({
      where: {
        id: requestId,
      },
    });

    if (!request) {
      throw new BadRequestException('Request not found!');
    }

    await this.databaseService.friendRequest.delete({
      where: { id: requestId },
    });

    return {
      message: 'Friend request declined',
    };
  }

  async removeFriend(userId: string, friendId: string) {
    const request = await this.databaseService.friends.findFirst({
      where: {
        AND: [{ userId }, { friendId }],
      },
    });

    if (!request) {
      throw new BadRequestException('Friend not found!');
    }

    await this.databaseService.friends.delete({
      where: { id: request.id },
    });

    return {
      message: `You are no longer friends with this user`,
    };
  }
}
