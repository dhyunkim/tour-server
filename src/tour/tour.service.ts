import { Injectable } from '@nestjs/common';
import { TourRepository } from './repository';

@Injectable()
export class TourService {
  constructor(private readonly tourRepository: TourRepository) {}

  async getTourById(tourId: number) {
    return this.tourRepository.getOneById(tourId);
  }
}
