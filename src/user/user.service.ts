import { Injectable } from '@nestjs/common';
import { IAddUser } from './interface';
import { UserRepository } from './repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserByEmail(email: string) {
    return this.userRepository.getOneByEmail(email);
  }

  async addUser(args: IAddUser) {
    return this.userRepository.add(args);
  }
}
