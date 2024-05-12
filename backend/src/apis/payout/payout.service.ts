import { HttpException, Injectable } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksAssignedRepository } from '../tasks/entities/tasks_assigned.entity';
import { TasksRepository } from '../tasks/entities/tasks.entity';
import { UserRepository } from '../users/entities/user.entity';

@Injectable()
export class PayoutService {
  constructor(
    // @Inject(AppService)
    // private readonly helper: AppService,
    @InjectRepository(TasksRepository)
    private readonly tasksRepository: Repository<TasksRepository>,
    @InjectRepository(TasksAssignedRepository)
    private readonly tasksAssignedRepository: Repository<TasksAssignedRepository>,
    @InjectRepository(UserRepository)
    private readonly userRepository: Repository<UserRepository>,
  ) {}

  //* Get my Payout .
  async myPayout(myEmail: string, limit: number, page: number) {
    myEmail = 'qa';
    const offset = (page - 1) * limit;
    const tasksAssigned = await this.tasksAssignedRepository
      .createQueryBuilder('tasks_assigned')
      .where('tasks_assigned.assignedTo = :myEmail', { myEmail })
      .andWhere('tasks_assigned.completed = :completed', { completed: true })
      .orderBy('tasks_assigned.completedOn', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();
    return {
      payout: tasksAssigned[0],
      count: tasksAssigned[1],
    };
  }

  //* Get Payout of a User .
  async userPayout(
    email: string,
    taskIdOrTitle?: string,
    page?: number,
    limit?: number,
    fromDate?: Date,
    toDate?: Date,
  ) {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .getOne();
      if (!user) throw new HttpException('Invalid Email', 400);

      const datas = await this.userPayoutGetDataFromToDate(
        taskIdOrTitle,
        email,
        page,
        limit,
        fromDate,
        toDate,
      );

      const orderedData = this.userPayoutGetOrderedData(datas);
      return orderedData;
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }

  //$ Helper Function : User Payout = Filters the data .
  userPayoutGetOrderedData(datas: any[]): any[] {
    return datas.map((data) => {
      const obj = {};
      for (const key in data) {
        const splitedKey = key.split('_');
        if (
          splitedKey[1] === 'password' ||
          splitedKey[1] === 'bearer' ||
          splitedKey[1] === 'isVerified' ||
          splitedKey[1] === 'createdAt' ||
          splitedKey[1] === 'deliveryStarsReceived' ||
          splitedKey[1] === 'deliveryTotalStars' ||
          splitedKey[1] === 'qualityStarsReceived' ||
          splitedKey[1] === 'qualityTotalStars' ||
          splitedKey[1] === 'communicationStarsReceived' ||
          splitedKey[1] === 'communicationTotalStars' ||
          splitedKey[1] === 'overallStarsReceived' ||
          splitedKey[1] === 'overallTotalStars'
        )
          continue;
        if (!obj[splitedKey[0]]) {
          obj[splitedKey[0]] = {};
        }
        obj[splitedKey[0]][splitedKey[1]] = data[key];
      }
      return obj;
    });
  }

  //$ Helper Function : User Payout = Runs the query .
  async userPayoutGetData(
    taskIdOrTitle: string,
    email: string,
    month: number,
    year: number,
    page: number,
    limit: number,
  ): Promise<any[]> {
    const offset = (page - 1) * limit;
    return await this.tasksRepository
      .createQueryBuilder('tasks')
      .select()
      .addSelect('userTask')
      .addSelect('user')
      .where(
        new Brackets((qb) => {
          if (taskIdOrTitle) {
            return qb
              .where('tasks.id LIKE :taskIdOrTitle', {
                taskIdOrTitle: `%${taskIdOrTitle}%`,
              })
              .orWhere('tasks.title LIKE :taskIdOrTitle');
          } else return qb;
        }),
      )
      .andWhere('userTask.assignedTo = :email', { email })
      .andWhere('userTask.completed = true')
      .andWhere(
        new Brackets((qb) => {
          if (year)
            return qb.where('YEAR(userTask.completedOn) = :year', {
              year,
            });
          else {
            return qb;
          }
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          if (month)
            qb.where('MONTH(userTask.completedOn) = :month', {
              month,
            });
          else {
            return qb;
          }
        }),
      )
      .skip(offset)
      .take(limit)
      .leftJoin(TasksAssignedRepository, 'userTask', 'userTask.task = tasks.id')
      .leftJoin(UserRepository, 'user', 'userTask.assignedTo = user.email')
      .getRawMany();
  }

  async userPayoutGetDataFromToDate(
    taskIdOrTitle: string,
    email: string,
    page: number,
    limit: number,
    fromDate: Date,
    toDate: Date,
  ) {
    const offset = (page - 1) * limit;
    return await this.tasksRepository
      .createQueryBuilder('tasks')
      .select()
      .addSelect('userTask')
      .addSelect('user')
      .where(
        new Brackets((qb) => {
          if (taskIdOrTitle) {
            return qb
              .where('tasks.id LIKE :taskIdOrTitle', {
                taskIdOrTitle: `%${taskIdOrTitle}%`,
              })
              .orWhere('tasks.title LIKE :taskIdOrTitle');
          } else return qb;
        }),
      )
      .andWhere('userTask.assignedTo = :email', { email })
      .andWhere('userTask.completed = true')
      .andWhere(
        new Brackets((qb) => {
          if (fromDate && toDate)
            return qb.where(
              'userTask.completedOn BETWEEN :fromDate AND :toDate',
              {
                fromDate,
                toDate,
              },
            );
          else {
            return qb;
          }
        }),
      )
      .skip(offset)
      .take(limit)
      .leftJoin(TasksAssignedRepository, 'userTask', 'userTask.task = tasks.id')
      .leftJoin(UserRepository, 'user', 'userTask.assignedTo = user.email')
      .getRawMany();
  }
}
