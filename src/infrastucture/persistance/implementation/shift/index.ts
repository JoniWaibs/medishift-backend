import { ShiftDataSource } from '../../../../application/datasources/shift';
import { ShiftRepository } from '../../../../application/repository/shift';
import { ShiftEntity } from '../../../../core/entities/shift';
import { ShitfBasicInfo } from '../../../../core/models';

export class ShiftRepositoryImplementation implements ShiftRepository {
  constructor(private readonly datasource: ShiftDataSource) {}
  create(shiftData: ShiftEntity): Promise<ShitfBasicInfo> {
    return this.datasource.create(shiftData);
  }
}
