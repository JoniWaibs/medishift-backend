import { type NextFunction, type Request, type Response } from 'express';

import { HttpCode } from '../../../../core/enums';
import { ShiftRepository } from '../../../../application/repository/shift';
import { CreateShift } from '../../../../application/use-cases/shift/create-shit';
import { HandleDates } from '../../../../shared/adapters/handle-dates';
import { format } from 'date-fns';
import { AppError } from '../../../../shared/errors/custom.error';
import mongoose from 'mongoose';

export class ShiftController {
  constructor(private readonly repository: ShiftRepository) {}
  async create(req: Request, res: Response, next: NextFunction) {
    const { id: userId } = req.user!;
    const { date, startTime, endTime } = req.body;

    const dates = HandleDates.scheduleSingleShift({ date, startTime, endTime });

    try {
      const shift = await new CreateShift(this.repository).create({
        data: {
          date: dates.start,
          startTime: format(dates.start, 'HH:mm:ss'),
          endTime: format(dates.end, 'HH:mm:ss'),
          doctorId: userId,
          ...req.body
        }
      });

      res.status(HttpCode.OK).json({
        id: shift.id,
        message: `Shift ${shift.id} scheduled successfully by ${shift.doctorId}`
      });
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    const { id: doctorId } = req.user!;
    const { id, startDate, endDate, patientId } = req.query;

    const isQueryByPatient = !!patientId;

    try {
      const shifts = await this.repository.search({
        ...(id && { id: new mongoose.Types.ObjectId(String(id)).toString() }),
        ...(startDate && { startDate: String(startDate) }),
        ...(endDate && { endDate: String(endDate) }),
        ...(isQueryByPatient ? { patientId: String(patientId) } : { doctorId })
      });

      res.status(HttpCode.OK).json(shifts);
    } catch (error: unknown) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) {
      throw AppError.notFound('Missing shift id');
    }

    const shiftId = new mongoose.Types.ObjectId(id).toString();
    const shift = await this.repository.search({ id: shiftId });

    if (!shift) {
      throw AppError.notFound('Shift does not exists');
    }

    const newShiftData = req.body;

    try {
      const shiftUpdated = await this.repository.updateShift({ id: shiftId, shift: newShiftData });
      if (!shiftUpdated) {
        throw AppError.conflict('Patient cant be update');
      }

      res.status(HttpCode.OK).json({
        id: shiftUpdated.id,
        message: `Shift was updated successfully`
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}
