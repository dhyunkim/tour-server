import { ArgsType, Field, Int } from '@nestjs/graphql';
import {
  IsDateString,
  IsInt,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

@ArgsType()
export class AddTourSpecificHolidayArgs {
  @Min(1)
  @IsInt()
  @Field(() => Int)
  tourId: number;

  @MaxLength(10, { message: '날짜를 정확하게 입력해주세요. e.g) 2023-12-12' })
  @MinLength(10, { message: '날짜를 정확하게 입력해주세요. e.g) 2023-12-12' })
  @IsDateString({ strict: true, strictSeparator: true })
  @Field()
  specific: string;
}
