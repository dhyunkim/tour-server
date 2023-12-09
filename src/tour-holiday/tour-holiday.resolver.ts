import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { TourHolidayService } from './tour-holiday.service';
import { AddTourSpecificHolidayArgs, AddTourWeekHolidayArgs } from './dto';
import { Roles } from '../common/decorator';
import { Role } from '../auth/enum';

@Resolver()
export class TourHolidayResolver {
  constructor(private readonly tourHolidayService: TourHolidayService) {}

  @Roles(Role.USER)
  @Mutation(() => Int, { description: '특정 요일 휴일 추가' })
  async addTourWeekHoliday(@Args() args: AddTourWeekHolidayArgs) {
    return this.tourHolidayService.addTourWeekHoliday(args);
  }

  @Roles(Role.USER)
  @Mutation(() => Int, { description: '특정 날짜 휴일 추가' })
  async addTourSpecificHoliday(@Args() args: AddTourSpecificHolidayArgs) {
    return this.tourHolidayService.addTourSpecificHoliday(args);
  }
}
