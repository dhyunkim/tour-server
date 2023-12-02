import { EntityRepository, Repository } from 'typeorm';
import { TourHoliday } from '../entity';
import { IGetOneByDay, IGetOneByWeek } from './inteface';

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

  async getOneByDay(args: IGetOneByDay) {
    const { tourId, day } = args;
    return this.findOne({
      where: {
        tourId,
        day,
      },
    });
  }
}
