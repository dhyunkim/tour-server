import { BadRequestException, Injectable } from '@nestjs/common';
import { TourHolidayRepository } from './repository';
import { IAddTourSpecificHoliday, IAddTourWeekHoliday } from './interface';
import { WeekType } from './enum';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';

@Injectable()
export class TourHolidayService {
  constructor(
    private readonly tourHolidayRepository: TourHolidayRepository,
    @InjectRedis() private readonly redisService: Redis,
  ) {}

  async getTourHolidayByWeek(tourId: number, week: WeekType) {
    return this.tourHolidayRepository.getOneByWeek(tourId, week);
  }

  async getTourHolidayBySpecific(tourId: number, specific: string) {
    return this.tourHolidayRepository.getOneBySpecific(tourId, specific);
  }

  async getTourHolidaysByTourId(tourId: number) {
    return this.tourHolidayRepository.getManyByTourId(tourId);
  }

  async addTourWeekHoliday(args: IAddTourWeekHoliday) {
    const weekHoliday = await this.tourHolidayRepository.getOneByWeek(
      args.tourId,
      args.week,
    );
    if (weekHoliday) {
      throw new BadRequestException('이미 등록된 휴일입니다.');
    }

    const addResult = await this.tourHolidayRepository.addWeekHoliday(args);
    await this.removeCacheByTourId(args.tourId);

    return addResult.id;
  }

  async addTourSpecificHoliday(args: IAddTourSpecificHoliday) {
    const specificHoliday = await this.tourHolidayRepository.getOneBySpecific(
      args.tourId,
      args.specific,
    );
    if (specificHoliday) {
      throw new BadRequestException('이미 등록된 휴일입니다.');
    }

    const addResult = await this.tourHolidayRepository.addSpecificHoliday(args);
    await this.removeCacheByTourId(args.tourId);

    return addResult.id;
  }

  private async removeCacheByTourId(tourId: number) {
    const keysPattern = `availableDates:${tourId}:*`;
    const keys = await this.redisService.keys(keysPattern);
    await Promise.all(keys.map((key) => this.redisService.del(key)));
  }
}
