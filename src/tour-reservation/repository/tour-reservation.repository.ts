import { EntityRepository, Repository } from 'typeorm';
import { TourReservation } from '../entity';
import {
  IAdd,
  IGetReservationDatesAndCount,
  IGetReservationDatesAndCountResult,
} from './inteface';

@EntityRepository(TourReservation)
export class TourReservationRepository extends Repository<TourReservation> {
  async getOneByToken(tourId: number, token: string) {
    return this.findOne({ where: { tourId, token } });
  }

  async getReservationDatesAndCount(
    args: IGetReservationDatesAndCount,
  ): Promise<IGetReservationDatesAndCountResult[]> {
    const { tourId, month, lastDay } = args;
    return this.createQueryBuilder('tourReservation')
      .select(
        'tourReservation.reservationDate AS reservationDate, COUNT(tourReservation.reservationDate) AS COUNT',
      )
      .where('tourReservation.tourId = :tourId', { tourId })
      .groupBy('tourReservation.reservationDate')
      .having('tourReservation.reservationDate >= :firstDay', {
        firstDay: `${month}-01`,
      })
      .andHaving('tourReservation.reservationDate <= :lastDay', {
        lastDay: `${month}-${lastDay}`,
      })
      .orderBy('tourReservation.reservationDate', 'ASC')
      .getRawMany();
  }

  async getCountByReservationDate(reservationDate: string) {
    return this.count({ where: { reservationDate } });
  }

  async getOneById(id: number) {
    return this.findOne(id);
  }

  async add(args: IAdd) {
    return this.save(this.create(args));
  }

  async updateTourToken(id: number, token: string) {
    const updateResult = await this.update({ id }, { token });
    return updateResult.affected ? true : false;
  }

  async deleteTourReservation(id: number) {
    const removeResult = await this.delete(id);
    return removeResult.affected ? true : false;
  }
}
