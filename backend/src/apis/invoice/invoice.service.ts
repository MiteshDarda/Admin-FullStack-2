import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../users/entities/user.entity';
import { TasksAssignedRepository } from '../tasks/entities/tasks_assigned.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: Repository<UserRepository>,
    @InjectRepository(TasksAssignedRepository)
    private readonly taskAssignedRepository: Repository<TasksAssignedRepository>,
  ) {}
}
