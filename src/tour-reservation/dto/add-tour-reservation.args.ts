import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsDateString, IsInt, Length, Min } from 'class-validator';

@ArgsType()
export class AddTourReservationArgs {
  @Min(1)
  @IsInt()
  @Field(() => Int)
  tourId: number;

  @Length(10)
  @IsDateString({ strict: true, strictSeparator: true })
  @Field({ description: '예약 날짜 입력 e.g) 2023-12-12' })
  reservationDate: string;
}
