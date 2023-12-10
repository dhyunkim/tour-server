import { TourHoliday } from '../../../src/tour-holiday/entity';

export const MockTourHolidayService = () => ({
  getTourHolidayByWeek: jest.fn().mockResolvedValue(new TourHoliday()),
  getTourHolidayBySpecific: jest.fn().mockResolvedValue(new TourHoliday()),
  getTourHolidaysByTourId: jest.fn().mockResolvedValue([]),
});
