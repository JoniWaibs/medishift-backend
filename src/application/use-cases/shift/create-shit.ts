import { ShiftEntity } from '../../../core/entities/shift';
import { ShitfBasicInfo } from '../../../core/models';
import { ShiftRepository } from '../../repository/shift';

export interface CreateShiftUseCase {
  create(shiftData: ShiftEntity): Promise<ShitfBasicInfo>;
}

export class CreateShift implements CreateShiftUseCase {
  constructor(private readonly repository: ShiftRepository) {}

  async create(shiftData: ShiftEntity): Promise<ShitfBasicInfo> {
    return this.repository.create(new ShiftEntity(shiftData.data));
  }
}
