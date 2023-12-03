import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Tour {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Index('userId')
  @Field(() => Int)
  @Column()
  userId: number;

  @Field()
  @Column({ length: 250 })
  title: string;

  @Field()
  @Column({ default: 5 })
  reservationLimit: number;

  @Index('token')
  @Field()
  @Column({ length: 50 })
  token: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
