import { HttpException, Inject, Injectable } from '@nestjs/common';
import { UpdateDetailDto } from './dto/update-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../entities/user.entity';
import { AppService } from 'src/app.service';
import { Repository } from 'typeorm';

@Injectable()
export class DetailsService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: Repository<UserRepository>,
    @Inject(AppService)
    private readonly helper: AppService,
  ) {}

  async getDetails(email: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.address',
        'user.mobile',
        'user.nameOnPassbook',
        'user.bankName',
        'user.accountNumber',
        'user.ifsc',
        'user.panNum',
      ])
      .where('user.email = :email', { email: email })
      .getOne();
    if (!user) return {};
    return user;
  }

  async updateDetails(updateDetailDto: UpdateDetailDto, email: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: email })
      .getOne();
    if (!user) throw new HttpException("User Dosen't Exists", 401);
    const token = this.helper.jwtTokenSignForSession(
      email,
      user.designation,
      '7D',
    );
    try {
      this.userRepository
        .createQueryBuilder('user2')
        .update(UserRepository)
        .set({
          address: updateDetailDto.address,
          mobile: updateDetailDto.mobile,
          nameOnPassbook: updateDetailDto.nameOnPassbook,
          bankName: updateDetailDto.bankName,
          accountNumber: updateDetailDto.accountNumber,
          ifsc: updateDetailDto.ifsc,
          panNum: updateDetailDto.panNum,
          isVerified: true,
          bearer: token,
        })
        .where('user.email = :email', { email: email })
        .execute();
      return {
        message: 'OK',
      };
    } catch (error) {
      throw new HttpException('Something Went Wront!!', 404);
    }
  }
}
