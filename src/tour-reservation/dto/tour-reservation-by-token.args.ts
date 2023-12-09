import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

@ArgsType()
export class TourReservationByTokenArgs {
  @Min(1)
  @IsInt()
  @Field(() => Int)
  tourId: number;

  @IsNotEmpty()
  @IsUUID()
  @Field()
  token: string;
}
