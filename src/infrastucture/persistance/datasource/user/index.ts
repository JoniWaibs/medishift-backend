import { UserDatasource } from '../../../../application/datasources';
import { UserEntity } from '../../../../core/entities/user';
import { Patient, Doctor, UserBasicInfo } from '../../../../core/models';
import { AppError } from '../../../../shared/errors/custom.error';
import { DoctorModel, PatientModel } from '../../schemas';

export class MongoDBUserDatasource implements UserDatasource {
  async createDoctor<T extends Doctor>(userData: UserEntity<T>): Promise<UserBasicInfo> {
    try {
      const userCreated = await DoctorModel.create(userData.data);

      return { id: userCreated.id, role: userCreated.role, email: userCreated.contactInfo.email! };
    } catch (error: unknown) {
      throw AppError.internalServer(`User was not created in MongoDDBB - ${error}`);
    }
  }

  async findDoctor<T extends Doctor>({ id, email }: { id?: string; email?: string }): Promise<T | null> {
    let user = null;
    try {
      if (id) {
        user = await DoctorModel.findById(id);
      } else {
        user = await DoctorModel.findOne({ 'contactInfo.email': email });
      }
      return user as unknown as T;
    } catch (error: unknown) {
      throw AppError.internalServer(`User was not founded in MongoDDBB - ${error}`);
    }
  }

  async createPatient<T extends Patient>(userData: UserEntity<T>): Promise<UserBasicInfo> {
    try {
      const userCreated = await PatientModel.create(userData.data);

      return { id: userCreated.id, role: userCreated.role };
    } catch (error: unknown) {
      throw AppError.internalServer(`Patient was not created in MongoDDBB - ${error}`);
    }
  }

  async deletePatient(id: string): Promise<boolean> {
    try {
      const deletedUser = await PatientModel.findByIdAndDelete(id);
      return !!deletedUser;
    } catch (error: unknown) {
      throw AppError.internalServer(`User cannot deleted from MongoDDBB - ${error}`);
    }
  }

  async search<T extends Patient>({ search, id }: { search?: string; id?: string }): Promise<T[] | []> {
    const query = {
      ...(id && { _id: id }),
      ...(search && {
        $or: [
          { name: new RegExp(search.toLowerCase().trim(), 'i') },
          { lastName: new RegExp(search.toLowerCase().trim(), 'i') },
          { identificationNumber: new RegExp(search.toLowerCase().trim(), 'i') }
        ]
      })
    };

    try {
      const patients = await PatientModel.find(query);

      return patients as unknown as T[];
    } catch (error: unknown) {
      throw AppError.internalServer(`Users was not founded in MongoDDBB - ${error}`);
    }
  }

  async updateMany({ attributes, type }: { attributes: Record<string, unknown>, type: 'doctor' | 'patient' }): Promise<boolean> {
    const Model = {
      ['doctor']: DoctorModel,
      ['patient']: PatientModel
    }

    try {
      const result = await Model[type].updateMany({}, { $set: { ...attributes } }, { upsert: false });
      return result.modifiedCount > 0;
    } catch (error: unknown) {
      throw AppError.internalServer(`Users was not updated in MongoDDBB - ${error}`);
    }
  }

  async update<T>({ id, userData, type }: { id: string; userData: T, type: 'doctor' | 'patient' }): Promise<UserBasicInfo | null> {

    try {
      let updatedUser = null;
      switch (type) {
        case 'doctor':
          updatedUser = await DoctorModel.findByIdAndUpdate(id, userData as unknown as Partial<Doctor>, { returnDocument: 'after' });
          break;
        case 'patient':
          updatedUser = await PatientModel.findByIdAndUpdate(id, userData as unknown as Partial<Patient>, { returnDocument: 'after' });
          break;
        default:
          throw AppError.notFound('User type not found');
      }
      if (!updatedUser) {
        return null;
      }
      await updatedUser.save();
      return { id: updatedUser.id, role: updatedUser.role };
    } catch (error: unknown) {
      throw AppError.internalServer(`User cant updated in MongoDDBB - ${error}`);
    }
  }
}
