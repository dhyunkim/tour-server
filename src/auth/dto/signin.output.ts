import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SigninOutput {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
