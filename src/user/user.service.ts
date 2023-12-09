import { Injectable } from '@nestjs/common';
import { IAddUser } from './interface';
import { UserRepository } from './repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * 이메일로 유저를 조회하는 함수.
   */
  async getUserByEmail(email: string) {
    return this.userRepository.getOneByEmail(email);
  }

  /**
   * 유저를 추가하는 함수.
   */
  async addUser(args: IAddUser) {
    return this.userRepository.add(args);
  }
}
