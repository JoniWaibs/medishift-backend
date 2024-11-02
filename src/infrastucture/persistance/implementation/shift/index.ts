import { ShiftDataSource } from '../../../../application/datasources/shift';
import { ShiftRepository } from '../../../../application/repository/shift';
import { ShiftEntity } from '../../../../core/entities/shift';
import { SearchShiftData, Shift, ShitfBasicInfo } from '../../../../core/models';

export class ShiftRepositoryImplementation implements ShiftRepository {
  constructor(private readonly datasource: ShiftDataSource) {}

  create(shiftData: ShiftEntity): Promise<ShitfBasicInfo> {
    return this.datasource.create(shiftData);
  }
  search(searchData: SearchShiftData): Promise<Shift[] | []> {
    return this.datasource.search(searchData);
  }
  updateShift({ id, shift }: { id: string; shift: Shift }): Promise<ShitfBasicInfo | null> {
    return this.datasource.updateShift({ id, shift });
  }
}
