import { registerEnumType } from '@nestjs/graphql';

export enum WeekType {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
}
registerEnumType(WeekType, { name: 'WeekType' });
