import { Injectable } from '@nestjs/common';
import { UserRepository } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LeadershipService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: Repository<UserRepository>,
  ) {}

  //* Get all the Ranks .
  async getRanks(limit: number, page: number) {
    const offset = (page - 1) * limit;
    try {
      const results = await this.userRepository
        .createQueryBuilder('user')
        .select(
          'SUM(user.overallStarsReceived) / SUM(user.overallTotalStars)',
          'average',
        )
        .addSelect([
          'user.email',
          'user.overallStarsReceived',
          'user.overallTotalStars',
          'user.name',
          'user.designation',
        ])
        .groupBy('user.email')
        .orderBy('average', 'DESC')
        .where('user.designation != "super_admin"')
        .andWhere('user.designation != "admin"')
        .skip(offset)
        .take(limit)
        .getRawMany();

      const count = await this.userRepository
        .createQueryBuilder('user')
        .select(
          'SUM(user.overallStarsReceived) / SUM(user.overallTotalStars)',
          'average',
        )
        .addSelect([
          'user.email',
          'user.overallStarsReceived',
          'user.overallTotalStars',
          'user.name',
          'user.designation',
        ])
        .groupBy('user.email')
        .orderBy('average', 'DESC')
        .where('user.designation != "super_admin"')
        .andWhere('user.designation != "admin"')
        .getCount();

      return {
        leadership: results,
        count,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
