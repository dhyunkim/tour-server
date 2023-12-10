import { Tour } from '../../../src/tour/entity';

export const MockTourRepository = () => ({
  getCountByToken: jest.fn().mockResolvedValue(undefined),
  getOneById: jest.fn().mockResolvedValue(new Tour()),
  getOneByToken: jest.fn().mockResolvedValue(new Tour()),
  add: jest.fn().mockResolvedValue(new Tour()),
  updateTour: jest.fn().mockResolvedValue(true),
  updateTourReservationLimit: jest.fn().mockResolvedValue(true),
  removeById: jest.fn().mockResolvedValue(true),
});
