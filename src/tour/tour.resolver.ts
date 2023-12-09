import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AddTourArgs, UpdateTourReservationLimitArgs } from './dto';
import { TourService } from './tour.service';

@Resolver()
export class TourResolver {
  constructor(private readonly tourService: TourService) {}

  @Mutation(() => Boolean, { description: '투어 예약 제한 수정' })
  async addTour(@Args() args: AddTourArgs) {
    return this.tourService.addTour(args.userId, args.title);
  }

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
