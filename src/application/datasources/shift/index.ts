import { ShiftEntity } from '../../../core/entities/shift';
import { ShitfBasicInfo } from '../../../core/models';

export abstract class ShiftDataSource {
  abstract create(shiftData: ShiftEntity): Promise<ShitfBasicInfo>;
}
