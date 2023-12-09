import { ArgsType, Field, Int } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Gender } from '../../user/enum';

@ArgsType()
export class SignupArgs {
  @IsEmail()
  @Field()
  email: string;

  @MinLength(8, { message: '비밀번호는 8자 이상으로 입력해주세요' })
  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;

  @IsOptional()
  @IsEnum(Gender)
  @Field(() => Gender, { nullable: true })
  gender?: Gender;

  @IsOptional()
  @IsInt()
  @Field(() => Int, { nullable: true })
  birthYear?: number;
}
