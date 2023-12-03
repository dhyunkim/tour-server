import { EntityRepository, Repository } from 'typeorm';
import { Tour } from '../entity';

@EntityRepository(Tour)
export class TourRepository extends Repository<Tour> {
  async getOneById(id: number) {
    return this.findOne(id);
  }

  async updateTourReservationLimit(id: number, reservationLimit: number) {
    const updateResult = await this.update({ id }, { reservationLimit });
    return updateResult.affected ? true : false;
  }
}
