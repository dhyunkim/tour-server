import { Injectable } from '@nestjs/common';
import {
  TourHolidayRepository,
  TourRepository,
  TourReservationRepository,
} from './repository';
import {
  IGetTourReservationByDay,
  IGetTourReservationByWeek,
} from './interface';

@Injectable()
export class TourService {
  constructor(
    private readonly tourRepository: TourRepository,
    private readonly tourHolidayRepository: TourHolidayRepository,
    private readonly tourReservationRepository: TourReservationRepository,
  ) {}

  async getTourReservationByWeek(args: IGetTourReservationByWeek) {
    return this.tourHolidayRepository.getOneByWeek(args);
  }

  async getTourReservationByDay(args: IGetTourReservationByDay) {
    return this.tourHolidayRepository.getOneByDay(args);
  }
}
