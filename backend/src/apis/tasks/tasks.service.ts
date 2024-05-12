import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateTasksDto } from './dto/create-tasks.dto';
import { DataSource, Repository } from 'typeorm';
import { TasksRepository } from './entities/tasks.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AddUserDto } from './dto/add-user.dto';
import { TasksAssignedRepository } from './entities/tasks_assigned.entity';
import { AppService } from 'src/app.service';
import { UserRepository } from '../users/entities/user.entity';
import { DesignationEnum } from '../users/enums/DesignationEnum';
import { CompleteUserTaskDto } from './dto/complete-user-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @Inject(AppService)
    private readonly helper: AppService,
    @InjectRepository(TasksRepository)
    private readonly tasksRepository: Repository<TasksRepository>,
    @InjectRepository(TasksAssignedRepository)
    private readonly tasksAssignedRepository: Repository<TasksAssignedRepository>,
    @InjectRepository(UserRepository)
    private readonly userRepository: Repository<UserRepository>,
    private dataSource: DataSource,
  ) {}

  //* Creates a Single Task .
  async create(createTaskDto: CreateTasksDto, myEmail: string) {
    try {
      const task = await this.tasksRepository
        .createQueryBuilder('tasks')
        .insert()
        .values({
          title: createTaskDto.title,
          description: createTaskDto.description,
          estimatedCompletion: createTaskDto.estimatedCompletion,
          taskAssignedBy: myEmail,
        })
        .execute();
      return {
        id: task.identifiers[0].id,
        message: 'Task Created Sucessfully',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //* Update a Single Task .
  async update(createTaskDto: CreateTasksDto, myEmail: string, taskId: number) {
    try {
      const task = await this.getTaskHELPER(taskId);

      if (!task) throw new HttpException('Give a Valid Task', 400);

      const newTask = await this.tasksRepository
        .createQueryBuilder('tasks')
        .update({
          title: createTaskDto.title,
          description: createTaskDto.description,
          estimatedCompletion: createTaskDto.estimatedCompletion,
          taskAssignedBy: myEmail,
        })
        .where('tasks.id = :taskId', { taskId })
        .execute();
      return {
        rowsAffected: newTask.affected,
        message: 'Task Updated Sucessfully',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //* Delete a Single Task .
  async delete(myEmail: string, taskId: number) {
    const myDesignation = await this.helper.getDesignation(myEmail);

    if (
      !(
        myDesignation === DesignationEnum.SUPER_ADMIN ||
        myDesignation === DesignationEnum.ADMIN ||
        myDesignation === DesignationEnum.MANAGER
      )
    )
      throw new HttpException('Not Allowded', 400);

    try {
      const task = await this.getTaskHELPER(taskId);

      if (!task) throw new HttpException('Give a Valid Task', 400);

      await this.tasksRepository
        .createQueryBuilder('tasks')
        .update({ deleted: true })
        .where('tasks.id = :taskId', { taskId })
        .execute();
      return {
        message: 'deleted',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //* Get List Of Tasks .
  async getTasks(myEmail: string, limit: number, page: number) {
    const offset = (page - 1) * limit;
    myEmail;
    try {
      const tasks = await this.tasksRepository
        .createQueryBuilder('tasks')
        .select()
        .where('tasks.deleted = false')
        .leftJoinAndSelect('tasks.taskAssignedBy', 'taskAssignedBy')
        .leftJoinAndSelect('tasks.taskAssignedTo', 'taskAssignedTo')
        .skip(offset)
        .take(limit)
        .getManyAndCount();

      const result = {
        tasks: tasks[0].map((task) => {
          const converted = { ...Object(task) };
          delete converted.taskAssignedBy;
          delete converted.taskAssignedTo;
          const taskAssignedBy = Object(task.taskAssignedBy).email;
          return {
            ...converted,
            taskAssignedBy,
            userCount: task.taskAssignedTo.length,
          };
        }),
        count: tasks[1],
      };

      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //* Make a Task Complete Fully .
  async completeTask(myEmail: string, taskId: number) {
    const myDesignation = await this.helper.getDesignation(myEmail);

    if (
      !(
        myDesignation === DesignationEnum.ADMIN ||
        myDesignation === DesignationEnum.QA
      )
    )
      new HttpException('Ask QA or Admin for this action', 400);
    try {
      const task = await this.getTaskHELPER(taskId);
      if (!task) throw new HttpException('Error Finding This Task', 400);
      if (task.isCompleted)
        throw new HttpException('Task Already Completed', 400);
      const updated = await this.tasksRepository
        .createQueryBuilder('tasks')
        .update({ isCompleted: true, completedOn: new Date() })
        .where('tasks.id = :taskId', { taskId })
        .execute();
      if (updated) return { message: 'Task is completed 👍🏻' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //* Search a Task by title .
  async searchTask(title: string, limit: number, page: number) {
    const offset = (page - 1) * limit;
    const tasks = await this.tasksRepository
      .createQueryBuilder('tasks')
      .where('tasks.title LIKE :title', { title: `%${title}%` })
      .orWhere('tasks.id LIKE :title')
      .skip(offset)
      .take(limit)
      .getManyAndCount();
    return {
      tasks: tasks[0],
      count: tasks[1],
    };
  }

  //* Get a Detailed Task and all the users .
  async getTaskDetail(taskId: number) {
    try {
      const task = await this.getTaskHELPER(taskId);
      if (!task) throw new HttpException('Give a Valid Task', 400);

      const tasksAssigned = await this.tasksAssignedRepository
        .createQueryBuilder('tasks_assigned')
        .select()
        .where('tasks_assigned.task = :taskId', { taskId })
        .leftJoinAndSelect('tasks_assigned.assignedTo', 'assignedTo')
        .getManyAndCount();
      return {
        task: task,
        usersAssigned: tasksAssigned[0].map((data) => {
          const converted = { ...Object(data) };
          delete converted.assignedTo;
          return {
            ...Object(converted),
            assignedToEmail: Object(data.assignedTo).email,
            assignedToUserName: Object(data.assignedTo).name,
            assignedToUserDesignation: Object(data.assignedTo).designation,
          };
        }),
        count: tasksAssigned[1],
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //* Add User in a Task .
  async addUser(addUserDto: AddUserDto, taskId: any) {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email: addUserDto.assignedTo })
        .getOne();

      const task = await this.getTaskHELPER(taskId);

      if (!task) throw new HttpException('Give a Valid Task', 400);
      if (!user) throw new HttpException('Give a Valid User', 400);

      const taskToUser = await this.tasksAssignedRepository
        .createQueryBuilder('tasks_assigned')
        .insert()
        .values({
          currency: addUserDto.currency,
          price: addUserDto.price,
          assignedRole: addUserDto.assignedRole,
          assignedTo: addUserDto.assignedTo,
          task: taskId,
        })
        .execute();
      await this.helper.sendEmail(
        addUserDto.assignedTo,
        'New Task',
        `
      <b>${'New Task has been assigned to you'}</b>
      <br></br>
      <b>${addUserDto.assignedRole}</b>
      <br></br>
      <b>Price : ${addUserDto.currency} ${addUserDto.price}</b>
      <div>Note: Money is only applicable to non-salaried employees</div>
    `,
      );
      return {
        id: taskToUser.identifiers[0].id,
        message: 'User Added Sucessfully',
      };
    } catch (error) {
      console.log(error);
      if (error?.code === 'EENVELOPE' && error?.command === 'API') {
        throw new HttpException(
          'Invalid Email',
          HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        );
      }
      throw error;
    }
  }

  //* Delete User in a Task .
  async deleteUser(myEmail: string, userId: number) {
    const myDesignation = await this.helper.getDesignation(myEmail);
    if (
      !(
        myDesignation === DesignationEnum.SUPER_ADMIN ||
        myDesignation === DesignationEnum.ADMIN ||
        myDesignation === DesignationEnum.MANAGER
      )
    )
      throw new HttpException('Not Allowded', 400);
    try {
      const user = await this.taskAssignedToUserHELPER(userId);

      if (!user) throw new HttpException('Give a Valid User', 400);

      await this.tasksAssignedRepository
        .createQueryBuilder('tasksAssigned')
        .delete()
        .whereInIds([userId])
        .execute();
      return {
        message: 'deleted',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //* Complete Task Of a User
  async completeUserTask(
    myEmail: string,
    userId: number,
    completeUserTaskDto: CompleteUserTaskDto,
  ) {
    const myDesignation = await this.helper.getDesignation(myEmail);
    const totalStars =
      completeUserTaskDto.communication +
      completeUserTaskDto.delivery +
      completeUserTaskDto.quality;
    if (
      !(
        myDesignation === DesignationEnum.SUPER_ADMIN ||
        myDesignation === DesignationEnum.ADMIN ||
        myDesignation === DesignationEnum.QA
      )
    )
      throw new HttpException('Not Allowded', 400);

    try {
      const user = await this.taskAssignedToUserHELPER(userId);
      if (user.completed)
        throw new HttpException('Task Alreaddy Compleated', 400);
      if (!user) throw new HttpException('Give a Valid User', 400);
      const userEmail = Object(user.assignedTo).email;
      await this.tasksAssignedRepository
        .createQueryBuilder('tasks_assigned')
        .update({
          completedOn: new Date(),
          completed: true,
          feedback: completeUserTaskDto.feedback,
        })
        .where('tasks_assigned.id = :userId', { userId })
        .execute();
      await this.userRepository
        .createQueryBuilder('user')
        .update()
        .set({
          communicationStarsReceived: () =>
            ` + ${completeUserTaskDto.communication}`,
          communicationTotalStars: () => ` + 5`,

          deliveryStarsReceived: () => ` + ${completeUserTaskDto.delivery}`,
          deliveryTotalStars: () => ` + 5`,

          qualityStarsReceived: () => ` + ${completeUserTaskDto.quality}`,
          qualityTotalStars: () => ` + 5`,

          overallStarsReceived: () => ` + ${totalStars}`,
          overallTotalStars: () => ` + 15`,
        })
        .where('user.email = :userEmail', { userEmail })
        .execute();
      return {
        message: 'done',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //* ---------------------------- Task Duplicate ----------------------------
  async duplicateTask(
    myEmail: string,
    numberOfDuplicates: number,
    taskId: number,
  ) {
    const myDesignation = await this.helper.getDesignation(myEmail);
    myDesignation;
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      const task = await this.getTaskHELPER(taskId);
      if (!task) throw new HttpException('Give a Valid Task', 400);

      const tasksAssigned = await this.tasksAssignedRepository
        .createQueryBuilder('tasks_assigned')
        .select()
        .where('tasks_assigned.task = :taskId', { taskId })
        .leftJoinAndSelect('tasks_assigned.assignedTo', 'assignedTo')
        .getManyAndCount();

      task.id = null;
      task.isCompleted = null;
      task.completedOn = null;
      delete task.id;
      delete task.isCompleted;
      delete task.completedOn;
      task.title = '(Duplicate)' + task.title;
      const newTasks = [];
      const newUsersTasks = [];
      await queryRunner.startTransaction();
      for (let i = 0; i < numberOfDuplicates; ++i) {
        const newTask = new TasksRepository();
        Object.assign(newTask, task);
        const user = await queryRunner.manager.findOneBy(UserRepository, {
          email: myEmail,
        });
        newTask.taskAssignedBy = user;
        newTasks.push(newTask);
      }
      const addedTasks = await queryRunner.manager.insert(
        TasksRepository,
        newTasks,
      );

      addedTasks?.identifiers?.filter((idf) => {
        const taskId = idf?.id;
        if (!taskId) return;
        tasksAssigned[0].filter((usr) => {
          const newUserTask = new TasksAssignedRepository();
          usr.id = null;
          usr.completed = null;
          usr.completedOn = null;
          delete usr?.id;
          delete usr?.completed;
          delete usr?.completedOn;
          Object.assign(newUserTask, usr);
          newUserTask.task = taskId;
          newUsersTasks.push(newUserTask);
        });
      });

      await queryRunner.manager.insert(TasksAssignedRepository, newUsersTasks);
      await queryRunner.commitTransaction();
      return {
        message: 'done',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  //$ Helper Function : Get Task .
  async getTaskHELPER(taskId: number) {
    return await this.tasksRepository
      .createQueryBuilder('task')
      .where('task.id = :taskId', { taskId })
      .getOne();
  }

  //$ Helper Function : Get User Of a Task .
  async taskAssignedToUserHELPER(userId: number) {
    return await this.tasksAssignedRepository
      .createQueryBuilder('tasks_assigned')
      .where('tasks_assigned.id = :userId', { userId })
      .leftJoinAndSelect('tasks_assigned.assignedTo', 'assignedTo')
      .getOne();
  }
}
