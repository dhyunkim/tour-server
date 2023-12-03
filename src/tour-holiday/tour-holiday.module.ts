import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourHolidayService } from './tour-holiday.service';
import { TourHolidayRepository } from './repository';

@Module({
  imports: [TypeOrmModule.forFeature([TourHolidayRepository])],
  providers: [TourHolidayService],
  exports: [TourHolidayService],
})
export class TourHolidayModule {}
