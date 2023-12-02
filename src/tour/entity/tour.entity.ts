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
@Entity('tour')
export class Tour {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Index('sellerId')
  @Field(() => Int)
  @Column()
  sellerId: number;

  @Field()
  @Column({ length: 250 })
  title: string;

  @Field()
  @Column({ default: 5 })
  reservationLimit: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
