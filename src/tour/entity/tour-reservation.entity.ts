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

  @Index('customerId')
  @Field(() => Int)
  @Column()
  customerId: number;

  @Column()
  tourId: number;

  @Field()
  @Column()
  reservedAt: Date;

  @Index('token')
  @Field()
  @Column()
  token: string;

  @Field()
  @Column({ default: true })
  tokenStatus: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
