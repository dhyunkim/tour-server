import { Test, TestingModule } from '@nestjs/testing';
import { TourHolidayService } from './tour-holiday.service';
import { TourHolidayRepository } from './repository';
import { TourService } from '../tour/tour.service';
import { MockTourHolidayRepository } from '../../test/mock/repository';
import { MockTourService } from '../../test/mock/service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { MockCacheManager } from '../../test/mock/cache-manager.mock';
import { WeekType } from './enum';
import { TourHoliday } from './entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('TourHolidayService', () => {
  let service: TourHolidayService;
  let tourService: TourService;
  let tourHolidayRepository: TourHolidayRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TourHolidayService,
        {
          provide: TourHolidayRepository,
          useValue: MockTourHolidayRepository(),
        },
        {
          provide: TourService,
          useValue: MockTourService(),
        },
        {
          provide: CACHE_MANAGER,
          useValue: MockCacheManager(),
        },
      ],
    }).compile();

    service = module.get<TourHolidayService>(TourHolidayService);
    tourService = module.get<TourService>(TourService);
    tourHolidayRepository = module.get<TourHolidayRepository>(
      TourHolidayRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTourHolidayByWeek()', () => {
    it('normal case', async () => {
      // given
      const tourHoliday = new TourHoliday();
      tourHoliday.tourId = 1;
      tourHoliday.week = WeekType.MONDAY;
      jest
        .spyOn(tourHolidayRepository, 'getOneByWeek')
        .mockResolvedValue(tourHoliday);

      const tourId = 1;
      const week = WeekType.MONDAY;

      // when
      const result = await service.getTourHolidayByWeek(tourId, week);

      // then
      expect(tourHolidayRepository.getOneByWeek).toHaveBeenCalledWith(
        tourId,
        week,
      );
      expect(tourHolidayRepository.getOneByWeek).toHaveBeenCalledTimes(1);
      expect(result).toEqual(tourHoliday);
    });
  });

  describe('getTourHolidayBySpecific()', () => {
    it('normal case', async () => {
      // given
      const tourHoliday = new TourHoliday();
      tourHoliday.tourId = 1;
      tourHoliday.specific = '2023-12-12';
      jest
        .spyOn(tourHolidayRepository, 'getOneBySpecific')
        .mockResolvedValue(tourHoliday);

      const tourId = 1;
      const specific = '2023-12-12';

      // when
      const result = await service.getTourHolidayBySpecific(tourId, specific);

      // then
      expect(tourHolidayRepository.getOneBySpecific).toHaveBeenCalledWith(
        tourId,
        specific,
      );
      expect(tourHolidayRepository.getOneBySpecific).toHaveBeenCalledTimes(1);
      expect(result).toEqual(tourHoliday);
    });
  });

  describe('getTourHolidaysByTourId()', () => {
    it('normal case', async () => {
      // given
      const tourId = 1;

      // when
      const result = await service.getTourHolidaysByTourId(tourId);

      // then
      expect(tourHolidayRepository.getManyByTourId).toHaveBeenCalledWith(
        tourId,
      );
      expect(tourHolidayRepository.getManyByTourId).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  describe('addTourWeekHoliday()', () => {
    it('normal case', async () => {
      // given
      const tourHoliday = new TourHoliday();
      tourHoliday.tourId = 1;
      tourHoliday.specific = '2023-12-12';
      jest
        .spyOn(tourHolidayRepository, 'getOneByWeek')
        .mockResolvedValue(undefined);

      const tourId = 1;
      const week = WeekType.MONDAY;

      // when
      const result = await service.addTourWeekHoliday({ tourId, week });

      // then
      expect(tourService.getTourById).toHaveBeenCalledWith(tourId);
      expect(tourService.getTourById).toHaveBeenCalledTimes(1);
      expect(tourHolidayRepository.getOneByWeek).toHaveBeenCalledWith(
        tourId,
        week,
      );
      expect(tourHolidayRepository.getOneByWeek).toHaveBeenCalledTimes(1);
      expect(tourHolidayRepository.addWeekHoliday).toHaveBeenCalledWith({
        tourId,
        week,
      });
      expect(tourHolidayRepository.addWeekHoliday).toHaveBeenCalledTimes(1);
      expect(result).toEqual(tourHoliday.id);
    });

    it('투어로 등록되지 않은 ID를 입력하면 에러가 발생해야 한다.', async () => {
      // given
      jest.spyOn(tourService, 'getTourById').mockResolvedValue(undefined);

      const tourId = 1;
      const week = WeekType.MONDAY;

      // when - then
      await expect(
        service.addTourWeekHoliday({ tourId, week }),
      ).rejects.toThrow(
        new NotFoundException('투어 상품이 존재하지 않습니다.'),
      );
      expect(tourService.getTourById).toHaveBeenCalledWith(tourId);
      expect(tourService.getTourById).toHaveBeenCalledTimes(1);
      expect(tourHolidayRepository.getOneByWeek).not.toHaveBeenCalled();
      expect(tourHolidayRepository.addWeekHoliday).not.toHaveBeenCalled();
    });

    it('이미 등록된 휴가 정보를 입력하면 에러가 발생해야 한다.', async () => {
      // given
      const tourId = 1;
      const week = WeekType.MONDAY;

      // when - then
      await expect(
        service.addTourWeekHoliday({ tourId, week }),
      ).rejects.toThrow(new BadRequestException('이미 등록된 휴일입니다.'));
      expect(tourService.getTourById).toHaveBeenCalledWith(tourId);
      expect(tourService.getTourById).toHaveBeenCalledTimes(1);
      expect(tourHolidayRepository.getOneByWeek).toHaveBeenCalledWith(
        tourId,
        week,
      );
      expect(tourHolidayRepository.getOneByWeek).toHaveBeenCalledTimes(1);
      expect(tourHolidayRepository.addWeekHoliday).not.toHaveBeenCalled();
    });
  });

  describe('getTourHolidaysByTourId()', () => {
    it('normal case', async () => {
      // given
      const tourId = 1;

      // when
      const result = await service.getTourHolidaysByTourId(tourId);

      // then
      expect(tourHolidayRepository.getManyByTourId).toHaveBeenCalledWith(
        tourId,
      );
      expect(tourHolidayRepository.getManyByTourId).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  describe('addTourSpecificHoliday()', () => {
    it('normal case', async () => {
      // given
      const tourHoliday = new TourHoliday();
      tourHoliday.tourId = 1;
      tourHoliday.specific = '2023-12-12';
      jest
        .spyOn(tourHolidayRepository, 'getOneBySpecific')
        .mockResolvedValue(undefined);

      const tourId = 1;
      const specific = '2023-12-12';

      // when
      const result = await service.addTourSpecificHoliday({ tourId, specific });

      // then
      expect(tourService.getTourById).toHaveBeenCalledWith(tourId);
      expect(tourService.getTourById).toHaveBeenCalledTimes(1);
      expect(tourHolidayRepository.getOneBySpecific).toHaveBeenCalledWith(
        tourId,
        specific,
      );
      expect(tourHolidayRepository.getOneBySpecific).toHaveBeenCalledTimes(1);
      expect(tourHolidayRepository.addSpecificHoliday).toHaveBeenCalledWith({
        tourId,
        specific,
      });
      expect(tourHolidayRepository.addSpecificHoliday).toHaveBeenCalledTimes(1);
      expect(result).toEqual(tourHoliday.id);
    });

    it('투어로 등록되지 않은 ID를 입력하면 에러가 발생해야 한다.', async () => {
      // given
      jest.spyOn(tourService, 'getTourById').mockResolvedValue(undefined);

      const tourId = 1;
      const specific = '2023-12-12';

      // when - then
      await expect(
        service.addTourSpecificHoliday({ tourId, specific }),
      ).rejects.toThrow(
        new NotFoundException('투어 상품이 존재하지 않습니다.'),
      );
      expect(tourService.getTourById).toHaveBeenCalledWith(tourId);
      expect(tourService.getTourById).toHaveBeenCalledTimes(1);
      expect(tourHolidayRepository.getOneBySpecific).not.toHaveBeenCalled();
      expect(tourHolidayRepository.addSpecificHoliday).not.toHaveBeenCalled();
    });

    it('이미 등록된 휴가 정보를 입력하면 에러가 발생해야 한다.', async () => {
      // given
      const tourId = 1;
      const specific = '2023-12-12';

      // when - then
      await expect(
        service.addTourSpecificHoliday({ tourId, specific }),
      ).rejects.toThrow(new BadRequestException('이미 등록된 휴일입니다.'));
      expect(tourService.getTourById).toHaveBeenCalledWith(tourId);
      expect(tourService.getTourById).toHaveBeenCalledTimes(1);
      expect(tourHolidayRepository.getOneBySpecific).toHaveBeenCalledWith(
        tourId,
        specific,
      );
      expect(tourHolidayRepository.getOneBySpecific).toHaveBeenCalledTimes(1);
      expect(tourHolidayRepository.addSpecificHoliday).not.toHaveBeenCalled();
    });
  });
});
