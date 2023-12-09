import { Injectable, NotFoundException } from '@nestjs/common';
import { TourRepository } from './repository';

@Injectable()
export class TourService {
  constructor(private readonly tourRepository: TourRepository) {}

  async getTourById(id: number) {
    return this.tourRepository.getOneById(id);
  }

  async addTour(userId: number, title: string) {
    const tour = await this.tourRepository.add(userId, title);
    return tour.id;
  }

  async updateTour(id: number, title: string) {
    const tour = await this.tourRepository.getOneById(id);
    if (!tour) {
      throw new NotFoundException('투어 상품이 존재하지 않습니다.');
    }

    return this.tourRepository.updateTour(id, title);
  }

  async removeTour(id: number) {
    const tour = await this.tourRepository.getOneById(id);
    if (!tour) {
      throw new NotFoundException('투어 상품이 존재하지 않습니다.');
    }

    return this.tourRepository.removeById(id);
  }

  async updateTourReservationLimit(id: number, reservationLimit: number) {
    const tour = await this.tourRepository.getOneById(id);
    if (!tour) {
      throw new NotFoundException('투어 상품이 존재하지 않습니다.');
    }

    return this.tourRepository.updateTourReservationLimit(id, reservationLimit);
  }
}
