import { EntityRepository, Repository } from 'typeorm';
import { Tour } from '../entity';

@EntityRepository(Tour)
export class TourRepository extends Repository<Tour> {
  async getCountByToken(token: string) {
    return this.createQueryBuilder('tour')
      .innerJoinAndSelect('tour.tourReservations', 'tourReservation')
      .where('tour.token = :token', { token })
      .getCount();
  }

  async getOneById(id: number) {
    return this.findOne(id);
  }

  async getOneByToken(token: string) {
    return this.findOne({ where: { token } });
  }

  async updateTourToken(id: number, token: string) {
    const updateResult = await this.update({ id }, { token });
    return updateResult.affected ? true : false;
  }

  async updateTourReservationLimit(id: number, reservationLimit: number) {
    const updateResult = await this.update({ id }, { reservationLimit });
    return updateResult.affected ? true : false;
  }
}
