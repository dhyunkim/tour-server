import { Module } from '@nestjs/common';
import { TourService } from './tour.service';

@Module({
  providers: [TourService],
})
export class TourModule {}
