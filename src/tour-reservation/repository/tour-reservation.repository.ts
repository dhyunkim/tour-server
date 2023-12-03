import { EntityRepository, Repository } from 'typeorm';
import { TourReservation } from '../entity';
import { IAdd } from './inteface';

@EntityRepository(TourReservation)
export class TourReservationRepository extends Repository<TourReservation> {
  async getCountByReservationDate(reservationDate: string) {
    return this.count({ where: { reservationDate } });
  }

  async getOneById(id: number) {
    return this.findOne(id);
  }

  async add(args: IAdd) {
    return this.save(this.create(args));
  }

  async deleteTourReservation(id: number) {
    const removeResult = await this.delete(id);
    return removeResult.affected ? true : false;
  }
}
