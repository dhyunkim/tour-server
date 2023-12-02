import { EntityRepository, Repository } from 'typeorm';
import { TourHoliday } from '../entity';
import { IGetOneByWeek } from './inteface';

@EntityRepository(TourHoliday)
export class TourHolidayRepository extends Repository<TourHoliday> {
  async getOneByWeek(args: IGetOneByWeek) {
    const { tourId, week } = args;
    return this.findOne({
      where: {
        tourId,
        week,
      },
    });
  }
}
