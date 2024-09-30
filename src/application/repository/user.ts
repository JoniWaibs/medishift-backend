import { UserEntity } from '../../core/entities/user';

export abstract class UserRepository {
  abstract create<T>(user: UserEntity<T>): Promise<string>;
  abstract find<T>(userId: string): Promise<T>;
}
