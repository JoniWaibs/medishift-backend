import { UserEntity } from '../../../core/entities/user';
import { Patient, Doctor, UserBasicInfo } from '../../../core/models';

export abstract class UserRepository {
  abstract createDoctor<T extends Doctor>(userData: UserEntity<T>): Promise<UserBasicInfo>;
  abstract findByDoctor<T extends Doctor>({ id, email }: { id?: string; email?: string }): Promise<T | null>;

  abstract createPatient<T extends Patient>(userData: UserEntity<T>): Promise<UserBasicInfo>;
  abstract findByPatient<T extends Patient>({
    identificationNumber,
    id
  }: {
    identificationNumber?: number;
    id?: string;
  }): Promise<T | null>;
  abstract findAllPatients<T extends Patient>(): Promise<T[] | []>;
  abstract deletePatient(id: string): Promise<boolean>;
  abstract updatePatient<T extends Patient>({id, userData}: {id: string, userData: T}): Promise<UserBasicInfo | null>;
}
