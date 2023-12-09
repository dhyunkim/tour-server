import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as uuid from 'uuid';
import { WeekType } from '../tour-holiday/enum';
import { IAddTourReservation, IDeleteTourReservation } from './inteface';
import { TourReservationRepository } from './repository/tour-reservation.repository';
import { TourHolidayService } from '../tour-holiday/tour-holiday.service';
import { TourService } from '../tour/tour.service';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';

@Injectable()
export class TourReservationService {
  constructor(
    private readonly tourReservationRepository: TourReservationRepository,
    private readonly tourHolidayService: TourHolidayService,
    private readonly tourService: TourService,
    @InjectRedis() private readonly redisService: Redis,
  ) {}

  async getReservationByToken(tourId: number, token: string) {
    const tourReservation = await this.tourReservationRepository.getOneByToken(
      tourId,
      token,
    );
    if (!tourReservation) {
      throw new NotFoundException('고객의 투어 예약이 존재하지 않습니다.');
    }

    const newToken = uuid.v4();
    await this.tourReservationRepository.updateTourToken(tourId, newToken);
    return true;
  }

  async getAvailableDates(tourId: number, month: string) {
    const tour = await this.tourService.getTourById(tourId);
    if (!tour) {
      throw new NotFoundException('투어 상품이 존재하지 않습니다.');
    }

    const cacheKey = `availableDates:${tourId}:${month}`;
    const cacheData = await this.redisService.get(cacheKey);
    if (cacheData) {
      return JSON.parse(cacheData);
    }

    const lastDay = dayjs(month).daysInMonth();
    const reservationDatesAndCount =
      await this.tourReservationRepository.getReservationDatesAndCount({
        tourId,
        month,
        lastDay,
      });

    const availableDates: string[] = [];
    for (let i = 1; i <= lastDay; i++) {
      const nowDate = `${month}-${i.toString().padStart(2, '0')}`;
      const isNotAvailable = reservationDatesAndCount.find(
        (data) =>
          data.reservationDate === nowDate &&
          tour.reservationLimit - Number(data.count) <= 0,
      );
      if (isNotAvailable) {
        continue;
      }

      availableDates.push(nowDate);
    }

    const holidays = await this.tourHolidayService.getTourHolidaysByTourId(
      tourId,
    );

    const result = availableDates
      .map((availableDate) => {
        const weekHoliday = holidays.find(
          (holiday) =>
            holiday.week === (dayjs(availableDate).format('dddd') as WeekType),
        );
        if (weekHoliday) {
          return;
        }

        const specificHoliday = holidays.find(
          (holiday) => holiday.specific === availableDate,
        );
        if (specificHoliday) {
          return;
        }

        return availableDate;
      })
      .filter(Boolean);

    this.redisService.set(cacheKey, JSON.stringify(result), 'EX', 60 * 5);

    return result;
  }

  async addTourReservation(args: IAddTourReservation) {
    const { tourId, reservationDate } = args;

    const date = dayjs(reservationDate);
    const weekHoliday = await this.tourHolidayService.getTourHolidayByWeek(
      tourId,
      date.format('dddd') as WeekType,
    );
    if (weekHoliday) {
      throw new BadRequestException('해당 요일은 투어 휴일입니다.');
    }

    const specificHoliday =
      await this.tourHolidayService.getTourHolidayBySpecific(
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

  async deleteTourReservation(args: IDeleteTourReservation) {
    const reservation = await this.tourReservationRepository.getOneById(
      args.id,
    );
    if (!reservation) {
      throw new NotFoundException('투어 예약이 존재하지 않습니다.');
    }

    const threeDaysBeforeByReservationDate = dayjs(
      reservation.reservationDate,
    ).subtract(3, 'day');
    if (dayjs().isAfter(threeDaysBeforeByReservationDate)) {
      throw new BadRequestException('예약 취소는 3일 전까지 가능합니다.');
    }

    return this.tourReservationRepository.deleteTourReservation(args.id);
  }
}
