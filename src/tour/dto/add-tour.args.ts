import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class AddTourArgs {
  @IsNotEmpty()
  @IsString()
  @Field()
  title: string;
}
