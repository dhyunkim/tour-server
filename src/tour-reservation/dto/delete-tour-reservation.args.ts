import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, Min } from 'class-validator';

@ArgsType()
export class DeleteTourReservationArgs {
  @Min(1)
  @IsInt()
  @Field(() => Int)
  id: number;
}
