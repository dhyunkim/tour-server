import { EntityRepository, Repository } from 'typeorm';
import { TourReservation } from '../entity';
import {
  IAdd,
  IGetReservationDatesAndCount,
  IGetReservationDatesAndCountResult,
  IUpdateTourToken,
} from './inteface';

@EntityRepository(TourReservation)
export class TourReservationRepository extends Repository<TourReservation> {
  async getOneById(id: number) {
    return this.findOne(id);
  }

  async getOneByToken(tourId: number, token: string) {
    return this.findOne({ where: { tourId, token } });
  }

  async getOneByUser(tourId: number, userId: number, reservationDate: string) {
    return this.findOne({ where: { tourId, userId, reservationDate } });
  }

  async getReservationDatesAndCount(
    args: IGetReservationDatesAndCount,
  ): Promise<IGetReservationDatesAndCountResult[]> {
    const { tourId, month, lastDay } = args;
    return this.createQueryBuilder('tourReservation')
      .select(
        'tourReservation.reservationDate AS reservationDate, COUNT(tourReservation.reservationDate) AS count',
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

  async add(args: IAdd) {
    return this.save(this.create(args));
  }

  async updateTourToken(args: IUpdateTourToken) {
    const { tourId, userId, token } = args;
    const updateResult = await this.update({ tourId, userId }, { token });
    return updateResult.affected ? true : false;
  }

  async deleteTourReservation(id: number) {
    const removeResult = await this.delete(id);
    return removeResult.affected ? true : false;
  }
}
