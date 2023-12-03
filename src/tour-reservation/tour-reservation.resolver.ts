import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TourReservationService } from './tour-reservation.service';
import { AddTourReservationArgs, DeleteTourReservationArgs } from './dto';

@Resolver()
export class TourReservationResolver {
  constructor(
    private readonly tourReservationService: TourReservationService,
  ) {}

  @Mutation(() => String, { description: '투어 예약 추가' })
  async addTourReservation(@Args() args: AddTourReservationArgs) {
    return this.tourReservationService.addTourReservation(args);
  }

  @Mutation(() => Boolean, { description: '투어 예약 취소' })
  async deleteTourReservation(@Args() args: DeleteTourReservationArgs) {
    return this.tourReservationService.deleteTourReservation(args);
  }
}
