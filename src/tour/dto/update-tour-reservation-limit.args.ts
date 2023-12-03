import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, Min } from 'class-validator';

@ArgsType()
export class UpdateTourReservationLimitArgs {
  @Min(1)
  @IsInt()
  @Field(() => Int)
  id: number;

  @Min(1)
  @IsInt()
  @Field(() => Int)
  reservationLimit: number;
}
