import { Body, Controller, Post, Put } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UserDto } from './Dto/User.dto';
import { VerifyTokenDto } from './Dto/VerifyToken.dto';
import { User } from '@prisma/client';
import { PasswordResetDto } from './Dto/RequestReset.dto';
import { ResetPasswordDto } from './Dto/ResetPassword.dto';

@ApiTags('Authentication')
@Controller('authentication')
export class AuthenticationController {
    constructor(private authService: AuthenticationService) {}
    @ApiBody({ type: UserDto, required: true })
    @Post('signup')
    async signup(@Body() user: UserDto) {
        return this.authService.createAccount(user);
    }

    @ApiBody({ type: VerifyTokenDto, required: true })
    @Post('verify-email')
    async verifyemail(@Body() user: VerifyTokenDto) {
        return this.authService.verifyToken(user);
    }

    @ApiBody({ type: UserDto, required: true })
    @Post('login')
    async login(@Body() user: User) {
        return this.authService.login(user);
    }

    @ApiBody({ type: PasswordResetDto })
    @Post('request-password-reset-code')
    async requestresetcode(@Body() body: PasswordResetDto) {
        return this.authService.requestResetCode(body.email);
    }

    @ApiBody({ type: VerifyTokenDto })
    @Post('verify-password-reset-code')
    async verifyresetcode(@Body() body: VerifyTokenDto) {
        return this.authService.verifyResetToken(body);
    }

    @ApiBody({ type: ResetPasswordDto })
    @Put('reset-password')
    async resetpassword(@Body() body: ResetPasswordDto ) {
        return this.authService.resetPassword(body);
    }
}
