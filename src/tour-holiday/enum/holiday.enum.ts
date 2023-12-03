import { registerEnumType } from '@nestjs/graphql';

export enum HolidayType {
  WEEK = 'week', // 요일 휴일
  SPECIFIC = 'specific', // 특정 휴일
}
registerEnumType(HolidayType, { name: 'HolidayType' });
