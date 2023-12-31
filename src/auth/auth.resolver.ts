import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SigninArgs, SigninOutput, SignupArgs, SignupOutput } from './dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignupOutput, { description: '회원가입' })
  async signup(@Args() args: SignupArgs) {
    return this.authService.signup(args);
  }

  @Query(() => SigninOutput, { description: '로그인' })
  async signin(@Args() args: SigninArgs) {
    return this.authService.signin(args.email, args.password);
  }
}
