import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourHolidayService } from './tour-holiday.service';
import { TourHolidayRepository } from './repository';
import { TourHolidayResolver } from './tour-holiday.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([TourHolidayRepository])],
  providers: [TourHolidayService, TourHolidayResolver],
  exports: [TourHolidayService],
})
export class TourHolidayModule {}
