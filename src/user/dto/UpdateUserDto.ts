import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

@Exclude()
export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  @Expose()
  @ApiProperty()
  username: string;

  @IsString()
  @IsOptional()
  @Expose()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsOptional()
  @Expose()
  @ApiProperty()
  lastName: string;

  @IsString()
  @IsOptional()
  @Expose()
  @ApiProperty()
  profilePic: string;
}
