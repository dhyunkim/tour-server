import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as dayjs from 'dayjs';
import * as uuid from 'uuid';
import { WeekType } from '../tour-holiday/enum';
import {
  IAddTourReservation,
  IDeleteTourReservation,
  IGetReservationByToken,
} from './inteface';
import { TourReservationRepository } from './repository/tour-reservation.repository';
import { TourHolidayService } from '../tour-holiday/tour-holiday.service';
import { TourService } from '../tour/tour.service';

@Injectable()
export class TourReservationService {
  constructor(
    private readonly tourReservationRepository: TourReservationRepository,
    private readonly tourHolidayService: TourHolidayService,
    private readonly tourService: TourService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * 토큰으로 고객의 예약 여부를 확인하는 함수.
   */
  async getReservationByToken(args: IGetReservationByToken) {
    const { tourId, token } = args;
    const tourReservation = await this.tourReservationRepository.getOneByToken(
      tourId,
      token,
    );
    if (!tourReservation) {
      throw new NotFoundException('고객의 투어 예약이 존재하지 않습니다.');
    }

    // 기존 토큰을 만료시키고 새로운 토큰으로 갱신한다.
    const newToken = uuid.v4();
    return this.tourReservationRepository.updateTourToken({
      ...args,
      userId: tourReservation.userId,
      token: newToken,
    });
  }

  /**
   * 월단위로 예약가능한 날들을 조회하는 함수.
   */
  async getAvailableDatesByMonth(tourId: number, month: string) {
    const tour = await this.tourService.getTourById(tourId);
    if (!tour) {
      throw new NotFoundException('투어 상품이 존재하지 않습니다.');
    }

    // 캐싱이 되어있는지 확인하고 캐싱되어있으면 캐싱한 데이터를 반환한다.
    const cacheKey = `availableDatesForReservation:${tourId}:${month}`;
    const cacheData = await this.cacheManager.get<string>(cacheKey);
    if (cacheData) {
      return JSON.parse(cacheData);
    }

    // 입력받은 월의 날짜별 예약수를 조회한다.
    const lastDay = dayjs(month).daysInMonth();
    const reservationDatesAndCount =
      await this.tourReservationRepository.getReservationDatesAndCount({
        tourId,
        month,
        lastDay,
      });

    // 입력받은 월의 각 날짜 예약이 투어 예약 제한을 초과했는지 확인.
    const availableDates: string[] = [];
    for (let i = 1; i <= lastDay; i++) {
      const nowDate = `${month}-${i.toString().padStart(2, '0')}`;
      const isNotAvailable = reservationDatesAndCount.find(
        (data) =>
          data.reservationDate === nowDate &&
          tour.reservationLimit <= Number(data.count),
      );
      if (isNotAvailable) {
        continue;
      }

      availableDates.push(nowDate);
    }

    // 투어의 휴일들을 조회.
    const holidays = await this.tourHolidayService.getTourHolidaysByTourId(
      tourId,
    );

    // 위에서 구한 날들이 휴일인지 검증.
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

    // 레디스 캐싱한다. TTL은 5분.
    this.cacheManager.set(cacheKey, JSON.stringify(result), 60 * 5);

    return result;
  }

  /**
   * 투어 예약을 추가하는 함수.
   */
  async addTourReservation(args: IAddTourReservation) {
    const { tourId, reservationDate, userId } = args;
    const tour = await this.tourService.getTourById(tourId);
    if (!tour) {
      throw new NotFoundException('투어 상품이 존재하지 않습니다.');
    }

    const isAlreadyReserved = await this.tourReservationRepository.getOneByUser(
      tourId,
      userId,
      reservationDate,
    );
    if (isAlreadyReserved) {
      throw new NotFoundException('이미 예약한 투어 상품입니다.');
    }

    // 입력한 날짜가 휴일(요일)인지 확인.
    const date = dayjs(reservationDate);
    const weekHoliday = await this.tourHolidayService.getTourHolidayByWeek(
      tourId,
      date.format('dddd') as WeekType, // 날짜를 요일로 변환 e.g) 2023-12-09 => Saturday
    );
    if (weekHoliday) {
      throw new BadRequestException('해당 요일은 투어 휴일입니다.');
    }

    // 입력한 날짜가 휴일(날짜)인지 확인.
    const specificHoliday =
      await this.tourHolidayService.getTourHolidayBySpecific(
        tourId,
        date.format('YYYY-MM-DD'),
      );
    if (specificHoliday) {
      throw new BadRequestException('해당 날짜는 투어 휴일입니다.');
    }

    // 예약수가 가득찼는지 확인.
    const reservationCount =
      await this.tourReservationRepository.getCountByReservationDate(
        reservationDate,
      );
    if (tour.reservationLimit <= reservationCount) {
      throw new BadRequestException('예약수가 가득 찼습니다.');
    }

    // 토큰 생성 및 저장.
    const token = uuid.v4();
    await this.tourReservationRepository.add({ ...args, token });

    return token;
  }

  /**
   * 투어 예약을 취소하는 함수.
   */
  async removeTourReservation(args: IDeleteTourReservation) {
    const reservation = await this.tourReservationRepository.getOneById(
      args.id,
    );
    if (!reservation) {
      throw new NotFoundException('예약이 존재하지 않습니다.');
    }

    const threeDaysBeforeFromReservationDate = dayjs(
      reservation.reservationDate,
    ).subtract(3, 'day');
    if (dayjs().isAfter(threeDaysBeforeFromReservationDate)) {
      throw new BadRequestException('예약 취소는 3일 전까지 가능합니다.');
    }

    return this.tourReservationRepository.deleteTourReservation(args.id);
  }
}
