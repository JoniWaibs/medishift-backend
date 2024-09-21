import { UserEntity } from '../../core/entities/user';

export abstract class UserDatasource {
  abstract create<T>(user: UserEntity<T>): Promise<string>;
}
