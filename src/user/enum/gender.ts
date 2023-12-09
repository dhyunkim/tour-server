import { registerEnumType } from '@nestjs/graphql';

export enum Gender {
  FEMALE = 'FEMALE',
  MALE = 'MALE',
}

registerEnumType(Gender, { name: 'Gender' });
