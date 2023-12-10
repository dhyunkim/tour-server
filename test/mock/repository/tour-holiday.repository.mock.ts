import { TourHoliday } from '../../../src/tour-holiday/entity';

export const MockTourHolidayRepository = () => ({
  getManyByTourId: jest.fn().mockResolvedValue([]),
  getOneByWeek: jest.fn().mockResolvedValue(new TourHoliday()),
  getOneBySpecific: jest.fn().mockResolvedValue(new TourHoliday()),
  addWeekHoliday: jest.fn().mockResolvedValue(new TourHoliday()),
  addSpecificHoliday: jest.fn().mockResolvedValue(new TourHoliday()),
});
