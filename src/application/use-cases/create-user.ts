import { UserEntity } from '../../core/entities/user';
import { Doctor, Patient, UserBasicInfo } from '../../core/models';
import { UserRepository } from '../repository';

export interface CreateUserUseCase {
  executeByDoctor: <T extends Doctor>(userData: T) => Promise<UserBasicInfo>;
  executeByPatient: <T extends Patient>(userData: T) => Promise<UserBasicInfo>;
}

export class CreateUser implements CreateUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async executeByDoctor<T extends Doctor>(userData: T): Promise<UserBasicInfo> {
    return await this.repository.createDoctor(new UserEntity<T>(userData));
  }

  async executeByPatient<T extends Patient>(userData: T): Promise<UserBasicInfo> {
    return await this.repository.createPatient(new UserEntity<T>(userData));
  }
}
