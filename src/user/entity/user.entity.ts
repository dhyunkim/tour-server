import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Gender } from '../enum';
import { Tour } from '../../tour/entity';
import { TourReservation } from '../../tour-reservation/entity';

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 20 })
  name: string;

  @Field()
  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Field(() => Gender)
  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender?: Gender;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  birthYear?: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Tour, (entity) => entity.user)
  tours: Tour[];

  @OneToMany(() => TourReservation, (entity) => entity.user)
  tourReservations: TourReservation[];
}
