import { UserRepository } from '../repository';

export interface FindUserUseCase<T> {
  execute: (userId: string) => Promise<T>;
}

export class FindUser<T> implements FindUserUseCase<T> {
  constructor(private readonly repository: UserRepository) {}

  async execute(userId: string): Promise<T> {
    return await this.repository.find(userId);
  }
}
