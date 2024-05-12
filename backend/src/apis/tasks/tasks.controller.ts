import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { AppService } from 'src/app.service';
import { CreateTasksDto } from './dto/create-tasks.dto';
import { AddUserDto } from './dto/add-user.dto';
import { Pagination } from 'src/common/dto/pagination.dto';
import { SearchTaskDto } from './dto/search-task.dto';
import { TaskIdDto } from './dto/task-id.dto';
import { UserIdDto } from './dto/user-id.dto';
import { CompleteUserTaskDto } from './dto/complete-user-task.dto';
import { TaskDuplicationDto } from './dto/task-duplication.dto';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly appService: AppService,
  ) {}

  //* 1. This Creates a Task .
  @Post()
  @UseGuards(AuthGuard)
  create(
    @Headers('authorization') authorizationHeader: string,
    @Body() createTaskDto: CreateTasksDto,
  ) {
    const myEmail = this.appService.convertJWT(authorizationHeader);
    return this.tasksService.create(createTaskDto, myEmail);
  }

  //* 2. Get all the tasks for the user .
  @Get()
  @UseGuards(AuthGuard)
  getTasks(
    @Headers('authorization') authorizationHeader: string,
    @Query() query: Pagination,
  ) {
    const myEmail = this.appService.convertJWT(authorizationHeader);
    return this.tasksService.getTasks(myEmail, query.limit, query.page);
  }

  //* 3. Search for a task .
  @Get('search')
  @UseGuards(AuthGuard)
  searchTask(@Query() searchTaskDto: SearchTaskDto) {
    return this.tasksService.searchTask(
      searchTaskDto.title,
      searchTaskDto.limit,
      searchTaskDto.page,
    );
  }

  //* 4. This Deletes a User in Task .
  @Delete('user/:userId')
  @UseGuards(AuthGuard)
  deleteUser(
    @Headers('authorization') authorizationHeader: string,
    @Param() param: UserIdDto,
  ) {
    const myEmail = this.appService.convertJWT(authorizationHeader);
    return this.tasksService.deleteUser(myEmail, param.userId);
  }

  //* 5. Complete a UserTask .
  @Put('user/:userId/complete')
  @UseGuards(AuthGuard)
  completeUserTask(
    @Headers('authorization') authorizationHeader: string,
    @Param() param: UserIdDto,
    @Body() completeUserTaskDto: CompleteUserTaskDto,
  ) {
    const myEmail = this.appService.convertJWT(authorizationHeader);
    return this.tasksService.completeUserTask(
      myEmail,
      param.userId,
      completeUserTaskDto,
    );
  }

  //* 6. Complete a task .
  @Put(':taskId/complete')
  @UseGuards(AuthGuard)
  completeTask(
    @Param() param: TaskIdDto,
    @Headers('authorization') authorizationHeader: string,
  ) {
    const myEmail = this.appService.convertJWT(authorizationHeader);
    return this.tasksService.completeTask(myEmail, param.taskId);
  }

  //* 7. This Addes a User in Task .
  @Post(':taskId/user')
  @UseGuards(AuthGuard)
  addUser(
    @Param() param: TaskIdDto,
    @Headers('authorization') authorizationHeader: string,
    @Body() addUserDto: AddUserDto,
  ) {
    // const myEmail = this.appService.convertJWT(authorizationHeader);
    return this.tasksService.addUser(addUserDto, param.taskId);
  }

  //* 8. Show a Single Detailed Task with users .
  @Get(':taskId')
  @UseGuards(AuthGuard)
  getTaskDetail(@Param() param: TaskIdDto) {
    return this.tasksService.getTaskDetail(param.taskId);
  }

  //* 9. This Updates a Task .
  @Patch(':taskId')
  @UseGuards(AuthGuard)
  update(
    @Headers('authorization') authorizationHeader: string,
    @Body() createTaskDto: CreateTasksDto,
    @Param() param: TaskIdDto,
  ) {
    const myEmail = this.appService.convertJWT(authorizationHeader);
    return this.tasksService.update(createTaskDto, myEmail, param.taskId);
  }

  //* 10. This Deletes a Task.
  @Delete(':taskId')
  @UseGuards(AuthGuard)
  delete(
    @Headers('authorization') authorizationHeader: string,
    @Param() param: TaskIdDto,
  ) {
    const myEmail = this.appService.convertJWT(authorizationHeader);
    return this.tasksService.delete(myEmail, param.taskId);
  }

  //* ---------------------------- Task Duplicate ----------------------------
  @Post('duplicate/:taskId')
  @UseGuards(AuthGuard)
  duplicateTask(
    @Headers('authorization') authorizationHeader: string,
    @Body() taskDuplicationDto: TaskDuplicationDto,
    @Param() param: TaskIdDto,
  ) {
    const myEmail = this.appService.convertJWT(authorizationHeader);
    return this.tasksService.duplicateTask(
      myEmail,
      taskDuplicationDto.numberOfDuplicates,
      param.taskId,
    );
  }
}
