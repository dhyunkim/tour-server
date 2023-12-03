import { Injectable } from '@nestjs/common';
import { TourHolidayRepository } from './repository';
import { IAddTourSpecificHoliday, IAddTourWeekHoliday } from './interface';
import { WeekType } from './enum';

@Injectable()
export class TourHolidayService {
  constructor(private readonly tourHolidayRepository: TourHolidayRepository) {}

  async getTourReservationByWeek(tourId: number, week: WeekType) {
    return this.tourHolidayRepository.getOneByWeek(tourId, week);
  }

  async getTourReservationBySpecific(tourId: number, specific: string) {
    return this.tourHolidayRepository.getOneBySpecific(tourId, specific);
  }

  async addTourWeekHoliday(args: IAddTourWeekHoliday) {
    const addResult = await this.tourHolidayRepository.addWeekHoliday(args);
    return addResult.id;
  }

  async addTourSpecificHoliday(args: IAddTourSpecificHoliday) {
    const addResult = await this.tourHolidayRepository.addSpecificHoliday(args);
    return addResult.id;
  }
}
