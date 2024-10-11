import { type NextFunction, type Request, type Response } from 'express';

import { HttpCode } from '../../../../core/enums';
import { ShiftRepository } from '../../../../application/repository/shift';
import { CreateShift } from '../../../../application/use-cases/shift/create-shit';
import { HandleDates } from '../../../../shared/utils/handle-dates';
import { format } from 'date-fns';

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
}
