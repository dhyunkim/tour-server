import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourHolidayService } from './tour-holiday.service';
import { TourHolidayRepository } from './repository';
import { TourHolidayResolver } from './tour-holiday.resolver';
import { TourModule } from '../tour/tour.module';

@Module({
  imports: [TypeOrmModule.forFeature([TourHolidayRepository]), TourModule],
  providers: [TourHolidayService, TourHolidayResolver],
  exports: [TourHolidayService],
})
export class TourHolidayModule {}
