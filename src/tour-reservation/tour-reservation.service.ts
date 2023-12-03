import { BadRequestException, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as uuid from 'uuid';
import { HolidayType } from '../tour-holiday/enum';
import { IAddTourReservation } from './inteface';
import { TourReservationRepository } from './repository/tour-reservation.repository';
import { TourHolidayService } from '../tour-holiday/tour-holiday.service';
import { TourService } from '../tour/tour.service';

@Injectable()
export class TourReservationService {
  constructor(
    private readonly tourReservationRepository: TourReservationRepository,
    private readonly tourHolidayService: TourHolidayService,
    private readonly tourService: TourService,
  ) {}

  async addTourReservation(args: IAddTourReservation) {
    const { tourId, reservationDate } = args;

    const date = dayjs(reservationDate);
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

    const tour = await this.tourService.getTourById(tourId);
    if (!tour) {
      throw new BadRequestException('투어 상품이 존재하지 않습니다.');
    }

    const reservationCount =
      await this.tourReservationRepository.getCountByReservationDate(
        reservationDate,
      );
    if (tour.reservationLimit <= reservationCount) {
      throw new BadRequestException('예약수가 가득 찼습니다.');
    }

    const token = uuid.v4();
    await this.tourReservationRepository.add({ ...args, token });

    return {
      token,
    };
  }
}
