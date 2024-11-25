import { UserRepository } from '../../../../application/repository';
import { UserEntity } from '../../../../core/entities/user';
import { Patient, Doctor, UserBasicInfo } from '../../../../core/models';

export class UserRepositoryImplementation implements UserRepository {
  constructor(private readonly datasource: UserRepository) {}
  createDoctor<T extends Doctor>(user: UserEntity<T>): Promise<UserBasicInfo> {
    return this.datasource.createDoctor<T>(user);
  }
  findDoctor<T extends Doctor>({ id, email }: { id?: string; email?: string }): Promise<T | null> {
    return this.datasource.findDoctor({ id, email });
  }

  createPatient<T extends Patient>(userData: UserEntity<T>): Promise<UserBasicInfo> {
    return this.datasource.createPatient<T>(userData);
  }
  deletePatient(id: string): Promise<boolean> {
    return this.datasource.deletePatient(id);
  }

  search<T extends Patient>({ search, id }: { search?: string; id?: string }): Promise<T[] | []> {
    return this.datasource.search({ search, id });
  }

  updateMany({ attributes, type }: { attributes: Record<string, unknown>, type: 'doctor' | 'patient' }): Promise<boolean> {
    return this.datasource.updateMany({ attributes, type });
  }

  update<T>({ id, userData, type }: { id: string; userData: T, type: 'doctor' | 'patient' }): Promise<UserBasicInfo | null> {
    return this.datasource.update({ id, userData, type });
  }
}
