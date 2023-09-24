import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class UpdateUserDTO {
  @IsString()
  @IsNotEmpty()
  @Expose()
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  @ApiProperty()
  lastName: string;
}
