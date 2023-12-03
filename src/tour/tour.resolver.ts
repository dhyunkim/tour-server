import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TourService } from './tour.service';
import { UpdateTourReservationLimitArgs } from './dto';

@Resolver()
export class TourResolver {
  constructor(private readonly tourService: TourService) {}

  @Mutation(() => Boolean, { description: '투어 예약 제한 수정' })
  async updateTourReservationLimit(
    @Args() args: UpdateTourReservationLimitArgs,
  ) {
    return this.tourService.updateTourReservationLimit(
      args.id,
      args.reservationLimit,
    );
  }
}
