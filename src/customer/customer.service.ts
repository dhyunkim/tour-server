import { BadRequestException, Injectable } from '@nestjs/common';
import { TourService } from '../tour/tour.service';
import { IAddTourReservation } from './interface';
import * as dayjs from 'dayjs';

@Injectable()
export class CustomerService {
  constructor(private readonly tourService: TourService) {}

  async addTourReservation(args: IAddTourReservation) {
    const { tourId, reservedAt } = args;

    const tourWeekHoliday = await this.tourService.getTourReservationByWeek({
      tourId,
      week: dayjs(reservedAt).format('dddd'), // 입력받은 요일을 변환 e.g) 2023-12-31 => Sunday
    });
    if (tourWeekHoliday) {
      throw new BadRequestException('해당 요일은 투어 휴일입니다.');
    }

    return true;
  }
}
