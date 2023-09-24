import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RoomCrudService } from './services/room-crud/room-crud.service';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from 'src/guards/user-auth/user-auth.guard';
import { User } from 'src/decorators/user/user.decorator';
import { User as PrismaUser } from '@prisma/client';
import { CreateRoomDTO } from './dto/CreateRoomDTo';
import { RequestsService } from './services/requests/requests.service';

@ApiTags('ROOMS')
@Controller('room')
export class RoomController {
  constructor(
    private crudService: RoomCrudService,
    private requestService: RequestsService,
  ) {}

  @UseGuards(UserAuthGuard)
  @ApiBody({ type: CreateRoomDTO })
  @Post('create')
  getRoom(@User() user: PrismaUser, @Body() body: CreateRoomDTO) {
    return this.crudService.createRoom(user.id, body);
  }

  @UseGuards(UserAuthGuard)
  @Get('get-rooms')
  getUserActiveRooms(@User() user: PrismaUser) {
    return this.crudService.getRooms(user.id);
  }

  @UseGuards(UserAuthGuard)
  @ApiParam({ name: 'roomId' })
  @Get('get-room-messages/:roomId')
  getRoomMessages(@Param('roomId') roomId: string) {
    return this.crudService.getRoomMessages(roomId);
  }

  @UseGuards(UserAuthGuard)
  @ApiParam({ name: 'roomId' })
  @Get('get-room-members/:roomId')
  getRoomMembers(@Param('roomId') roomId: string) {
    return this.crudService.getRoomMembers(roomId);
  }

  @UseGuards(UserAuthGuard)
  @ApiParam({ name: 'roomId' })
  @Get('get-room-requests/:roomId')
  getRoomRequest(@Param('roomId') roomId: string) {
    return this.crudService.getRoomRequest(roomId);
  }

  // PUT
  @ApiParam({ name: 'roomId' })
  @UseGuards(UserAuthGuard)
  @Post('join-room/:roomId')
  sentRoomRequest(@User() user: PrismaUser) {
    return this.crudService.getRooms(user.id);
  }
}
