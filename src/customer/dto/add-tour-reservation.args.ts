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

  @IsDateString()
  @Field()
  reservedAt: string;
}
