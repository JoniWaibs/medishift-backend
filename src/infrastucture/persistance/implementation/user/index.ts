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
  updatePatient<T extends Patient>({ id, userData }: { id: string; userData: T }): Promise<UserBasicInfo | null> {
    return this.datasource.updatePatient({ id, userData });
  }

  search<T extends Patient>({ search, id }: { search?: string; id?: string }): Promise<T[] | []> {
    return this.datasource.search({ search, id });
  }
}
