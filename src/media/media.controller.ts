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
      const data = await Cloudinary.api.resources({
        type: 'upload',
        prefix: 'Avatars',
        all: true,
        max_results: 20,
        next_cursor: cursor ? cursor : null,
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
