import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HolidayType } from '../enum';

@ObjectType()
@Entity()
export class TourHoliday {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  tourId: number;

  @Field(() => HolidayType)
  @Column({ name: 'type', type: 'enum', enum: HolidayType })
  type: HolidayType;

  @Field()
  @Column({ length: 15 })
  holiday: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
