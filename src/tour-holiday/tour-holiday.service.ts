import { Injectable } from '@nestjs/common';
import { HolidayType } from './enum';
import { TourHolidayRepository } from './repository';

@Injectable()
export class TourHolidayService {
  constructor(private readonly tourHolidayRepository: TourHolidayRepository) {}

  async getTourReservationsByType(tourId: number, type: HolidayType) {
    return this.tourHolidayRepository.getManyByType(tourId, type);
  }
}
