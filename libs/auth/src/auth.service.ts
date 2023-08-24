import { DatabaseService } from '@app/database';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/authentication/Dto/User.dto';

@Injectable()
export class AuthService {
    constructor(private database: DatabaseService, private jwtService: JwtService) {}

    async signjwt(userDetails: Partial<UserDto>): Promise<{ accessToken: string, refreshToken: string}> {
        const user = await this.database.user.findFirst({ where: { email: userDetails.email } });
        if (user === null) {
            throw new Error("User not found");
        }

        // check password
        if (userDetails.password !== user.password) {
            throw new Error("Email or password incorrect")
        }
        // generate tokens
        const accessToken = await this.jwtService.signAsync(userDetails, { algorithm: 'HS256', expiresIn: '2d' });
        const refreshToken = await this.jwtService.signAsync(userDetails, { algorithm: 'HS256', expiresIn: '2m' });
        return { accessToken, refreshToken };
    }
}
