import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, Min } from 'class-validator';
import { WeekType } from '../enum';

@ArgsType()
export class AddTourWeekHolidayArgs {
  @Min(1)
  @IsInt()
  @Field(() => Int)
  tourId: number;

  @IsEnum(WeekType)
  @Field(() => WeekType)
  week: WeekType;
}
