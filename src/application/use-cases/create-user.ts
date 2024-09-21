import { UserEntity } from '../../core/entities/user';
import { UserRepository } from '../repository';

export interface CreateUserUseCase<T> {
  execute: (userData: T) => Promise<string>;
}

export class CreateUser<T> implements CreateUserUseCase<T> {
  constructor(private readonly repository: UserRepository) {}

  async execute(userData: T): Promise<string> {
    return await this.repository.create(new UserEntity<T>(userData));
  }
}
