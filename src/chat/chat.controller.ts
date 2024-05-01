import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ChatService } from './services/chat/chat.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MessageDto } from './dto/messageDto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('CHAT')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send_message')
  @UseInterceptors(FilesInterceptor('files'))
  sendMessage(
    @Body() body: MessageDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.chatService.sendMessage(files, body);
  }
}
