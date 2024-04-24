import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LeadershipService } from './leadership.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { Pagination } from 'src/common/dto/pagination.dto';

@Controller('leadership')
export class LeadershipController {
  constructor(private readonly leadershipService: LeadershipService) {}

  //* Get all the Ranks .
  @Get()
  @UseGuards(AuthGuard)
  getRanks(@Query() query: Pagination) {
    return this.leadershipService.getRanks(query.limit, query.page);
  }
}
