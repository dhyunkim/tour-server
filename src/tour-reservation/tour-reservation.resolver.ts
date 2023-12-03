import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TourReservationService } from './tour-reservation.service';
import {
  AddTourReservationArgs,
  AvailableDatesForReservationArgs,
  DeleteTourReservationArgs,
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

  @Mutation(() => String, { description: '투어 예약 추가' })
  async addTourReservation(@Args() args: AddTourReservationArgs) {
    return this.tourReservationService.addTourReservation(args);
  }

  @Mutation(() => Boolean, { description: '투어 예약 취소' })
  async deleteTourReservation(@Args() args: DeleteTourReservationArgs) {
    return this.tourReservationService.deleteTourReservation(args);
  }
}
