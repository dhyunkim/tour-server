import { TourReservation } from '../../../src/tour-reservation/entity';

export const MockTourReservationRepository = () => ({
  getOneById: jest.fn().mockResolvedValue(new TourReservation()),
  getOneByToken: jest.fn().mockResolvedValue(new TourReservation()),
  getOneByUser: jest.fn().mockResolvedValue(new TourReservation()),
  getCountByReservationDate: jest.fn().mockResolvedValue(1),
  getReservationDatesAndCount: jest.fn().mockResolvedValue([]),
  add: jest.fn().mockResolvedValue(new TourReservation()),
  updateTourToken: jest.fn().mockResolvedValue(true),
  deleteTourReservation: jest.fn().mockResolvedValue(true),
});
