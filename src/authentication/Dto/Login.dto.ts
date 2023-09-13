import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@Exclude()
export class LoginDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  @Expose()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: 'minimium of 8 alphanumeric characters',
  })
  @ApiProperty()
  password: string;
}
