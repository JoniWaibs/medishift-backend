import { UserDatasource } from '../../../application/datasources';
import { UserEntity } from '../../../core/entities/user';
import { AppError } from '../../../shared/errors/custom.error';
import { User } from '../schemas/user';

export class MongoDBDatasource implements UserDatasource {
  async create<T>(user: UserEntity<T>): Promise<string> {
    try {
      const userCreated = await User.create<T>(user.data);

      return userCreated.id as string;
    } catch (error: unknown) {
      throw AppError.internalServer(`User was not created in MongoDDBB - ${error}`);
    }
  }
  async find<T>({ id, email }: { id?: string; email?: string }): Promise<T | null> {
    let user = null;
    try {
      if (id) {
        user = await User.findById(id);
      } else {
        user = await User.findOne({ 'contactInfo.email': email });
      }
      return user as T;
    } catch (error: unknown) {
      throw AppError.internalServer(`User was not founded in MongoDDBB - ${error}`);
    }
  }
}
