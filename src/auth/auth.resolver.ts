import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupArgs, SignupOutput } from './dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignupOutput)
  async signup(@Args() args: SignupArgs) {
    return this.authService.signup(args);
  }
}
