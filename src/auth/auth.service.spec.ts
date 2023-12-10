import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { MockJwtService, MockUserService } from '../../test/mock/service';
import { ISignup } from './interface';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from '../user/entity';

describe('AuthService', () => {
  let service: AuthService;
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
    userService = module.get<UserService>(UserService);

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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup()', () => {
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
        accessToken: 'token',
        refreshToken: 'token',
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

  describe('signin()', () => {
    it('normal case', async () => {
      // given
      const user = new User();
      user.password = '12345678';
      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(user);

      const email = 'test@naver.com';
      const password = '12345678';

      // when
      const result = await service.signin(email, password);

      // then
      expect(userService.getUserByEmail).toHaveBeenCalledWith(email);
      expect(userService.getUserByEmail).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        accessToken: 'token',
        refreshToken: 'token',
      });
    });

    it('비밀번호가 틀리면 에러가 발생해야 한다.', async () => {
      // given
      const user = new User();
      user.password = '99999999';
      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(user);

      const email = 'test@naver.com';
      const password = '12345678';

      // when - then
      await expect(service.signin(email, password)).rejects.toThrow(
        new BadRequestException('비밀번호가 잘 못 입력되었습니다.'),
      );
      expect(userService.getUserByEmail).toHaveBeenCalledWith(email);
      expect(userService.getUserByEmail).toHaveBeenCalledTimes(1);
    });

    it('회원가입하지 않은 이메일을 입력하면 에러가 발생해야 한다.', async () => {
      // given
      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(undefined);

      const email = 'test@naver.com';
      const password = '12345678';

      // when - then
      await expect(service.signin(email, password)).rejects.toThrow(
        new NotFoundException('회원가입한 유저가 아닙니다.'),
      );
      expect(userService.getUserByEmail).toHaveBeenCalledWith(email);
      expect(userService.getUserByEmail).toHaveBeenCalledTimes(1);
    });
  });
});
