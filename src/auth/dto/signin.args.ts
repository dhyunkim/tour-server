import { Field, ArgsType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@ArgsType()
export class SigninArgs {
  @IsEmail({}, { message: '이메일 형식이어야 합니다.' })
  @IsNotEmpty({ message: '이메일은 필수입니다.' })
  @Field()
  email: string;

  @IsNotEmpty({ message: '비밀번호는 필수입니다.' })
  @MinLength(8, { message: '비밀번호는 8자 이상 입력해주세요.' })
  @IsString()
  @Field()
  password: string;
}
