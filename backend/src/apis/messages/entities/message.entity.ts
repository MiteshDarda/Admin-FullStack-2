import { Global } from '@nestjs/common';
import { UserRepository } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Global()
@Entity('messages')
@Index(['from', 'to'])
@Index(['createdAt'])
export class MessageRepository {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserRepository, (user) => user.messagesFrom, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  from: UserRepository | string;

  @ManyToOne(() => UserRepository, (user) => user.messagesTo, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  to: UserRepository | string;

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}
