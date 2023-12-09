import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entity';
import { IAdd } from './interface';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getOneByEmail(email: string) {
    return this.findOne({ where: { email } });
  }

  async add(args: IAdd) {
    return this.save(this.create(args));
  }
}
