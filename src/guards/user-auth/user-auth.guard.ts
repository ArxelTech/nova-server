import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    // verify token
    try {
      const validatedToken = this.jwtService.decode(token);
      request.user = validatedToken;
      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
