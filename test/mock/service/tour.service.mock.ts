import { Tour } from '../../../src/tour/entity';

export const MockTourService = () => ({
  getTourById: jest.fn().mockResolvedValue(new Tour()),
});
