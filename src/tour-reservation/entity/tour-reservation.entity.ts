import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class TourReservation {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Index('userId')
  @Field(() => Int)
  @Column()
  userId: number;

  @Column()
  tourId: number;

  @Field()
  @Column({ length: 10 })
  reservationDate: string;

  @Index('token')
  @Field()
  @Column({ length: 50 })
  token: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
