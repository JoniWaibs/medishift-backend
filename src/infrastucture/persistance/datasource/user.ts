import { UserDatasource } from '../../../application/datasources';
import { UserEntity } from '../../../core/entities/user';
import { AppError } from '../../../shared/errors/custom.error';
import { User } from '../schemas/user';

export class MongoDBDatasource implements UserDatasource {
  async create<T>(user: UserEntity<T>): Promise<string> {         
    try {
      const userCreated = await User.create(user.data);

      return userCreated.id as string;
    } catch (error: unknown) {
      throw AppError.internalServer(`User was not created in MongoDDBB - ${error}`);
    }
  }
}
