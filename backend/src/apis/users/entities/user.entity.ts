import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { DesignationEnum } from '../enums/DesignationEnum';
import { MessageRepository } from 'src/apis/messages/entities/message.entity';
import { Global } from '@nestjs/common';
import { TasksAssignedRepository } from 'src/apis/tasks/entities/tasks_assigned.entity';
import { TasksRepository } from 'src/apis/tasks/entities/tasks.entity';

@Global()
@Entity('user')
@Index(['name', 'email', 'designation'])
export class UserRepository {
  //* Email .
  @PrimaryColumn({ type: 'varchar', length: 250 })
  email: string;

  //* Name .
  @Column({ type: 'varchar', length: 250 })
  name: string;

  //* Password .
  @Column({ type: 'varchar', length: 250 })
  password: string;

  //* Designation .
  @Column({ type: 'enum', enum: DesignationEnum })
  designation: string;

  //* Address .
  @Column({ type: 'varchar', length: 250, nullable: true })
  address: string | null;

  //* Mobile .
  @Column({ type: 'varchar', length: 250, nullable: true })
  mobile: string | null;

  //* Name On Passbook .
  @Column({ type: 'varchar', length: 250, nullable: true })
  nameOnPassbook: string | null;

  //* Bank Name .
  @Column({ type: 'varchar', length: 250, nullable: true })
  bankName: string | null;

  //* Account Number .
  @Column({
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  accountNumber: string | null;

  //* IFSC .
  @Column({ type: 'varchar', length: 250, nullable: true })
  ifsc: string | null;

  //* PAN NUMBER .
  @Column({ type: 'varchar', length: 250, nullable: true })
  panNum: string | null;

  //* TOKEN .
  @Column({ type: 'varchar', length: 250 })
  bearer: string;

  //* Is Verified ? .
  @Column({ type: 'boolean', default: () => false })
  isVerified: boolean;

  //* Created At .
  @CreateDateColumn()
  createdAt: Date;

  //* Message(s) From .
  @OneToMany(() => MessageRepository, (messages) => messages.from, {
    onDelete: 'CASCADE',
  })
  messagesFrom: MessageRepository[];

  //* Message(s) To .
  @OneToMany(() => MessageRepository, (messages) => messages.to, {
    onDelete: 'CASCADE',
  })
  messagesTo: MessageRepository[];

  //* Which Task(s) are assigned .
  @OneToMany(() => TasksAssignedRepository, (tasks) => tasks.assignedTo, {
    onDelete: 'CASCADE',
  })
  taskAssigned: TasksAssignedRepository[];

  //* Creator of a Task .
  @OneToMany(() => TasksRepository, (tasks) => tasks.taskAssignedBy, {
    onDelete: 'CASCADE',
  })
  taskCreator: TasksRepository[];

  //* Stars Received .
  @Column({ type: 'integer', nullable: true })
  deliveryStarsReceived: number | null;

  //* Stars Received .
  @Column({ type: 'integer', nullable: true })
  deliveryTotalStars: number | null;

  //* Stars Received .
  @Column({ type: 'integer', nullable: true })
  qualityStarsReceived: number | null;

  //* Stars Received .
  @Column({ type: 'integer', nullable: true })
  qualityTotalStars: number | null;

  //* Stars Received .
  @Column({ type: 'integer', nullable: true })
  communicationStarsReceived: number | null;

  //* Stars Received .
  @Column({ type: 'integer', nullable: true })
  communicationTotalStars: number | null;

  //* Stars Received .
  @Column({ type: 'integer', nullable: true })
  overallStarsReceived: number | null;

  //* Stars Received .
  @Column({ type: 'integer', nullable: true })
  overallTotalStars: number | null;
}
