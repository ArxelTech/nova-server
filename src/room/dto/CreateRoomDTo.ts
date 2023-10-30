import { ApiProperty } from '@nestjs/swagger';
import { ROOM_TYPE } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class CreateRoomDTO {
  @Expose()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: ROOM_TYPE;

  @Expose()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  link: string;

  // @Expose()
  // @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  // title: string;

  @Expose()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  creatorId: string;

  @Expose()
  @ApiProperty({ description: 'This can either be YOUTUBE | NETFLIX for now' })
  @IsString()
  @IsNotEmpty()
  platform: string;
}
