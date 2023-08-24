import { DatabaseService } from '@app/database';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDto } from './Dto/User.dto';
import { genSalt, hash, compare } from 'bcrypt'
import { EmailService } from '@app/email';
import { AuthService } from '@app/auth';
import { VerifyTokenDto } from './Dto/VerifyToken.dto';
import { OtpService } from '@app/otp';
import { User } from '@prisma/client';
import { ResetPasswordDto } from './Dto/ResetPassword.dto';

@Injectable()
export class AuthenticationService {
    constructor(private databaseService: DatabaseService, private emailService: EmailService, private authService: AuthService, private otpService: OtpService) {}
        
    async createAccount(payload: Partial<UserDto>) {
        // check database for email
        const user = await this.databaseService.user.findFirst({ where: { email: payload.email } });
        if (user) {
            throw new BadRequestException('Email Already in use');
        }

        //hash password
        const salt = await genSalt(10);
        const password = await hash(payload.password, salt);

        payload.password = password;

        // create account
        const newUser = await this.databaseService.user.create({
            data: payload as any
        });

        try {
            await this.emailService.sendEmailVerificationOTP(newUser);
            const tokens = await this.authService.signjwt(newUser);

            return {
                message: 'Account created',
                data: {
                    ...newUser,
                    tokens,
                }
            }

        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async verifyToken(payload: VerifyTokenDto) {
        const verified = await this.otpService.verifyEmailOtp(payload.code, payload.userId);
        if (verified) {
            await this.databaseService.user.update({
                where: { id: payload.userId },
                data: { emailVerified: true }
            });
            return {
                message: 'Email verified'
            }
        }
        throw new BadRequestException('Invalid Code');
    }

    async verifyResetToken(payload: VerifyTokenDto) {
        const verified = await this.otpService.verifyResetOtp(payload.code, payload.userId);
        if (verified) {
            await this.databaseService.user.update({
                where: { id: payload.userId },
                data: { emailVerified: true }
            });
            return {
                message: 'Otp verified'
            }
        }
        throw new BadRequestException('Invalid Code');
    }

    async login(userDetails: Partial<User>) {
        const user = await this.databaseService.user.findFirst({ where: { email: userDetails.email } });
        if (user === null) {
            throw new BadRequestException('Invalid email or password');
        }

        // validate password
        const match = await compare(userDetails.password, user.password);
        if (!match) {
            throw new BadRequestException('Invalid email or password');
        }

        return {
            message: 'Login successful',
            data: {
                ...user,
                tokens: await this.authService.signjwt(user),
            }
        }
    }

    async requestResetCode(email: string) {
        const user = await this.databaseService.user.findFirst({ where: { email } });

        if (user === null) {
            throw new BadRequestException('Account not found');
        }
        await this.emailService.sendPasswordResetLink(user);
        return {
            message: 'If an account exisit with thia email a code will be sent to it',
            data: {
                userId: user.id,
            }
        }
    }

    async resetPassword(payload: ResetPasswordDto) {
        const user = await this.databaseService.user.findFirst({ where: { id: payload.userId } });
        
        if (user === null) {
            throw new BadRequestException('User not found');
        }

        // check password

        if (payload.confirmPassword !== payload.password) {
            throw new BadRequestException('Password does not match');
        }

         //hash password
         const salt = await genSalt(10);
         const password = await hash(payload.confirmPassword, salt);

         await this.databaseService.user.update({
            where: { id: user.id },
            data: { password },
         });

         return {
            message: 'password reset successful'
         }
    }
}
