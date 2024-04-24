import {
  CanActivate,
  ExecutionContext,
  Global,
  HttpException,
  Injectable,
  Logger,
  Scope,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/apis/users/entities/user.entity';
import { EntityManager, Repository } from 'typeorm';

@Global()
@Injectable({ scope: Scope.REQUEST })
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserRepository)
    private readonly userRepository: Repository<UserRepository>,
    private readonly entityManager: EntityManager,
  ) {}

  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const authToken = request.headers['authorization'];
      // STEP 1: Check If Request has Auth
      if (!authToken) throw new HttpException('Expire', 401);
      const token = authToken.split(' ')[1];
      const decodedToken = this.jwtService.decode(token);

      // STEP 2: Check Expiration Time
      const expirationTime = decodedToken.exp;
      const currentTime = Math.floor(Date.now() / 1000);
      if (!expirationTime || currentTime > expirationTime)
        throw new HttpException('Expire', 401);

      // STEP 3: Check if email exists
      const email = this.jwtService?.decode(token)?.email;
      const exists = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .getOne();
      if (!exists) throw new HttpException('Expire', 401);
      return true;
    } catch (error) {
      console.log(error);
      throw new HttpException('Expire', 401);
    }
  }

  daysLeft(expirationTime: number, currentTime: number) {
    const seconds = expirationTime - currentTime;
    const secondsInDay = 86400;
    const days = seconds / secondsInDay;
    return days;
  }
}
