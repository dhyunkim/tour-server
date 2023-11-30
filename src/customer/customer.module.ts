import { Module } from '@nestjs/common';
import { CustomerResolver } from './customer.resolver';

@Module({
  providers: [CustomerResolver],
})
export class CustomerModule {}
