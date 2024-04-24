import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DetailsModule } from './details/details.module';

@Module({
  imports: [DetailsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
