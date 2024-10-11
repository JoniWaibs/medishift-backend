import { ShiftDataSource } from '../../../../application/datasources/shift';
import { ShiftEntity } from '../../../../core/entities/shift';
import { ShitfBasicInfo } from '../../../../core/models';
import { AppError } from '../../../../shared/errors/custom.error';
import { ShiftModel } from '../../schemas/shift';

export class MongoDBShiftDataSource implements ShiftDataSource {
  async create(shiftData: ShiftEntity): Promise<ShitfBasicInfo> {
    const { doctorId, date, startTime, endTime } = shiftData.data;

    const overlappingShifts = await ShiftModel.find({
      doctorId: doctorId,
      date: { $eq: date }, // Same date as the new shift
      $and: [
        {
          startTime: { $lt: endTime }, // Existing shift starts before new shift ends
          endTime: { $gt: startTime } // Existing shift ends after new shift starts
        }
      ]
    });

    if (overlappingShifts.length > 0) {
      throw AppError.conflict(`The selected time overlaps with another shift for Doctor ID: ${doctorId}.`);
    }

    try {
      const shiftCreated = await ShiftModel.create(shiftData.data);
      return { id: shiftCreated.id, doctorId: shiftCreated.doctorId, patientId: shiftCreated.id };
    } catch (error: unknown) {
      throw AppError.internalServer(`Shift was not created in MongoDDBB - ${error}`);
    }
  }
}
