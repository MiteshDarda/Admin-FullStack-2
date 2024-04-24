import { MessageRepository } from 'src/apis/messages/entities/message.entity';
import { TasksRepository } from 'src/apis/tasks/entities/tasks.entity';
import { TasksAssignedRepository } from 'src/apis/tasks/entities/tasks_assigned.entity';
import { UserRepository } from 'src/apis/users/entities/user.entity';

export const allEntities = [
  UserRepository,
  MessageRepository,
  TasksRepository,
  TasksAssignedRepository,
];
