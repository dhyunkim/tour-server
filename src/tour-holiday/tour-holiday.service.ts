import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TourHolidayRepository } from './repository';
import { IAddTourSpecificHoliday, IAddTourWeekHoliday } from './interface';
import { WeekType } from './enum';
import { TourService } from '../tour/tour.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class TourHolidayService {
  constructor(
    private readonly tourHolidayRepository: TourHolidayRepository,
    private readonly tourService: TourService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * 입력받은 요일이 투어 휴일인지 조회하는 함수.
   */
  async getTourHolidayByWeek(tourId: number, week: WeekType) {
    return this.tourHolidayRepository.getOneByWeek(tourId, week);
  }

  /**
   * 입력받은 날짜가 투어 휴일인지 조회하는 함수.
   */
  async getTourHolidayBySpecific(tourId: number, specific: string) {
    return this.tourHolidayRepository.getOneBySpecific(tourId, specific);
  }

  /**
   * 입력받은 투어 ID로 투어 휴일들을 조회하는 함수.
   */
  async getTourHolidaysByTourId(tourId: number) {
    return this.tourHolidayRepository.getManyByTourId(tourId);
  }

  /**
   * 특정 요일을 투어 휴일로 지정하는 함수.
   */
  async addTourWeekHoliday(args: IAddTourWeekHoliday) {
    const tour = await this.tourService.getTourById(args.tourId);
    if (!tour) {
      throw new NotFoundException('투어 상품이 존재하지 않습니다.');
    }

    const weekHoliday = await this.tourHolidayRepository.getOneByWeek(
      args.tourId,
      args.week,
    );
    if (weekHoliday) {
      throw new BadRequestException('이미 등록된 휴일입니다.');
    }

    const addResult = await this.tourHolidayRepository.addWeekHoliday(args);
    await this.removeCacheByTourId(args.tourId); // 투어의 캐싱을 삭제한다.

    return addResult.id;
  }

  /**
   * 특정 날을 투어 휴일로 지정하는 함수.
   */
  async addTourSpecificHoliday(args: IAddTourSpecificHoliday) {
    const tour = await this.tourService.getTourById(args.tourId);
    if (!tour) {
      throw new NotFoundException('투어 상품이 존재하지 않습니다.');
    }

    const specificHoliday = await this.tourHolidayRepository.getOneBySpecific(
      args.tourId,
      args.specific,
    );
    if (specificHoliday) {
      throw new BadRequestException('이미 등록된 휴일입니다.');
    }

    const addResult = await this.tourHolidayRepository.addSpecificHoliday(args);
    await this.removeCacheByTourId(args.tourId); // 투어의 캐싱을 삭제한다.

    return addResult.id;
  }

  /**
   * 투어의 캐시들을 초기화하는 함수.
   */
  private async removeCacheByTourId(tourId: number) {
    const keysPattern = `availableDatesForReservation:${tourId}:*`;
    const keys: string[] = await this.cacheManager.store.keys(keysPattern);
    await Promise.all(keys.map((key) => this.cacheManager.del(key)));
  }
}
