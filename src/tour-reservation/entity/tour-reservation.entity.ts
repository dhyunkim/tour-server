import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Tour } from '../../tour/entity';

@ObjectType()
@Unique('unique_userId_tourId', ['userId', 'tourId'])
@Entity()
export class TourReservation {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  userId: number;

  @Index('tourId')
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

  @ManyToOne(() => Tour, (entity) => entity.tourReservations, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'tourId' })
  tour: Tour;
}
