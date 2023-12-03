import { EntityRepository, Repository } from 'typeorm';
import { TourHoliday } from '../entity';
import { HolidayType } from '../enum';

@EntityRepository(TourHoliday)
export class TourHolidayRepository extends Repository<TourHoliday> {
  async getManyByType(tourId: number, type: HolidayType) {
    return this.find({
      where: {
        tourId,
        type,
      },
    });
  }
}
