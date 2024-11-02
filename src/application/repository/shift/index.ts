import { ShiftEntity } from '../../../core/entities/shift';
import { SearchShiftData, Shift, ShitfBasicInfo } from '../../../core/models';

export abstract class ShiftRepository {
  abstract create(shiftData: ShiftEntity): Promise<ShitfBasicInfo>;
  abstract search(searchData: SearchShiftData): Promise<Shift[] | []>;
  abstract updateShift({ id, shift }: { id: string; shift: Shift }): Promise<ShitfBasicInfo | null>;
}
