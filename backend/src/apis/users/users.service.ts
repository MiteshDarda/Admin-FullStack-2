import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  Scope,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './entities/user.entity';
import {
  Brackets,
  EntityManager,
  Repository,
  WhereExpressionBuilder,
} from 'typeorm';
import { LogInDto } from './dto/log-in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChangePassDto } from './dto/change-pass-dto';
import { AppService } from 'src/app.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable({ scope: Scope.REQUEST })
export class UsersService {
  private logger = new Logger('User Service');
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: Repository<UserRepository>,
    private readonly entityManager: EntityManager,
    @Inject(AppService)
    private readonly helper: AppService,
    private readonly mailerService: MailerService,
  ) {}

  //* Get Users according to Designation .
  async getUsers(myEmail: string, limit: number, page: number) {
    const myDesignation = await this.helper.getDesignation(myEmail);
    try {
      const users = await this.getUsersFromDB(
        myEmail,
        myDesignation,
        limit,
        page,
      );
      return {
        people: users?.[0] ?? [],
        totalCount: users?.[1] ?? 0,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('Error Getting All Users ', 400);
    }
  }

  //* Create Users .
  async create(createUserDto: CreateUserDto, myEmail: string) {
    try {
      const myDesignation = await this.helper.getDesignation(myEmail);
      myDesignation;
      const emailExists = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email: createUserDto.email })
        .getOne();

      if (emailExists)
        throw new HttpException('Email Already Exists, Try Another Email', 400);

      const token = this.helper.jwtTokenSignForSession(
        createUserDto.email,
        createUserDto.designation,
        '7D',
      );
      const newUser = new UserRepository();
      for (const dto in createUserDto) {
        newUser[dto] = createUserDto[dto];
      }
      newUser.isVerified =
        createUserDto.designation === 'admin' ||
        createUserDto.designation === 'super_admin';
      newUser.bearer = token;
      await this.entityManager.save(newUser);
      await this.helper.sendEmail(
        createUserDto.email,
        'Credentials',
        `
        <b>Email : ${createUserDto.email}</b>
        </br>
        <b>Password : ${createUserDto.password}</b>
        </br>
        <b>Designation : ${createUserDto.designation}</b>
        `,
      );
      return 'New User Created';
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

  //* Login Api .
  async login(user: LogInDto) {
    try {
      // check if user exists
      const emailExists = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email: user.email })
        .getOne();

      if (emailExists && emailExists.password !== user.password) {
        throw new HttpException('Password Is Wrong', 400);
      } else if (emailExists) {
        // if user exists save jwt to DB and send it to frontend
        const newJWT = this.helper.jwtTokenSignForSession(
          user.email,
          emailExists.designation,
          '7D',
        );

        await this.userRepository
          .createQueryBuilder('user')
          .update<UserRepository>(UserRepository, { bearer: newJWT })
          .where('user.email = :email', {
            email: user.email,
          })
          .execute();

        return { token: newJWT };
      } else {
        throw new HttpException('User Does Not Exists', 400);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //* Change Password .
  async changePass(changePassDto: ChangePassDto, myEmail: string) {
    try {
      if (changePassDto.old === changePassDto.new)
        throw new HttpException('Old And New Password Cannot Be Same', 400);

      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :myEmail', { myEmail })
        .getOne();

      if (changePassDto.old !== user.password)
        throw new HttpException('Incorrect Old Password', 400);

      await this.userRepository
        .createQueryBuilder('user')
        .update(UserRepository)
        .set({ password: changePassDto.new })
        .where('user.email = :myEmail', { myEmail })
        .execute();
      return { message: 'Changed' };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  //* Get Information about Myself .
  async me(myEmail: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.isVerified', 'user.name'])
      .where('user.email = :myEmail', { myEmail })
      .getOne();

    return user;
  }

  //* Search User .
  async search(myEmail: string, limit: number, page: number, searchBy: string) {
    const myDesignation = await this.helper.getDesignation(myEmail);
    try {
      const users = await this.getUsersFromDB(
        myEmail,
        myDesignation,
        limit,
        page,
        true,
        searchBy,
      );
      return {
        people: users?.[0] ?? [],
        totalCount: users?.[1] ?? 0,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('Error Getting All Users ', 400);
    }
  }

  //* Delete User .
  async delete(myEmail: string, userEmail: string) {
    const myDesignation = await this.helper.getDesignation(myEmail);
    const designationsAllowedToDelete =
      this.helper.getDesignationAllowdedToDelete(myDesignation);
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email: userEmail })
        .andWhere('user.designation IN (:...designations)', {
          designations: designationsAllowedToDelete,
        })
        .getRawOne();
      if (!user) throw new HttpException('Permision Not Granted', 400);
      console.log(user);
      const deleted = await this.userRepository
        .createQueryBuilder('user')
        .delete()
        .where('user.email = :email', { email: userEmail })
        .execute();
      if (deleted) return { message: 'deleted' };
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  //$ Helper Function, For Getting User From DB .
  async getUsersFromDB(
    myEmail: string,
    myDesignation: string,
    limit: number,
    page: number,
    search: boolean = false,
    searchBy?: string,
  ) {
    const offset = (page - 1) * limit;
    const designationsAllowedToView =
      this.helper.getDesignationAllowdedToView(myDesignation);
    const users = await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.name',
        'user.email',
        'user.designation',
        'user.address',
        'user.bankName',
        'user.accountNumber',
        'user.ifsc',
        'user.panNum',
        'user.isVerified',
        'user.createdAt',
      ])
      .where('user.email != :myEmail', { myEmail })
      .andWhere('user.designation IN (:...designations)', {
        designations: designationsAllowedToView,
      })
      .skip(offset)
      .take(limit);

    if (search)
      users.andWhere(
        new Brackets((qb: WhereExpressionBuilder) =>
          qb
            .where('user.name LIKE :searchBy', { searchBy: `%${searchBy}%` })
            .orWhere('user.email LIKE :searchBy')
            .orWhere('user.designation LIKE :searchBy'),
        ),
      );

    return users.getManyAndCount();
  }
}
