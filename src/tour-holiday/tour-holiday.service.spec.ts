import { Test, TestingModule } from '@nestjs/testing';
import { TourHolidayService } from './tour-holiday.service';
import { TourHolidayRepository } from './repository';
import { TourService } from '../tour/tour.service';
import { MockTourHolidayRepository } from '../../test/mock/repository';
import { MockTourService } from '../../test/mock/service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { MockCacheManager } from '../../test/mock/cache-manager.mock';

describe('TourHolidayService', () => {
  let service: TourHolidayService;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
