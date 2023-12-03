import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as uuid from 'uuid';
import { WeekType } from '../tour-holiday/enum';
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
    const weekHoliday = await this.tourHolidayService.getTourReservationByWeek(
      tourId,
      date.format('dddd') as WeekType,
    );
    if (weekHoliday) {
      throw new BadRequestException('해당 요일은 투어 휴일입니다.');
    }

    const specificHoliday =
      await this.tourHolidayService.getTourReservationBySpecific(
        tourId,
        date.format('YYYY-MM-DD'),
      );
    if (specificHoliday) {
      throw new BadRequestException('해당 날짜는 투어 휴일입니다.');
    }

    const tour = await this.tourService.getTourById(tourId);
    if (!tour) {
      throw new NotFoundException('투어 상품이 존재하지 않습니다.');
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

    return token;
  }
}
