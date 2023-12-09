import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import {
  AddTourArgs,
  UpdateTourArgs,
  UpdateTourReservationLimitArgs,
} from './dto';
import { TourService } from './tour.service';
import { RequestInfo, Roles } from '../common/decorator';
import { Role } from '../auth/enum';
import { IRequest } from '../common/interface';
import { RemoveTourArgs } from './dto/remove-tour.args';

@Resolver()
export class TourResolver {
  constructor(private readonly tourService: TourService) {}

  @Roles(Role.USER)
  @Mutation(() => Int, { description: '투어 추가' })
  async addTour(
    @Args() args: AddTourArgs,
    @RequestInfo() req: Required<IRequest>,
  ) {
    return this.tourService.addTour(req.user.id, args.title);
  }

  @Roles(Role.USER)
  @Mutation(() => Boolean, { description: '투어 수정' })
  async updateTour(@Args() args: UpdateTourArgs) {
    return this.tourService.updateTour(args.id, args.title);
  }

  @Roles(Role.USER)
  @Mutation(() => Boolean, { description: '투어 삭제' })
  async removeTour(@Args() args: RemoveTourArgs) {
    return this.tourService.removeTour(args.id);
  }

  @Roles(Role.USER)
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
