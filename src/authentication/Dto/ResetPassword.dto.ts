import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength, minLength } from "class-validator";

@Exclude()
export class ResetPasswordDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, {
        message: "minimium of 8 alphanumeric characters",
    })
    @ApiProperty()
    password: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, {
        message: "minimium of 8 alphanumeric characters",
    })
    @ApiProperty()
    confirmPassword: string;
}