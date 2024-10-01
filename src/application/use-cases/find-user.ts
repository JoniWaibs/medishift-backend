import { UserRepository } from '../repository';

export interface FindUserUseCase<T> {
  execute: ({ id, email }: { id?: string; email?: string }) => Promise<T | null>;
}

export class FindUser<T> implements FindUserUseCase<T> {
  constructor(private readonly repository: UserRepository) {}

  async execute({ id, email }: { id?: string; email?: string }): Promise<T | null> {
    return await this.repository.find({ id, email });
  }
}
