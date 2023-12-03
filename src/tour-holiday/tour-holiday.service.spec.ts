import { Test, TestingModule } from '@nestjs/testing';
import { TourHolidayService } from './tour-holiday.service';

describe('TourHolidayService', () => {
  let service: TourHolidayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TourHolidayService],
    }).compile();

    service = module.get<TourHolidayService>(TourHolidayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
