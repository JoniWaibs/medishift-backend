import { Request, Response, NextFunction } from 'express';
import { ContextRunner } from 'express-validator';
import { AppError } from '../../../shared/errors/custom.error';

export const validate = (validations: ContextRunner[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    // sequential processing, stops running validations chain if one fails.
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        next(AppError.badRequest(JSON.stringify(result)));
      }
    }
    next();
  };
};
