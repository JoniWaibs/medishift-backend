import { UserEntity } from '../../core/entities/user';

export abstract class UserRepository {
  abstract create<T>(user: UserEntity<T>): Promise<string>;
  abstract find<T>({ id, email }: { id?: string; email?: string }): Promise<T | null>;
}
