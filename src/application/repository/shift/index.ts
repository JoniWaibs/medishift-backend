import { ShiftEntity } from '../../../core/entities/shift';
import { Shift, ShitfBasicInfo } from '../../../core/models';

export abstract class ShiftRepository {
  abstract create(shiftData: ShiftEntity): Promise<ShitfBasicInfo>;
  abstract findAllByDate({
    startDate,
    endDate,
    doctorId,
    patientId
  }: {
    startDate: string;
    endDate: string;
    doctorId?: string | null;
    patientId?: string | null;
  }): Promise<Shift[] | []>;
  abstract findShift(id: string): Promise<Shift | null>;
  abstract updateShift({ id, shift }: { id: string; shift: Shift }): Promise<ShitfBasicInfo | null>;
}
