import { EntityRepository, Repository } from 'typeorm';

import { TourHoliday } from '../entity';

@EntityRepository(TourHoliday)
export class TourHolidayRepository extends Repository<TourHoliday> {}
