import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsDateString, IsInt, Length, Min } from 'class-validator';

@ArgsType()
export class AvailableDatesByMonthForReservationArgs {
  @Min(1)
  @IsInt()
  @Field(() => Int)
  tourId: number;

  @Length(7)
  @IsDateString({ strict: true, strictSeparator: true })
  @Field({ description: '조회 월 입력 e.g) 2023-12' })
  month: string;
}
