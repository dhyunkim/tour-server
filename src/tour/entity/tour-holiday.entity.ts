import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class TourHoliday {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  tourId: number;

  @Field()
  @Column({ length: 15, nullable: true })
  week?: string;

  @Field()
  @Column({ nullable: true })
  day?: Date;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
