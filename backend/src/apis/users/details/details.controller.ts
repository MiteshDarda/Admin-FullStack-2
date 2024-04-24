import {
  Controller,
  Body,
  Patch,
  UseGuards,
  Headers,
  Get,
} from '@nestjs/common';
import { DetailsService } from './details.service';
import { UpdateDetailDto } from './dto/update-detail.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { AppService } from 'src/app.service';

@Controller('users/details')
export class DetailsController {
  constructor(
    private readonly detailsService: DetailsService,
    private readonly appService: AppService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async getDetails(@Headers('authorization') authorizationHeader: string) {
    const email = this.appService.convertJWT(authorizationHeader);
    return this.detailsService.getDetails(email);
  }

  @Patch()
  @UseGuards(AuthGuard)
  updateDetails(
    @Body() updateDetailDto: UpdateDetailDto,
    @Headers('authorization') authorizationHeader: string,
  ) {
    const email = this.appService.convertJWT(authorizationHeader);
    return this.detailsService.updateDetails(updateDetailDto, email);
  }
}
