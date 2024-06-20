import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FrinedsService } from './services/frineds/frineds.service';
import { UserAuthGuard } from 'src/guards/user-auth/user-auth.guard';
import { User } from 'src/decorators/user/user.decorator';
import { User as ActiveUser } from '@prisma/client';

@ApiTags('FRIENDS')
@Controller('friends')
export class FriendsController {
  constructor(private friendService: FrinedsService) {}

  @UseGuards(UserAuthGuard)
  @Get('get-friends')
  getFriends(@User() user: ActiveUser) {
    return this.friendService.getFriends(user.id);
  }

  @UseGuards(UserAuthGuard)
  @Post('send-friend-request/:receiverId')
  sendFriendRequest(
    @User() user: ActiveUser,
    @Param('receiverId') receiverId: string,
  ) {
    return this.friendService.addFriend(user.id, receiverId);
  }

  @UseGuards(UserAuthGuard)
  @Put('accept-friend-request/:requestId')
  acceptRequest(
    @User() user: ActiveUser,
    @Param('requestId') requestId: string,
  ) {
    return this.friendService.acceptRequest(requestId);
  }

  @UseGuards(UserAuthGuard)
  @Delete('decline-friend-request/:requestId')
  declineRequest(
    @User() user: ActiveUser,
    @Param('requestId') requestId: string,
  ) {
    return this.friendService.declineRequest(requestId);
  }

  @UseGuards(UserAuthGuard)
  @Delete('remove-friend/:friendId')
  removedRequest(
    @User() user: ActiveUser,
    @Param('friendId') friendId: string,
  ) {
    return this.friendService.removeFriend(user.id, friendId);
  }
}
