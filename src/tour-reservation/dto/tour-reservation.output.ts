import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TourReservationOutput {
  @Field()
  token: string;
}
