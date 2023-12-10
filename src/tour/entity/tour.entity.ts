import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TourReservation } from '../../tour-reservation/entity';
import { User } from '../../user/entity';
import { TourHoliday } from '../../tour-holiday/entity';

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

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => TourReservation, (entity) => entity.tour)
  tourReservations: TourReservation[];

  @OneToMany(() => TourHoliday, (entity) => entity.tour)
  tourHolidays: TourHoliday[];

  @ManyToOne(() => User, (entity) => entity.tours, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}
