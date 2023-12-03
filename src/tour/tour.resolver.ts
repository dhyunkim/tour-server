import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TourByTokenArgs, UpdateTourReservationLimitArgs } from './dto';
import { TourService } from './tour.service';

@Resolver()
export class TourResolver {
  constructor(private readonly tourService: TourService) {}

  @Query(() => Boolean, {
    description: '토큰으로 투어에 고객이 예약했는지 여부 확인',
  })
  async checkTourByToken(@Args() args: TourByTokenArgs) {
    return this.tourService.checkTourByToken(args.token);
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
