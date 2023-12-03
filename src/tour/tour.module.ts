import { Module } from '@nestjs/common';
import { TourService } from './tour.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourRepository } from './repository';
import { TourResolver } from './tour.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([TourRepository])],
  providers: [TourService, TourResolver],
  exports: [TourService],
})
export class TourModule {}
