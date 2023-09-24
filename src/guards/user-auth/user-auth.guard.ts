import { DatabaseService } from '@app/database';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private databaseService: DatabaseService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    // verify token
    try {
      const validatedToken: User = this.jwtService.decode(token) as User;
      const user = await this.databaseService.user.findUnique({
        where: { id: validatedToken.id },
      });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      request.user = validatedToken;
      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
