import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ISignup } from './interface';
import { UserService } from '../user/user.service';
import { Role } from './enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  /**
   * 이메일 회원가입을 할 때 사용하는 함수.
   */
  async signup(args: ISignup) {
    const existsUser = await this.userService.getUserByEmail(args.email);
    if (existsUser) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(args.password, 10);

    const newUser = await this.userService.addUser({
      ...args,
      password: hashedPassword,
    });
    return this.signJsonWebToken(newUser.id, Role.USER);
  }

  /**
   * 로그인하는 함수.
   */
  async signin(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('회원가입한 유저가 아닙니다.');
    }

    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      throw new BadRequestException('비밀번호가 잘 못 입력되었습니다.');
    }

    return this.signJsonWebToken(user.id, Role.USER);
  }

  /**
   * JWT를 발행하는 함수. accessToken은 만료가 3일이고 refreshToken은 7일이다.
   */
  signJsonWebToken(userId: number, role: Role) {
    const accessToken = this.jwtService.sign(
      { _id: +userId, _role: role },
      { expiresIn: '3d' },
    );

    const refreshToken = this.jwtService.sign(
      { _id: +userId, _role: role, _refresh: true },
      { expiresIn: '7d' },
    );

    return { accessToken, refreshToken };
  }
}
