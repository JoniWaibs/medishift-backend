import { type NextFunction, type Request, type Response } from 'express';
import { AppError } from '../../../../shared/errors/custom.error';
import { HttpCode } from '../../../../core/enums';
import { ShiftRepository } from '../../../../application/repository/shift';

export class ShiftController {
  constructor(private readonly repository: ShiftRepository) {}
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body);
      res.status(HttpCode.OK).json({});
    } catch (error) {
      next(AppError.badRequest(`Something was wrong - ${error}`));
    }
  }
}
