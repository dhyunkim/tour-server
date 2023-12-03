import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TourReservationService } from './tour-reservation.service';
import { AddTourReservationArgs } from './dto';

@Resolver()
export class TourReservationResolver {
  constructor(
    private readonly tourReservationService: TourReservationService,
  ) {}

  @Mutation(() => String, { description: '투어 예약 추가' })
  async addTourReservation(@Args() args: AddTourReservationArgs) {
    return this.tourReservationService.addTourReservation(args);
  }
}
