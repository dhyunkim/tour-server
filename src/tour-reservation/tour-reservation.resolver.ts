import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TourReservationService } from './tour-reservation.service';
import {
  AddTourReservationArgs,
  AvailableDatesForReservationArgs,
  DeleteTourReservationArgs,
  TourReservationByTokenArgs,
} from './dto';
import { RequestInfo, Roles } from '../common/decorator';
import { Role } from '../auth/enum';
import { IRequest } from '../common/interface';

@Resolver()
export class TourReservationResolver {
  constructor(
    private readonly tourReservationService: TourReservationService,
  ) {}

  @Roles(Role.USER)
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

  @Roles(Role.USER)
  @Query(() => Boolean, {
    description: '토큰으로 고객의 해당 투어 예약 여부 확인',
  })
  async reservationByToken(@Args() args: TourReservationByTokenArgs) {
    return this.tourReservationService.getReservationByToken(
      args.tourId,
      args.token,
    );
  }

  @Roles(Role.USER)
  @Mutation(() => String, { description: '투어 예약 추가' })
  async addTourReservation(
    @Args() args: AddTourReservationArgs,
    @RequestInfo() req: Required<IRequest>,
  ) {
    return this.tourReservationService.addTourReservation({
      ...args,
      userId: req.user.id,
    });
  }

  @Roles(Role.USER)
  @Mutation(() => Boolean, { description: '투어 예약 취소' })
  async deleteTourReservation(@Args() args: DeleteTourReservationArgs) {
    return this.tourReservationService.deleteTourReservation(args);
  }
}
