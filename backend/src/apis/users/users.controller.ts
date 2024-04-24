import {
  Controller,
  Post,
  Body,
  Patch,
  UseGuards,
  Headers,
  Get,
  Query,
  Delete,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LogInDto } from './dto/log-in.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { AppService } from 'src/app.service';
import { ChangePassDto } from './dto/change-pass-dto';
import { Pagination } from 'src/common/dto/pagination.dto';
import { SearchUsersDto } from './dto/search-users-dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly appService: AppService,
  ) {}

  //* 1.Get all users.
  @Get('all')
  @UseGuards(AuthGuard)
  getUsers(
    @Headers('authorization') authorizationHeader: string,
    @Query() query: Pagination,
  ) {
    const email = this.appService.convertJWT(authorizationHeader);
    return this.usersService.getUsers(email, query.limit, query.page);
  }

  //* 2.Search User .
  @Get('search')
  @UseGuards(AuthGuard)
  async search(
    @Headers('authorization') authorizationHeader: string,
    @Query() query: SearchUsersDto,
  ) {
    const email = this.appService.convertJWT(authorizationHeader);
    return this.usersService.search(
      email,
      query.limit,
      query.page,
      query.searchBy,
    );
  }

  //* 3.Create Users .
  @Post('create')
  @UseGuards(AuthGuard)
  create(
    @Body() createUserDto: CreateUserDto,
    @Headers('authorization') authorizationHeader: string,
  ) {
    const myEmail = this.appService.convertJWT(authorizationHeader);
    return this.usersService.create(createUserDto, myEmail);
  }

  //* 4.Login Api .
  @Post('login')
  login(@Body() logInDto: LogInDto) {
    return this.usersService.login(logInDto);
  }

  //* 5.Change Password .
  @Patch('password')
  @UseGuards(AuthGuard)
  changePass(
    @Body() changePassDto: ChangePassDto,
    @Headers('authorization') authorizationHeader: string,
  ) {
    const myEmail = this.appService.convertJWT(authorizationHeader);
    return this.usersService.changePass(changePassDto, myEmail);
  }

  //* 6.Get Information about Myself .
  @Get('me')
  @UseGuards(AuthGuard)
  isVerified(@Headers('authorization') authorizationHeader: string) {
    const myEmail = this.appService.convertJWT(authorizationHeader);
    return this.usersService.me(myEmail);
  }

  //* 7.Delete User .
  @Delete(':user')
  @UseGuards(AuthGuard)
  delete(
    @Param() params: DeleteUserDto,
    @Headers('authorization') authorizationHeader: string,
  ) {
    const myEmail = this.appService.convertJWT(authorizationHeader);
    console.log(params, myEmail);
    return this.usersService.delete(myEmail, params.user);
  }
}
