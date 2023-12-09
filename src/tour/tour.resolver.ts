import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AddTourArgs, UpdateTourReservationLimitArgs } from './dto';
import { TourService } from './tour.service';
import { RequestInfo, Roles } from '../common/decorator';
import { Role } from '../auth/enum';
import { IRequest } from '../common/interface';

@Resolver()
export class TourResolver {
  constructor(private readonly tourService: TourService) {}

  @Roles(Role.USER)
  @Mutation(() => Boolean, { description: '투어 추가' })
  async addTour(
    @Args() args: AddTourArgs,
    @RequestInfo() req: Required<IRequest>,
  ) {
    return this.tourService.addTour(req.user.id, args.title);
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
