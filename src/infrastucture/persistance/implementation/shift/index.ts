import { ShiftDataSource } from '../../../../application/datasources/shift';
import { ShiftRepository } from '../../../../application/repository/shift';
import { ShiftEntity } from '../../../../core/entities/shift';
import { Shift, ShitfBasicInfo } from '../../../../core/models';

export class ShiftRepositoryImplementation implements ShiftRepository {
  constructor(private readonly datasource: ShiftDataSource) {}

  create(shiftData: ShiftEntity): Promise<ShitfBasicInfo> {
    return this.datasource.create(shiftData);
  }

  findAllByDate({
    startDate,
    endDate,
    doctorId,
    patientId
  }: {
    startDate: string;
    endDate: string;
    doctorId?: string | null;
    patientId?: string | null;
  }): Promise<Shift[] | []> {
    return this.datasource.findAllByDate({ startDate, endDate, doctorId, patientId });
  }
  findShift(id: string): Promise<Shift | null> {
    return this.datasource.findShift(id);
  }
  updateShift({ id, shift }: { id: string; shift: Shift }): Promise<ShitfBasicInfo | null> {
    return this.datasource.updateShift({ id, shift });
  }
}
