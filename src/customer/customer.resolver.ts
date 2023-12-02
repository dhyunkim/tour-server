import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CustomerService } from './customer.service';
import { AddTourReservationArgs } from './dto';

@Resolver()
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Mutation(() => Boolean)
  async addTourReservation(@Args() args: AddTourReservationArgs) {
    return this.customerService.addTourReservation(args);
  }

  @Query(() => Boolean)
  async testResolver() {
    return true;
  }
}
