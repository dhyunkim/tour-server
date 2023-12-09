import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignupOutput {
  @Field()
  accessToken: string;

  @Field({ nullable: true })
  refreshToken?: string;
}
