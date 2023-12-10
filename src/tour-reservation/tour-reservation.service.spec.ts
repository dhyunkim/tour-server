import { Test, TestingModule } from '@nestjs/testing';
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
import { BadRequestException, NotFoundException } from '@nestjs/common';

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('newToken'),
}));

describe('TourReservationService', () => {
  let service: TourReservationService;
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

      // when
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
});
