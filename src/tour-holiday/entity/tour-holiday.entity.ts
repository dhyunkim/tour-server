import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WeekType } from '../enum';
import { Tour } from '../../tour/entity';

@ObjectType()
@Entity()
export class TourHoliday {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  tourId: number;

  @Field(() => WeekType)
  @Column({ name: 'week', type: 'enum', enum: WeekType, nullable: true })
  week?: WeekType;

  @Field()
  @Column({ length: 15, nullable: true })
  specific?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Tour, (entity) => entity.tourHolidays, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'tourId' })
  tour: Tour;
}
