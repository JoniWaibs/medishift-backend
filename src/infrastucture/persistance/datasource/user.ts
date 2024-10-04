import { UserDatasource } from '../../../application/datasources';
import { UserEntity } from '../../../core/entities/user';
import { Patient, Doctor, UserBasicInfo } from '../../../core/models';
import { AppError } from '../../../shared/errors/custom.error';
import { DoctorModel, PatientModel } from '../schemas';

export class MongoDBDatasource implements UserDatasource {
  async createDoctor<T extends Doctor>(user: UserEntity<T>): Promise<UserBasicInfo> {
    try {
      const userCreated = await DoctorModel.create(user.data);

      return { id: userCreated.id, role: userCreated.role, email: userCreated.contactInfo.email };
    } catch (error: unknown) {
      throw AppError.internalServer(`User was not created in MongoDDBB - ${error}`);
    }
  }

  async findByDoctor<T extends Doctor>({ id, email }: { id?: string; email?: string }): Promise<T | null> {
    let user = null;
    try {
      if (id) {
        user = await DoctorModel.findById(id);
      } else {
        user = await DoctorModel.findOne({ 'contactInfo.email': email });
      }
      return user as T;
    } catch (error: unknown) {
      throw AppError.internalServer(`User was not founded in MongoDDBB - ${error}`);
    }
  }

  async createPatient<T extends Patient>(user: UserEntity<T>): Promise<UserBasicInfo> {
    try {
      const userCreated = await PatientModel.create(user.data);

      return { id: userCreated.id, role: userCreated.role, email: userCreated.contactInfo.email };
    } catch (error: unknown) {
      throw AppError.internalServer(`Patient was not created in MongoDDBB - ${error}`);
    }
  }

  async findByPatient<T extends Patient>({
    identificationNumber,
    id
  }: {
    identificationNumber?: number;
    id?: string;
  }): Promise<T | null> {
    let patient = null;

    try {
      if (id) {
        patient = await PatientModel.findById(id);
      } else if (identificationNumber) {
        patient = await PatientModel.findOne({ identificationNumber: identificationNumber });
      }

      return patient as unknown as T;
    } catch (error: unknown) {
      throw AppError.internalServer(`User was not founded in MongoDDBB - ${error}`);
    }
  }

  async findAllPatients<T extends Patient>(): Promise<T[] | []> {
    try {
      const patients = await PatientModel.find({});
      return patients as unknown as T[];
    } catch (error: unknown) {
      throw AppError.internalServer(`Users was not founded in MongoDDBB - ${error}`);
    }
  }

  async deletePatient(id: string): Promise<boolean> {
    try {
      const deletedUser = await PatientModel.findByIdAndDelete(id)
      return !!deletedUser
    } catch (error) {
      throw AppError.internalServer(`User cannot deleted from MongoDDBB - ${error}`);
    }
  }
}
