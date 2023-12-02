import { Injectable } from '@nestjs/common';
import {
  TourHolidayRepository,
  TourRepository,
  TourReservationRepository,
} from './repository';
import { IGetTourReservationByWeek } from './interface/get-tour-reservation-by-week.interface';

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
}
