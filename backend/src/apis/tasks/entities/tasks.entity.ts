import { Global } from '@nestjs/common';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TasksAssignedRepository } from './tasks_assigned.entity';
import { UserRepository } from 'src/apis/users/entities/user.entity';

@Global()
@Entity('tasks')
export class TasksRepository {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'datetime' })
  estimatedCompletion: Date;

  @Column({ type: 'varchar', length: 250 })
  title: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  description: string | null;

  @OneToMany(() => TasksAssignedRepository, (tasks) => tasks.task, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  taskAssignedTo: TasksAssignedRepository[] | null;

  @ManyToOne(() => UserRepository, (user) => user.taskCreator, {
    onDelete: 'CASCADE',
  })
  taskAssignedBy: UserRepository | string;

  @Column({ type: 'tinyint', nullable: false, default: false })
  isCompleted: boolean | false;

  @Column({ type: 'datetime', nullable: true })
  completedOn: Date | null;
}
