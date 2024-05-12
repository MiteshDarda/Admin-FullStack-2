import { Global } from '@nestjs/common';
import { UserRepository } from 'src/apis/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TasksRepository } from './tasks.entity';
import { AssignableRoleEnum } from '../enum/AssignableRoleEnum';

@Global()
@Entity('tasks_assigned')
export class TasksAssignedRepository {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id: number;

  //* Assigned To Which User ? .
  @ManyToOne(() => UserRepository, (user) => user.taskAssigned, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  assignedTo: UserRepository | string;

  //* What is The Task ? .
  @ManyToOne(() => TasksRepository, (tasks) => tasks.taskAssignedTo, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  task: TasksRepository | number | null;

  //* Role Assigned for the current Task .
  @Column({ type: 'enum', enum: AssignableRoleEnum })
  assignedRole: string;

  //* Currency .
  @Column({ type: 'varchar', length: 50 })
  currency: string;

  //* Price .
  @Column({ type: 'integer' })
  price: number;

  //* Is The Task Completed ? .
  @Column({ type: 'tinyint', default: false })
  completed: boolean | false;

  //* Task Completed on Date .
  @Column({ type: 'datetime', nullable: true })
  completedOn: Date | null;

  //* Feedback .
  @Column({ type: 'varchar', length: 250, nullable: true })
  feedback: string;
}
