import { Module } from '@nestjs/common';
import { TourService } from './tour.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourRepository } from './repository';

@Module({
  imports: [TypeOrmModule.forFeature([TourRepository])],
  providers: [TourService],
  exports: [TourService],
})
export class TourModule {}
