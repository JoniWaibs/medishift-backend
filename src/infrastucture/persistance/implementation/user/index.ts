import { UserRepository } from '../../../../application/repository';
import { UserEntity } from '../../../../core/entities/user';
import { Patient, Doctor, UserBasicInfo } from '../../../../core/models';

export class UserRepositoryImplementation implements UserRepository {
  constructor(private readonly datasource: UserRepository) {}
  createDoctor<T extends Doctor>(user: UserEntity<T>): Promise<UserBasicInfo> {
    return this.datasource.createDoctor<T>(user);
  }
  findByDoctor<T extends Doctor>({ id, email }: { id?: string; email?: string }): Promise<T | null> {
    return this.datasource.findByDoctor({ id, email });
  }

  createPatient<T extends Patient>(userData: UserEntity<T>): Promise<UserBasicInfo> {
    return this.datasource.createPatient<T>(userData);
  }
  findByPatient<T extends Patient>({
    identificationNumber,
    id
  }: {
    identificationNumber?: number;
    id?: string;
  }): Promise<T | null> {
    return this.datasource.findByPatient({ identificationNumber, id });
  }
  findAllPatients<T extends Patient>(): Promise<T[] | []> {
    return this.datasource.findAllPatients();
  }
  deletePatient(id: string): Promise<boolean> {
    return this.datasource.deletePatient(id);
  }
  updatePatient<T extends Patient>({ id, userData }: { id: string; userData: T; }): Promise<UserBasicInfo | null> {
    return this.datasource.updatePatient({id ,userData})
  }
}
