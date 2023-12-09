import { BadRequestException, Injectable } from '@nestjs/common';
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
   * 이메일 회원가입을 할 때 사용하는 함수입니다.
   */
  async signup(input: ISignup) {
    const existsUser = await this.userService.getUserByEmail(input.email);
    if (existsUser) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const newUser = await this.userService.addUser({
      ...input,
      password: hashedPassword,
    });
    return this.signJsonWebToken(newUser.id, Role.USER);
  }

  private signJsonWebToken(userId: number, role: Role) {
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
