import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@ArgsType()
export class TourByTokenArgs {
  @IsNotEmpty()
  @IsUUID()
  @Field()
  token: string;
}
