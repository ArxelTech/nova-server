import { DatabaseService } from '@app/database';
import { BadRequestException, Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';
import { UpdatePasswordDto } from 'src/user/dto/UpdatePasswordDto';
import { UpdateUserDTO } from 'src/user/dto/UpdateUserDto';

@Injectable()
export class CrudService {
  constructor(private datbaseService: DatabaseService) {}

  public async getUserById(id: string) {
    const user = await this.datbaseService.user.findUnique({ where: { id } });
    if (user === null || user === undefined) {
      throw new BadRequestException('User not found');
    }

    // TODO add relationships for friends and other entities
    // related to the user

    return {
      message: 'User Found',
      data: user,
    };
  }

  public async updateUserDetails(id: string, details: UpdateUserDTO) {
    if (details.username) {
      const usernameinUse = await this.datbaseService.user.findFirst({
        where: { username: details.username },
      });

      if (usernameinUse) {
        throw new BadRequestException('Username already in use');
      }

      // update the username
      await this.datbaseService.user.update({
        where: { id },
        data: { ...details, username: details.username },
      });
      delete details.username;
      return {
        message: 'Deails updated',
      };
    }
    // update the username
    await this.datbaseService.user.update({
      where: { id },
      data: { ...details },
    });
    return {
      message: 'Deails updated',
    };
  }

  public async updatePassword(id: string, details: UpdatePasswordDto) {
    const user = await this.datbaseService.user.findUnique({ where: { id } });

    // validate the password
    const match = compare(details.oldpassword, user.password);
    if (!match) {
      throw new BadRequestException('Old password does not mmatch');
    }
    const salt = await genSalt();
    const hashPassword = await hash(details.newpassword, salt);
    // update the password
    await this.datbaseService.user.update({
      where: { id },
      data: { password: hashPassword },
    });
    return {
      message: 'Password updated',
    };
  }

  // FOR TESTING ONLY
  async getAllUsers() {
    const users = await this.datbaseService.user.findMany();

    return {
      message: 'Users',
      data: users,
    };
  }
}
