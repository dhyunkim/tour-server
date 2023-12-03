import { Test, TestingModule } from '@nestjs/testing';
import { TourReservationService } from './tour-reservation.service';

describe('TourReservationService', () => {
  let service: TourReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TourReservationService],
    }).compile();

    service = module.get<TourReservationService>(TourReservationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
