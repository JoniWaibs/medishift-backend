import { ShiftDataSource } from '../../../../application/datasources/shift';
import { ShiftEntity } from '../../../../core/entities/shift';
import { Shift, ShitfBasicInfo } from '../../../../core/models';
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

  async findAllByDate({
    startDate,
    endDate,
    doctorId,
    patientId
  }: {
    startDate: string;
    endDate: string;
    doctorId: string;
    patientId: string;
  }): Promise<Shift[] | []> {
    const today = new Date();

    const start = startDate ? new Date(startDate) : today;
    const end = endDate ? new Date(endDate) : today;

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    try {
      const shifts = await ShiftModel.find({
        ...(doctorId && { doctorId }),
        ...(patientId && { patientId }),
        date: {
          $gte: startDate,
          $lte: endDate
        }
      });

      return shifts || [];
    } catch (error) {
      throw AppError.internalServer(`Shift was not founded in MongoDDBB - ${error}`);
    }
  }

  async findShift(id: string): Promise<Shift | null> {
    try {
      const shift = await ShiftModel.findById(id);

      return shift;
    } catch (error) {
      throw AppError.internalServer(`Shift was not founded in MongoDDBB - ${error}`);
    }
  }

  async updateShift({ id, shift }: { id: string; shift: Shift }): Promise<ShitfBasicInfo | null> {
    try {
      const patientUpdated = await ShiftModel.findByIdAndUpdate(id, shift, { returnDocument: 'after' });

      if (!patientUpdated) {
        return null;
      }

      return { id: patientUpdated.id, patientId: patientUpdated.patientId, doctorId: patientUpdated.doctorId };
    } catch (error: unknown) {
      throw AppError.internalServer(`User cant updated in MongoDDBB - ${error}`);
    }
  }
}
