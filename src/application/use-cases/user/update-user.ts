import { Patient, UserBasicInfo } from '../../../core/models';
import { UserRepository } from '../../repository';

export interface UpdateUserUseCase {
  executeByPatient: <T extends Patient>({ id, userData }: { id: string; userData: T }) => Promise<UserBasicInfo | null>;
}

export class UpdateUser implements UpdateUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async executeByPatient<T extends Patient>({ id, userData }: { id: string; userData: T }): Promise<UserBasicInfo | null> {
    return await this.repository.updatePatient({ id, userData });
  }
}
