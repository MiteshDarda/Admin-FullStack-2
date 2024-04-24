import { Inject, Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { UserRepository } from 'src/apis/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageRepository } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @Inject(AppService)
    private readonly appService: AppService,
    @InjectRepository(UserRepository)
    private readonly userRepository: Repository<UserRepository>,
    @InjectRepository(MessageRepository)
    private readonly messageRepository: Repository<UserRepository>,
  ) {}

  async getMessages(
    msgFrom: string,
    msgTo: string,
    limit: number,
    page: number,
  ) {
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .select('message.from', 'senderId')
      .addSelect('message.createdAt', 'time')
      .addSelect('message.message', 'content')
      .addSelect("'message' AS type")
      .where('(message.from = :from AND message.to = :to)', {
        from: msgFrom,
        to: msgTo,
      })
      .orWhere('(message.from = :from2 AND message.to = :to2)', {
        from2: msgTo,
        to2: msgFrom,
      })
      .orderBy(`message.createdAt`, 'DESC') // or ASC
      .skip((page - 1) * limit)
      .take(limit)
      .execute();
    return messages;
  }

  async identifyUser(client: any) {
    const auth = client?.handshake?.headers?.['auth'];
    if (!auth) return null;
    return this.appService.validate(auth);
  }

  async create(createMessageDto: CreateMessageDto) {
    this.messageRepository
      .createQueryBuilder('message')
      .insert()
      .into(MessageRepository)
      .values({
        from: createMessageDto.senderId,
        to: createMessageDto.recipientId,
        message: createMessageDto.content,
      })
      .execute();
    return 'Done';
  }
}
