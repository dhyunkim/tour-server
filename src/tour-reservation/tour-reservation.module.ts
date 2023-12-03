import { Module } from '@nestjs/common';
import { TourReservationResolver } from './tour-reservation.resolver';
import { TourReservationService } from './tour-reservation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourReservationRepository } from './repository/tour-reservation.repository';
import { TourHolidayModule } from '../tour-holiday/tour-holiday.module';
import { TourModule } from '../tour/tour.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TourReservationRepository]),
    TourHolidayModule,
    TourModule,
  ],
  providers: [TourReservationResolver, TourReservationService],
})
export class TourReservationModule {}
