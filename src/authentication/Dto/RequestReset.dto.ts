import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength, minLength } from "class-validator";

@Exclude()
export class PasswordResetDto {

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    @Expose()
    email: string;
    
}