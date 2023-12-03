import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsDateString, IsInt, Min } from 'class-validator';

@ArgsType()
export class AddTourReservationArgs {
  @Min(1)
  @IsInt()
  @Field(() => Int)
  customerId: number;

  @Min(1)
  @IsInt()
  @Field(() => Int)
  tourId: number;

  @IsDateString({ strict: true, strictSeparator: true })
  @Field({ description: '예약 날짜 입력 e.g) 2023-12-12' })
  reservedAt: string;
}
