import { ArgsType, Field, Int } from '@nestjs/graphql';
import {
  IsDateString,
  IsInt,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

@ArgsType()
export class AvailableDatesByMonthForReservationArgs {
  @Min(1)
  @IsInt()
  @Field(() => Int)
  tourId: number;

  @MaxLength(7, { message: '월을 정확하게 입력해주세요. e.g) 2023-12' })
  @MinLength(7, { message: '월을 정확하게 입력해주세요. e.g) 2023-12' })
  @IsDateString({ strict: true, strictSeparator: true })
  @Field({ description: '조회 월 입력 e.g) 2023-12' })
  month: string;
}
