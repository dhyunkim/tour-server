import { User } from '../../../src/user/entity';

export const MockUserService = () => ({
  getUserByEmail: jest.fn().mockResolvedValue(new User()),
  addUser: jest.fn().mockResolvedValue(new User()),
});
