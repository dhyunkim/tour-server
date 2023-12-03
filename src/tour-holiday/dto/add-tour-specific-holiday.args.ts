import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsDateString, IsInt, Length, Min } from 'class-validator';

@ArgsType()
export class AddTourSpecificHolidayArgs {
  @Min(1)
  @IsInt()
  @Field(() => Int)
  tourId: number;

  @Length(10)
  @IsDateString({ strict: true, strictSeparator: true })
  @Field()
  specific: string;
}
