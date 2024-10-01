import { UserRepository } from '../../../application/repository';
import { UserEntity } from '../../../core/entities/user';

export class UserRepositoryImplementation implements UserRepository {
  constructor(private readonly datasource: UserRepository) {}

  create<T>(user: UserEntity<T>): Promise<string> {
    return this.datasource.create<T>(user);
  }

  find<T>({ id, email }: { id?: string; email?: string }): Promise<T | null> {
    return this.datasource.find({ id, email });
  }
}
