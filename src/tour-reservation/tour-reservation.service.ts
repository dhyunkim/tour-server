import { BadRequestException, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { IAddTourReservation } from './inteface';
import { TourReservationRepository } from './repository/tour-reservation.repository';
import { TourHolidayService } from '../tour-holiday/tour-holiday.service';
import { HolidayType } from '../tour-holiday/enum';

@Injectable()
export class TourReservationService {
  constructor(
    private readonly tourReservationRepository: TourReservationRepository,
    private readonly tourHolidayService: TourHolidayService,
  ) {}

  async addTourReservation(args: IAddTourReservation) {
    const { tourId, reservedAt } = args;

    const date = dayjs(reservedAt);
    const reservationsForWeekHoliday =
      await this.tourHolidayService.getTourReservationsByType(
        tourId,
        HolidayType.WEEK,
      );
    const weekHolidays = reservationsForWeekHoliday.map(
      (reservations) => reservations.holiday,
    );
    if (weekHolidays.includes(date.format('dddd'))) {
      throw new BadRequestException('해당 요일은 투어 휴일입니다.');
    }

    const reservationsForSpecificHoliday =
      await this.tourHolidayService.getTourReservationsByType(
        tourId,
        HolidayType.SPECIFIC,
      );
    const specificHolidays = reservationsForSpecificHoliday.map(
      (reservations) => reservations.holiday,
    );
    if (specificHolidays.includes(date.format('YYYY-MM-DD'))) {
      throw new BadRequestException('해당 날짜는 투어 휴일입니다.');
    }

    return true;
  }
}
