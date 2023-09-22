import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import Cloudinary from 'src/services/cloudinary';

@ApiTags('MEDIA')
@Controller('media')
export class MediaController {
  @ApiQuery({ name: 'cursor', type: String, required: false })
  @Get('avatars')
  async getAllAvatars(@Query('cursor') cursor: string) {
    try {
      if (cursor === null || cursor === undefined) {
        const data = await Cloudinary.api.resources({
          type: 'upload',
          prefix: 'Avatars',
          all: true,
          max_results: 20,
        });
        return {
          message: 'Avatar Images',
          data,
          totalResults: data.resources.length,
        };
      }
      const data = await Cloudinary.api.resources({
        type: 'upload',
        prefix: 'Avatars',
        all: true,
        max_results: 20,
        next_cursor: cursor,
      });
      return {
        message: 'Avatar Images',
        data,
        totalResults: data.resources.length,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
