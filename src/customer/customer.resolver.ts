import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class CustomerResolver {
  @Query(() => Boolean)
  async testResolver() {
    return true;
  }
}
