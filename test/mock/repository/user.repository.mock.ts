import { User } from '../../../src/user/entity';

export const MockUserRepository = () => ({
  getOneByEmail: jest.fn().mockResolvedValue(new User()),
  add: jest.fn().mockResolvedValue(new User()),
});
