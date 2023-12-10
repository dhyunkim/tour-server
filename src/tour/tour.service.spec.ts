import { Test, TestingModule } from '@nestjs/testing';
import { TourService } from './tour.service';
import { TourRepository } from './repository';
import { MockTourRepository } from '../../test/mock/repository';
import { Tour } from './entity';
import { NotFoundException } from '@nestjs/common';

describe('TourService', () => {
  let service: TourService;
  let tourRepository: TourRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TourService,
        {
          provide: TourRepository,
          useValue: MockTourRepository(),
        },
      ],
    }).compile();

    service = module.get<TourService>(TourService);
    tourRepository = module.get<TourRepository>(TourRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTourById()', () => {
    it('normal case', async () => {
      // given
      const tour = new Tour();
      tour.id = 1;
      tour.title = '줌줌';
      jest.spyOn(tourRepository, 'getOneById').mockResolvedValue(tour);

      const id = 1;

      // when
      const result = await service.getTourById(id);

      // then
      expect(tourRepository.getOneById).toHaveBeenCalledWith(id);
      expect(tourRepository.getOneById).toHaveBeenCalledTimes(1);
      expect(result).toEqual(tour);
    });
  });

  describe('addTour()', () => {
    it('normal case', async () => {
      // given
      const tour = new Tour();
      tour.id = 1;
      tour.title = '줌줌';
      jest.spyOn(tourRepository, 'add').mockResolvedValue(tour);

      const userId = 1;
      const title = '줌줌';

      // when
      const result = await service.addTour(userId, title);

      // then
      expect(tourRepository.add).toHaveBeenCalledWith(userId, title);
      expect(tourRepository.add).toHaveBeenCalledTimes(1);
      expect(result).toEqual(tour.id);
    });
  });

  describe('updateTour()', () => {
    it('normal case', async () => {
      // given
      const id = 1;
      const title = '줌줌2';

      // when
      const result = await service.updateTour(id, title);

      // then
      expect(tourRepository.getOneById).toHaveBeenCalledWith(id);
      expect(tourRepository.getOneById).toHaveBeenCalledTimes(1);
      expect(tourRepository.updateTour).toHaveBeenCalledWith(id, title);
      expect(tourRepository.updateTour).toHaveBeenCalledTimes(1);
      expect(result).toEqual(true);
    });

    it('등록되지 않은 투어 ID를 입력하면 에러가 발생해야 한다.', async () => {
      // given
      jest.spyOn(tourRepository, 'getOneById').mockResolvedValue(undefined);

      const id = 1;
      const title = '줌줌2';

      // when
      await expect(service.updateTour(id, title)).rejects.toThrow(
        new NotFoundException('투어 상품이 존재하지 않습니다.'),
      );
      expect(tourRepository.getOneById).toHaveBeenCalledWith(id);
      expect(tourRepository.getOneById).toHaveBeenCalledTimes(1);
      expect(tourRepository.updateTour).not.toHaveBeenCalled();
    });
  });

  describe('removeTour()', () => {
    it('normal case', async () => {
      // given
      const id = 1;

      // when
      const result = await service.removeTour(id);

      // then
      expect(tourRepository.getOneById).toHaveBeenCalledWith(id);
      expect(tourRepository.getOneById).toHaveBeenCalledTimes(1);
      expect(tourRepository.removeById).toHaveBeenCalledWith(id);
      expect(tourRepository.removeById).toHaveBeenCalledTimes(1);
      expect(result).toEqual(true);
    });

    it('등록되지 않은 투어 ID를 입력하면 에러가 발생해야 한다.', async () => {
      // given
      jest.spyOn(tourRepository, 'getOneById').mockResolvedValue(undefined);

      const id = 1;

      // when
      await expect(service.removeTour(id)).rejects.toThrow(
        new NotFoundException('투어 상품이 존재하지 않습니다.'),
      );
      expect(tourRepository.getOneById).toHaveBeenCalledWith(id);
      expect(tourRepository.getOneById).toHaveBeenCalledTimes(1);
      expect(tourRepository.removeById).not.toHaveBeenCalled();
    });
  });

  describe('updateTourReservationLimit()', () => {
    it('normal case', async () => {
      // given
      const id = 1;
      const reservationLimit = 7;

      // when
      const result = await service.updateTourReservationLimit(
        id,
        reservationLimit,
      );

      // then
      expect(tourRepository.getOneById).toHaveBeenCalledWith(id);
      expect(tourRepository.getOneById).toHaveBeenCalledTimes(1);
      expect(tourRepository.updateTourReservationLimit).toHaveBeenCalledWith(
        id,
        reservationLimit,
      );
      expect(tourRepository.updateTourReservationLimit).toHaveBeenCalledTimes(
        1,
      );
      expect(result).toEqual(true);
    });

    it('등록되지 않은 투어 ID를 입력하면 에러가 발생해야 한다.', async () => {
      // given
      jest.spyOn(tourRepository, 'getOneById').mockResolvedValue(undefined);

      const id = 1;
      const reservationLimit = 7;

      // when
      await expect(
        service.updateTourReservationLimit(id, reservationLimit),
      ).rejects.toThrow(
        new NotFoundException('투어 상품이 존재하지 않습니다.'),
      );
      expect(tourRepository.getOneById).toHaveBeenCalledWith(id);
      expect(tourRepository.getOneById).toHaveBeenCalledTimes(1);
      expect(tourRepository.updateTourReservationLimit).not.toHaveBeenCalled();
    });
  });
});
