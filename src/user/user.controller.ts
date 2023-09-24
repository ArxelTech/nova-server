import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { CrudService } from './services/crud/crud.service';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from 'src/guards/user-auth/user-auth.guard';
import { User } from 'src/decorators/user/user.decorator';
import { User as PrismaUser } from '@prisma/client';
import { UpdateUserDTO } from './dto/UpdateUserDto';
import { UpdatePasswordDto } from './dto/UpdatePasswordDto';

@ApiTags('USER')
@Controller('user')
export class UserController {
  constructor(private crudService: CrudService) {}

  @ApiParam({ name: 'id', required: true, type: String })
  @Get(':id')
  public async getUserById(@Param('id') id: string) {
    return this.crudService.getUserById(id);
  }

  @UseGuards(UserAuthGuard)
  @ApiBody({ type: UpdateUserDTO })
  @Put(':id')
  public updateDetails(@User() user: PrismaUser, @Body() body: UpdateUserDTO) {
    return this.crudService.updateUserDetails(user.id, body);
  }

  @UseGuards(UserAuthGuard)
  @ApiBody({ type: UpdatePasswordDto })
  @Put('/changepassword/:id')
  public updatePassword(
    @User() user: PrismaUser,
    @Body() body: UpdatePasswordDto,
  ) {
    return this.crudService.updatePassword(user.id, body);
  }
}
