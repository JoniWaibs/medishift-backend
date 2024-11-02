import { ShiftDataSource } from '../../../../application/datasources/shift';
import { ShiftEntity } from '../../../../core/entities/shift';
import { Shift, ShitfBasicInfo } from '../../../../core/models';
import { SearchShiftData } from '../../../../core/models/misc';
import { AppError } from '../../../../shared/errors/custom.error';
import { ShiftModel } from '../../schemas/shift';

export class MongoDBShiftDataSource implements ShiftDataSource {
  async create(shiftData: ShiftEntity): Promise<ShitfBasicInfo> {
    const { doctorId, date, startTime, endTime } = shiftData.data;

    const overlappingShifts = await ShiftModel.find({
      doctorId: doctorId,
      date: { $eq: date },
      $and: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
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

  async search(searchData: SearchShiftData): Promise<Shift[] | []> {
    const { doctorId, patientId, startDate, endDate, id } = searchData;
    const isQueryByDate = startDate && endDate;

    const query = {
      doctorId,
      ...(patientId && { patientId }),
      ...(id && { _id: id }),
      ...(isQueryByDate && {
        date: {
          $gte: startDate,
          $lte: endDate
        }
      })
    };

    try {
      const shifts = await ShiftModel.find(query);

      return shifts || [];
    } catch (error: unknown) {
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
