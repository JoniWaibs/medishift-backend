import { UserRepository } from '../../../application/repository';
import { UserEntity } from '../../../core/entities/user';

export class UserRepositoryImplementation implements UserRepository {
  constructor(private readonly datasource: UserRepository) {}

  create<T>(user: UserEntity<T>): Promise<string> {
    return this.datasource.create<T>(user);
  }
}
