import { Query, Resolver } from '@nestjs/graphql';
import { CustomerService } from './customer.service';

@Resolver()
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Query(() => Boolean)
  async addTourReservation() {
    return true;
  }
}
