import { UserEntity } from '../../../core/entities/user';
import { Patient, Doctor, UserBasicInfo } from '../../../core/models';
export abstract class UserDatasource {
  abstract createDoctor<T extends Doctor>(userData: UserEntity<T>): Promise<UserBasicInfo>;
  abstract findDoctor<T extends Doctor>({ id, email }: { id?: string; email?: string }): Promise<T | null>;

  abstract createPatient<T extends Patient>(userData: UserEntity<T>): Promise<UserBasicInfo>;
  abstract search<T extends Patient>({ search, id }: { search?: string; id?: string }): Promise<T[] | []>;
  abstract deletePatient(id: string): Promise<boolean>;
  abstract updateMany({ attributes, type }: { attributes: Record<string, unknown>, type: 'doctor' | 'patient' }): Promise<boolean>;
  abstract update<T>({ id, userData, type }: { id: string; userData: T, type: 'doctor' | 'patient' }): Promise<UserBasicInfo | null>;
}
