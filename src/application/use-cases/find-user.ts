import { Doctor, Patient } from '../../core/models';
import { UserRepository } from '../repository';

export interface FindUserUseCase {
  executeByDoctor: <T extends Doctor>({ id, email }: { id?: string; email?: string }) => Promise<T | null>;
  executeByPatient: <T extends Patient>({ identificationNumber, id }: { identificationNumber?: number, id?: string }) => Promise<T | null>;
}

export class FindUser implements FindUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async executeByDoctor<T extends Doctor>({ id, email }: { id?: string; email?: string }): Promise<T | null> {
    return await this.repository.findByDoctor({ id, email });
  }

  async executeByPatient<T extends Patient>({ identificationNumber, id }: { identificationNumber?: number, id?: string } ): Promise<T | null> {    
    return await this.repository.findByPatient({ identificationNumber, id });
  }
}
