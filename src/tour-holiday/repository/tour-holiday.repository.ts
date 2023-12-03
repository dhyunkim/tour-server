import { EntityRepository, Repository } from 'typeorm';
import { TourHoliday } from '../entity';
import { IAddSpecificHoliday, IAddWeekHoliday } from './interface';
import { WeekType } from '../enum';

@EntityRepository(TourHoliday)
export class TourHolidayRepository extends Repository<TourHoliday> {
  async getManyByTourId(tourId: number) {
    return this.find({ where: { tourId } });
  }

  async getOneByWeek(tourId: number, week: WeekType) {
    return this.findOne({
      where: {
        tourId,
        week,
      },
    });
  }

  async getOneBySpecific(tourId: number, specific: string) {
    return this.findOne({
      where: {
        tourId,
        specific,
      },
    });
  }

  async addWeekHoliday(args: IAddWeekHoliday) {
    return this.save(this.create(args));
  }

  async addSpecificHoliday(args: IAddSpecificHoliday) {
    return this.save(this.create(args));
  }
}
