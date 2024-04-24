import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessagesGateway } from './messages.gateway';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, MessagesGateway, AuthGuard],
})
export class MessagesModule {}
