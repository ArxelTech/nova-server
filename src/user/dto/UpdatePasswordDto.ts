import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  oldpassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  newpassword: string;
}
