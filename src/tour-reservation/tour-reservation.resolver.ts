import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TourReservationService } from './tour-reservation.service';
import { AddTourReservationArgs } from './dto';

@Resolver()
export class TourReservationResolver {
  constructor(
    private readonly tourReservationService: TourReservationService,
  ) {}

  @Mutation(() => Boolean)
  async addTourReservation(@Args() args: AddTourReservationArgs) {
    return this.tourReservationService.addTourReservation(args);
  }

  @Query(() => Boolean)
  async testResolver() {
    return true;
  }
}
