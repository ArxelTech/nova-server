import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength, minLength } from "class-validator";

@Exclude()
export class VerifyTokenDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    @Expose()
    userId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    @Expose()
    code: string;

}