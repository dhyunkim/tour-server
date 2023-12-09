import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNumber, Min } from 'class-validator';

@ArgsType()
export class RemoveTourArgs {
  @Min(1)
  @IsNumber()
  @Field(() => Int)
  id: number;
}
