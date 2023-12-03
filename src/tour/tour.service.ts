import * as uuid from 'uuid';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TourRepository } from './repository';

@Injectable()
export class TourService {
  constructor(private readonly tourRepository: TourRepository) {}

  async getTourById(id: number) {
    return this.tourRepository.getOneById(id);
  }

  async checkTourByToken(token: string) {
    const tour = await this.tourRepository.getOneByToken(token);
    if (!tour) {
      throw new NotFoundException('투어 상품이 존재하지 않습니다.');
    }

    const toursCount = await this.tourRepository.getManyByToken(token);

    const newToken = uuid.v4();
    await this.tourRepository.updateTourToken(tour.id, newToken);

    return !!toursCount;
  }

  async updateTourReservationLimit(id: number, reservationLimit: number) {
    const tour = await this.tourRepository.getOneById(id);
    if (!tour) {
      throw new NotFoundException('투어 상품이 존재하지 않습니다.');
    }

    return this.tourRepository.updateTourReservationLimit(id, reservationLimit);
  }
}
