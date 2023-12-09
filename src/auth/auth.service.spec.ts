import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { MockJwtService, MockUserService } from '../../test/service';
import { ISignup } from './interface';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: MockJwtService(),
        },
        {
          provide: UserService,
          useValue: MockUserService(),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);

    jest.spyOn(service, 'signJsonWebToken').mockReturnValue({
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup()', () => {
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(async (password, userPassword) => {
        if (password === userPassword) {
          return true;
        } else {
          return false;
        }
      });
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => 'hashedPassword');

    it('normal case', async () => {
      // given
      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(undefined);

      const args: ISignup = {
        email: 'test@naver.com',
        password: '12345678',
        name: '김동현',
      };

      // when
      const result = await service.signup(args);

      // then
      expect(userService.getUserByEmail).toHaveBeenCalledWith(args.email);
      expect(userService.getUserByEmail).toHaveBeenCalledTimes(1);
      expect(userService.addUser).toHaveBeenCalledWith({
        ...args,
        password: 'hashedPassword',
      });
      expect(userService.addUser).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });
    });

    it('기존에 가입한 이메일로 회원가입을 하려고하면 에러가 발생해야 한다.', async () => {
      // given
      const args: ISignup = {
        email: 'test@naver.com',
        password: '12345678',
        name: '김동현',
      };

      // when - then
      await expect(service.signup(args)).rejects.toThrow(
        new BadRequestException('이미 존재하는 이메일입니다.'),
      );
      expect(userService.getUserByEmail).toHaveBeenCalledWith(args.email);
      expect(userService.getUserByEmail).toHaveBeenCalledTimes(1);
      expect(userService.addUser).not.toHaveBeenCalled();
    });
  });
});
