import { Module } from '@nestjs/common';
import { SellerResolver } from './seller.resolver';

@Module({
  providers: [SellerResolver],
})
export class SellerModule {}
