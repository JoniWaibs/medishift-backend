import { ShiftDataSource } from '../../../../application/datasources/shift';
import { ShiftEntity } from '../../../../core/entities/shift';
import { ShitfBasicInfo } from '../../../../core/models';
import { AppError } from '../../../../shared/errors/custom.error';
import { ShiftModel } from '../../schemas/shift';

export class MongoDBShiftDataSource implements ShiftDataSource {
  async create(shiftData: ShiftEntity): Promise<ShitfBasicInfo> {
    try {
      const shiftCreated = await ShiftModel.create(shiftData.data);

      return { id: shiftCreated.id, doctorId: shiftCreated.doctorId, patientId: shiftCreated.patient.id };
    } catch (error: unknown) {
      throw AppError.internalServer(`Shift was not created in MongoDDBB - ${error}`);
    }
  }
}
