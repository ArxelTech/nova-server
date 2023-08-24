import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength, minLength } from "class-validator";

@Exclude()
export class UserDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    @Expose()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    @Expose()
    lastName: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    @Expose()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, {
        message: "minimium of 8 alphanumeric characters",
    })
    @ApiProperty()
    password: string;
}