import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PayoutService } from './payout.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { AppService } from 'src/app.service';
import { Pagination } from 'src/common/dto/pagination.dto';
import { UserPayoutParamDto } from './dto/user-payout-param.dto';
import { UserPayoutBodyDto } from './dto/user-payout-body.dto';

@Controller('payout')
export class PayoutController {
  constructor(
    private readonly payoutService: PayoutService,
    private readonly helper: AppService,
  ) {}

  //* Get my Payout .
  @Get('me')
  @UseGuards(AuthGuard)
  myPayout(
    @Headers('authorization') authorizationHeader: string,
    @Query() query: Pagination,
  ) {
    const myEmail = this.helper.convertJWT(authorizationHeader);
    return this.payoutService.myPayout(myEmail, query.limit, query.page);
  }

  @Post(':email')
  @UseGuards(AuthGuard)
  userPayout(
    @Param() param: UserPayoutParamDto,
    @Body() body: UserPayoutBodyDto,
    @Query() query: Pagination,
  ) {
    console.log(query.limit);
    console.log(query.page);
    return this.payoutService.userPayout(
      param.email,
      body.taskIdOrTitle,
      body.year,
      body.month,
      query.page,
      query.limit,
    );
  }
}
