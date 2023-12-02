import { Module } from '@nestjs/common';
import { CustomerResolver } from './customer.resolver';
import { CustomerService } from './customer.service';
import { TourModule } from '../tour/tour.module';

@Module({
  imports: [TourModule],
  providers: [CustomerResolver, CustomerService],
})
export class CustomerModule {}
