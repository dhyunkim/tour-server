import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TourReservationService } from './tour-reservation.service';
import { TourReservationRepository } from './repository';
import { MockTourReservationRepository } from '../../test/mock/repository';
import { TourHolidayService } from '../tour-holiday/tour-holiday.service';
import {
  MockTourHolidayService,
  MockTourService,
} from '../../test/mock/service';
import { MockCacheManager } from '../../test/mock/cache-manager.mock';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { TourService } from '../tour/tour.service';
import { TourReservation } from './entity';
import { IAddTourReservation } from './inteface';
import { Tour } from '../tour/entity';

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('newToken'),
}));

describe('TourReservationService', () => {
  let service: TourReservationService;
  let tourService: TourService;
  let tourHolidayService: TourHolidayService;
  let tourReservationRepository: TourReservationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TourReservationService,
        {
          provide: TourReservationRepository,
          useValue: MockTourReservationRepository(),
        },
        {
          provide: TourHolidayService,
          useValue: MockTourHolidayService(),
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

    service = module.get<TourReservationService>(TourReservationService);
    tourService = module.get<TourService>(TourService);
    tourHolidayService = module.get<TourHolidayService>(TourHolidayService);
    tourReservationRepository = module.get<TourReservationRepository>(
      TourReservationRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getReservationByToken()', () => {
    it('normal case', async () => {
      // given
      const tourReservation = new TourReservation();
      tourReservation.userId = 1;
      jest
        .spyOn(tourReservationRepository, 'getOneByToken')
        .mockResolvedValue(tourReservation);

      const tourId = 1;
      const token = 'token';

      // when
      const result = await service.getReservationByToken({ tourId, token });

      // then
      expect(tourReservationRepository.getOneByToken).toHaveBeenCalledWith(
        tourId,
        token,
      );
      expect(tourReservationRepository.getOneByToken).toHaveBeenCalledTimes(1);
      expect(tourReservationRepository.updateTourToken).toHaveBeenCalledWith({
        tourId,
        userId: 1,
        token: 'newToken',
      });
      expect(tourReservationRepository.updateTourToken).toHaveBeenCalledTimes(
        1,
      );
      expect(result).toEqual(true);
    });

    it('등록되지 않은 투어 ID를 입력하면 에러가 발생해야 한다.', async () => {
      // given
      jest
        .spyOn(tourReservationRepository, 'getOneByToken')
        .mockResolvedValue(undefined);

      const tourId = 1;
      const token = 'token';

      // when - then
      await expect(
        service.getReservationByToken({ tourId, token }),
      ).rejects.toThrow(
        new NotFoundException('고객의 투어 예약이 존재하지 않습니다.'),
      );
      expect(tourReservationRepository.getOneByToken).toHaveBeenCalledWith(
        tourId,
        token,
      );
      expect(tourReservationRepository.getOneByToken).toHaveBeenCalledTimes(1);
      expect(tourReservationRepository.updateTourToken).not.toHaveBeenCalled();
    });
  });

  describe('removeTourReservation()', () => {
    it('normal case', async () => {
      // given
      jest.useFakeTimers().setSystemTime(new Date('2023-12-10 00:00:00'));

      const tourReservation = new TourReservation();
      tourReservation.reservationDate = '2023-12-23';
      jest
        .spyOn(tourReservationRepository, 'getOneById')
        .mockResolvedValue(tourReservation);

      const id = 1;

      // when
      const result = await service.removeTourReservation({ id });

      // then
      expect(tourReservationRepository.getOneById).toHaveBeenCalledWith(id);
      expect(tourReservationRepository.getOneById).toHaveBeenCalledTimes(1);
      expect(
        tourReservationRepository.deleteTourReservation,
      ).toHaveBeenCalledWith(id);
      expect(
        tourReservationRepository.deleteTourReservation,
      ).toHaveBeenCalledTimes(1);
      expect(result).toEqual(true);
    });

    it('존재하지 않는 예약을 삭제하려하면 에러가 발생해야 한다.', async () => {
      // given
      jest
        .spyOn(tourReservationRepository, 'getOneById')
        .mockResolvedValue(undefined);

      const id = 1;

      // when
      await expect(service.removeTourReservation({ id })).rejects.toThrow(
        new NotFoundException('예약이 존재하지 않습니다.'),
      );
      expect(tourReservationRepository.getOneById).toHaveBeenCalledWith(id);
      expect(tourReservationRepository.getOneById).toHaveBeenCalledTimes(1);
      expect(
        tourReservationRepository.deleteTourReservation,
      ).not.toHaveBeenCalled();
    });

    it('현재일이 예약 3일전이 아니라면 에러가 발생해야 한다.', async () => {
      // given
      jest.useFakeTimers().setSystemTime(new Date('2023-12-10 00:00:00'));

      const tourReservation = new TourReservation();
      tourReservation.reservationDate = '2023-12-11';
      jest
        .spyOn(tourReservationRepository, 'getOneById')
        .mockResolvedValue(tourReservation);

      const id = 1;

      // when
      await expect(service.removeTourReservation({ id })).rejects.toThrow(
        new BadRequestException('예약 취소는 3일 전까지 가능합니다.'),
      );
      expect(tourReservationRepository.getOneById).toHaveBeenCalledWith(id);
      expect(tourReservationRepository.getOneById).toHaveBeenCalledTimes(1);
      expect(
        tourReservationRepository.deleteTourReservation,
      ).not.toHaveBeenCalled();
    });
  });

  describe('addTourReservation()', () => {
    it('normal case', async () => {
      // given
      jest.useFakeTimers().setSystemTime(new Date('2023-12-10 00:00:00'));

      const tour = new Tour();
      tour.reservationLimit = 5;
      jest.spyOn(tourService, 'getTourById').mockResolvedValue(tour);
      jest
        .spyOn(tourReservationRepository, 'getOneByUser')
        .mockResolvedValue(undefined);
      jest
        .spyOn(tourHolidayService, 'getTourHolidayByWeek')
        .mockResolvedValue(undefined);
      jest
        .spyOn(tourHolidayService, 'getTourHolidayBySpecific')
        .mockResolvedValue(undefined);
      jest
        .spyOn(tourReservationRepository, 'getCountByReservationDate')
        .mockResolvedValue(3);

      const args: IAddTourReservation = {
        userId: 1,
        tourId: 1,
        reservationDate: '2023-12-12',
      };

      // when
      const result = await service.addTourReservation(args);

      // then
      expect(tourService.getTourById).toHaveBeenCalledWith(args.tourId);
      expect(tourService.getTourById).toHaveBeenCalledTimes(1);
      expect(tourReservationRepository.getOneByUser).toHaveBeenCalledWith(
        args.tourId,
        args.userId,
        args.reservationDate,
      );
      expect(tourReservationRepository.getOneByUser).toHaveBeenCalledTimes(1);
      expect(tourHolidayService.getTourHolidayByWeek).toHaveBeenCalledWith(
        args.tourId,
        'Tuesday',
      );
      expect(tourHolidayService.getTourHolidayByWeek).toHaveBeenCalledTimes(1);
      expect(tourHolidayService.getTourHolidayBySpecific).toHaveBeenCalledWith(
        args.tourId,
        '2023-12-12',
      );
      expect(tourHolidayService.getTourHolidayBySpecific).toHaveBeenCalledTimes(
        1,
      );
      expect(
        tourReservationRepository.getCountByReservationDate,
      ).toHaveBeenCalledWith('2023-12-12');
      expect(
        tourReservationRepository.getCountByReservationDate,
      ).toHaveBeenCalledTimes(1);
      expect(tourReservationRepository.add).toHaveBeenCalledWith({
        ...args,
        token: 'newToken',
      });
      expect(tourReservationRepository.add).toHaveBeenCalledTimes(1);
      expect(result).toEqual('newToken');
    });

    it('등록되지 않은 투어 ID를 입력하면 에러가 발생해야 한다.', async () => {
      // given
      jest.spyOn(tourService, 'getTourById').mockResolvedValue(undefined);

      const args: IAddTourReservation = {
        userId: 1,
        tourId: 1,
        reservationDate: '2023-12-12',
      };

      // when - then
      await expect(service.addTourReservation(args)).rejects.toThrow(
        new NotFoundException('투어 상품이 존재하지 않습니다.'),
      );
      expect(tourService.getTourById).toHaveBeenCalledWith(args.tourId);
      expect(tourService.getTourById).toHaveBeenCalledTimes(1);
      expect(tourReservationRepository.getOneByUser).not.toHaveBeenCalled();
      expect(tourHolidayService.getTourHolidayByWeek).not.toHaveBeenCalled();
      expect(
        tourHolidayService.getTourHolidayBySpecific,
      ).not.toHaveBeenCalled();
      expect(
        tourReservationRepository.getCountByReservationDate,
      ).not.toHaveBeenCalled();
      expect(tourReservationRepository.add).not.toHaveBeenCalled();
    });

    it('이미 예약한 투어를 예약하려하면 에러가 발생해야 한다.', async () => {
      // given
      const args: IAddTourReservation = {
        userId: 1,
        tourId: 1,
        reservationDate: '2023-12-12',
      };

      // when - then
      await expect(service.addTourReservation(args)).rejects.toThrow(
        new NotFoundException('이미 예약한 투어 상품입니다.'),
      );
      expect(tourService.getTourById).toHaveBeenCalledWith(args.tourId);
      expect(tourService.getTourById).toHaveBeenCalledTimes(1);
      expect(tourReservationRepository.getOneByUser).toHaveBeenCalledWith(
        args.tourId,
        args.userId,
        args.reservationDate,
      );
      expect(tourReservationRepository.getOneByUser).toHaveBeenCalledTimes(1);
      expect(tourHolidayService.getTourHolidayByWeek).not.toHaveBeenCalled();
      expect(
        tourHolidayService.getTourHolidayBySpecific,
      ).not.toHaveBeenCalled();
      expect(
        tourReservationRepository.getCountByReservationDate,
      ).not.toHaveBeenCalled();
      expect(tourReservationRepository.add).not.toHaveBeenCalled();
    });

    it('예약하려는 날이 투어휴일(요일)이라면 에러가 발생해야 한다.', async () => {
      // given
      jest
        .spyOn(tourReservationRepository, 'getOneByUser')
        .mockResolvedValue(undefined);

      const args: IAddTourReservation = {
        userId: 1,
        tourId: 1,
        reservationDate: '2023-12-12',
      };

      // when - then
      await expect(service.addTourReservation(args)).rejects.toThrow(
        new BadRequestException('해당 요일은 투어 휴일입니다.'),
      );
      expect(tourService.getTourById).toHaveBeenCalledWith(args.tourId);
      expect(tourService.getTourById).toHaveBeenCalledTimes(1);
      expect(tourReservationRepository.getOneByUser).toHaveBeenCalledWith(
        args.tourId,
        args.userId,
        args.reservationDate,
      );
      expect(tourReservationRepository.getOneByUser).toHaveBeenCalledTimes(1);
      expect(tourHolidayService.getTourHolidayByWeek).toHaveBeenCalledWith(
        args.tourId,
        'Tuesday',
      );
      expect(tourHolidayService.getTourHolidayByWeek).toHaveBeenCalledTimes(1);
      expect(
        tourHolidayService.getTourHolidayBySpecific,
      ).not.toHaveBeenCalled();
      expect(
        tourReservationRepository.getCountByReservationDate,
      ).not.toHaveBeenCalled();
      expect(tourReservationRepository.add).not.toHaveBeenCalled();
    });

    it('예약하려는 날이 투어휴일(날짜)이라면 에러가 발생해야 한다.', async () => {
      // given
      jest
        .spyOn(tourReservationRepository, 'getOneByUser')
        .mockResolvedValue(undefined);
      jest
        .spyOn(tourHolidayService, 'getTourHolidayByWeek')
        .mockResolvedValue(undefined);

      const args: IAddTourReservation = {
        userId: 1,
        tourId: 1,
        reservationDate: '2023-12-12',
      };

      // when - then
      await expect(service.addTourReservation(args)).rejects.toThrow(
        new BadRequestException('해당 날짜는 투어 휴일입니다.'),
      );
      expect(tourService.getTourById).toHaveBeenCalledWith(args.tourId);
      expect(tourService.getTourById).toHaveBeenCalledTimes(1);
      expect(tourReservationRepository.getOneByUser).toHaveBeenCalledWith(
        args.tourId,
        args.userId,
        args.reservationDate,
      );
      expect(tourReservationRepository.getOneByUser).toHaveBeenCalledTimes(1);
      expect(tourHolidayService.getTourHolidayByWeek).toHaveBeenCalledWith(
        args.tourId,
        'Tuesday',
      );
      expect(tourHolidayService.getTourHolidayByWeek).toHaveBeenCalledTimes(1);
      expect(tourHolidayService.getTourHolidayBySpecific).toHaveBeenCalledWith(
        args.tourId,
        '2023-12-12',
      );
      expect(tourHolidayService.getTourHolidayBySpecific).toHaveBeenCalledTimes(
        1,
      );
      expect(
        tourReservationRepository.getCountByReservationDate,
      ).not.toHaveBeenCalled();
      expect(tourReservationRepository.add).not.toHaveBeenCalled();
    });

    it('예약하려는 날의 예약 제한이 가득찼으면 에러가 발생해야 한다.', async () => {
      // given
      const tour = new Tour();
      tour.reservationLimit = 5;
      jest.spyOn(tourService, 'getTourById').mockResolvedValue(tour);
      jest
        .spyOn(tourReservationRepository, 'getOneByUser')
        .mockResolvedValue(undefined);
      jest
        .spyOn(tourHolidayService, 'getTourHolidayByWeek')
        .mockResolvedValue(undefined);
      jest
        .spyOn(tourHolidayService, 'getTourHolidayBySpecific')
        .mockResolvedValue(undefined);
      jest
        .spyOn(tourReservationRepository, 'getCountByReservationDate')
        .mockResolvedValue(5);

      const args: IAddTourReservation = {
        userId: 1,
        tourId: 1,
        reservationDate: '2023-12-12',
      };

      // when - then
      await expect(service.addTourReservation(args)).rejects.toThrow(
        new BadRequestException('예약수가 가득 찼습니다.'),
      );
      expect(tourService.getTourById).toHaveBeenCalledWith(args.tourId);
      expect(tourService.getTourById).toHaveBeenCalledTimes(1);
      expect(tourReservationRepository.getOneByUser).toHaveBeenCalledWith(
        args.tourId,
        args.userId,
        args.reservationDate,
      );
      expect(tourReservationRepository.getOneByUser).toHaveBeenCalledTimes(1);
      expect(tourHolidayService.getTourHolidayByWeek).toHaveBeenCalledWith(
        args.tourId,
        'Tuesday',
      );
      expect(tourHolidayService.getTourHolidayByWeek).toHaveBeenCalledTimes(1);
      expect(tourHolidayService.getTourHolidayBySpecific).toHaveBeenCalledWith(
        args.tourId,
        '2023-12-12',
      );
      expect(tourHolidayService.getTourHolidayBySpecific).toHaveBeenCalledTimes(
        1,
      );
      expect(
        tourReservationRepository.getCountByReservationDate,
      ).toHaveBeenCalledWith('2023-12-12');
      expect(
        tourReservationRepository.getCountByReservationDate,
      ).toHaveBeenCalledTimes(1);
      expect(tourReservationRepository.add).not.toHaveBeenCalled();
    });
  });
});
