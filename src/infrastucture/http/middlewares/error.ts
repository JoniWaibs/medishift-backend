import { type Response, type NextFunction, type Request } from 'express';
import { HttpCode } from '../../../core/enums';
import { AppError } from '../../../shared/errors/custom.error';

export class ErrorMiddleware {
  static handleError = (error: unknown, _: Request, res: Response, next: NextFunction): void => {
    if (error instanceof AppError) {
      const { message, name, stack, validationErrors } = error;
      const status = error.status || HttpCode.INTERNAL_SERVER_ERROR;
      console.error('ErrorMiddleware was called', { name, message });
      res.status(status).json({ name, message, validationErrors, stack });
    } else {
      const name = 'InternalServerError';
      const message = 'An internal server error occurred';
      const status = HttpCode.INTERNAL_SERVER_ERROR;
      console.error('ErrorMiddleware was called', { name, message });
      res.status(status).json({ name, message });
    }
    next();
  };
}
