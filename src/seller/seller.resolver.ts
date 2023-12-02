import { Resolver } from '@nestjs/graphql';
import { SellerService } from './seller.service';

@Resolver()
export class SellerResolver {
  constructor(private readonly sellerService: SellerService) {}
}
