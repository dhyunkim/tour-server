import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './repository';
import { MockUserRepository } from '../../test/mock/repository';
import { User } from './entity';
import { IAddUser } from './interface';

describe('UserService', () => {
  let service: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: MockUserRepository(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserByEmail()', () => {
    it('normal case', async () => {
      // given
      const user = new User();
      user.id = 1;
      user.name = '인물1';
      user.email = 'test@naver.com';
      jest.spyOn(userRepository, 'getOneByEmail').mockResolvedValue(user);

      const email = 'test@naver.com';

      // when
      const result = await service.getUserByEmail(email);

      // then
      expect(userRepository.getOneByEmail).toHaveBeenCalledWith(email);
      expect(userRepository.getOneByEmail).toHaveBeenCalledTimes(1);
      expect(result).toEqual(user);
    });
  });

  describe('add()', () => {
    it('normal case', async () => {
      // given
      const user = new User();
      user.id = 1;
      user.email = 'test@naver.com';
      user.password = '12345678';
      user.name = '김동현';
      jest.spyOn(userRepository, 'add').mockResolvedValue(user);

      const args: IAddUser = {
        email: 'test@naver.com',
        password: '12345678',
        name: '김동현',
      };

      // when
      const result = await service.addUser(args);

      // then
      expect(userRepository.add).toHaveBeenCalledWith(args);
      expect(userRepository.add).toHaveBeenCalledTimes(1);
      expect(result).toEqual(user);
    });
  });
});
