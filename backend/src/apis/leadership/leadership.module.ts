import { Module } from '@nestjs/common';
import { LeadershipService } from './leadership.service';
import { LeadershipController } from './leadership.controller';

@Module({
  controllers: [LeadershipController],
  providers: [LeadershipService],
})
export class LeadershipModule {}
