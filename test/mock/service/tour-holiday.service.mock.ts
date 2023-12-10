import { Tour } from '../../../src/tour/entity';

export const MockTourHolidayService = () => ({
  getTourById: jest.fn().mockResolvedValue(new Tour()),
});
