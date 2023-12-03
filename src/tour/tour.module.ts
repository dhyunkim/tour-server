import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourRepository } from './repository';
import { TourResolver } from './tour.resolver';
import { TourService } from './tour.service';

@Module({
  imports: [TypeOrmModule.forFeature([TourRepository])],
  providers: [TourService, TourResolver],
  exports: [TourService],
})
export class TourModule {}
