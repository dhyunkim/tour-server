import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TourReservationService } from './tour-reservation.service';
import { AddTourReservationArgs, TourReservationOutput } from './dto';

@Resolver()
export class TourReservationResolver {
  constructor(
    private readonly tourReservationService: TourReservationService,
  ) {}

  @Mutation(() => TourReservationOutput, { description: '투어 예약 추가' })
  async addTourReservation(@Args() args: AddTourReservationArgs) {
    return this.tourReservationService.addTourReservation(args);
  }

  @Query(() => Boolean)
  async testResolver() {
    return true;
  }
}
