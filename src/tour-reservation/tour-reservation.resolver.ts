import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TourReservationService } from './tour-reservation.service';
import {
  AddTourReservationArgs,
  AvailableDatesForReservationArgs,
  DeleteTourReservationArgs,
  TourReservationByTokenArgs,
} from './dto';

@Resolver()
export class TourReservationResolver {
  constructor(
    private readonly tourReservationService: TourReservationService,
  ) {}

  @Query(() => [String], {
    description: '월 단위로 예약 가능한 날짜 목록 조회',
  })
  async availableDatesForReservation(
    @Args() args: AvailableDatesForReservationArgs,
  ) {
    return this.tourReservationService.getAvailableDates(
      args.tourId,
      args.month,
    );
  }

  @Query(() => Boolean, {
    description: '토큰으로 고객의 해당 투어 예약 여부 확인',
  })
  async reservationByToken(@Args() args: TourReservationByTokenArgs) {
    return this.tourReservationService.getReservationByToken(
      args.tourId,
      args.token,
    );
  }

  @Mutation(() => String, { description: '투어 예약 추가' })
  async addTourReservation(@Args() args: AddTourReservationArgs) {
    return this.tourReservationService.addTourReservation(args);
  }

  @Mutation(() => Boolean, { description: '투어 예약 취소' })
  async deleteTourReservation(@Args() args: DeleteTourReservationArgs) {
    return this.tourReservationService.deleteTourReservation(args);
  }
}
