import { Injectable, NotFoundException } from '@nestjs/common';
import { TourRepository } from './repository';

@Injectable()
export class TourService {
  constructor(private readonly tourRepository: TourRepository) {}

  /**
   * ID로 투어를 조회하는 함수.
   */
  async getTourById(id: number) {
    return this.tourRepository.getOneById(id);
  }

  /**
   * 투어를 추가하는 함수.
   */
  async addTour(userId: number, title: string) {
    const tour = await this.tourRepository.add(userId, title);
    return tour.id;
  }

  /**
   * 투어를 수정하는 함수.
   */
  async updateTour(id: number, title: string) {
    const tour = await this.tourRepository.getOneById(id);
    if (!tour) {
      throw new NotFoundException('투어 상품이 존재하지 않습니다.');
    }

    return this.tourRepository.updateTour(id, title);
  }

  /**
   * 투어를 삭제하는 함수.
   */
  async removeTour(id: number) {
    const tour = await this.tourRepository.getOneById(id);
    if (!tour) {
      throw new NotFoundException('투어 상품이 존재하지 않습니다.');
    }

    return this.tourRepository.removeById(id);
  }

  /**
   * 투어의 자동 예약 제한을 수정하는 함수.
   */
  async updateTourReservationLimit(id: number, reservationLimit: number) {
    const tour = await this.tourRepository.getOneById(id);
    if (!tour) {
      throw new NotFoundException('투어 상품이 존재하지 않습니다.');
    }

    return this.tourRepository.updateTourReservationLimit(id, reservationLimit);
  }
}
