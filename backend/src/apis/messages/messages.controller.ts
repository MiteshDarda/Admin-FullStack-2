import {
  Controller,
  Param,
  UseGuards,
  Headers,
  Get,
  Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { AppService } from 'src/app.service';
import { Pagination } from 'src/common/dto/pagination.dto';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly appService: AppService,
  ) {}

  //* Get Messages Between msgTo and the user who called the API .
  @Get(':msgTo')
  @UseGuards(AuthGuard)
  async getMessages(
    @Headers('authorization') authorizationHeader: string,
    @Query() getMessagesDto: Pagination,
    @Param() params: any,
  ) {
    const msgFrom = this.appService.convertJWT(authorizationHeader);
    const msgTo = params.msgTo;
    return this.messagesService.getMessages(
      msgFrom,
      msgTo,
      getMessagesDto.limit,
      getMessagesDto.page,
    );
  }
}
