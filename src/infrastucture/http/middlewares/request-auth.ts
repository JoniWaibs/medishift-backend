import { type Response, type NextFunction, type Request } from 'express';
import { AppError } from '../../../shared/errors/custom.error';
import { UserRole } from '../../../core/enums';

export class RequestAuthMiddleware {
  static handleBasic = (req: Request, _res: Response, next: NextFunction): void => {
    const { role, id } = req.user!;

    if (role.includes(UserRole.DOCTOR) || role.includes(UserRole.ADMIN)) {
      console.log(`requestAuthMiddleware is called - user ${id} have permissions by ${role}`);
      return next();
    }

    throw AppError.unauthorized('Access denied, user does not have permissions by resource');
  };

  static handleAdmin = (req: Request, _res: Response, next: NextFunction): void => {
    const { role, id } = req.user!;
    if (role.includes(UserRole.ADMIN)) {
      console.log(`requestAuthMiddleware is called - user ${id} have permissions by ${role}`);
      return next();
    }
    throw AppError.unauthorized('Access denied, user does not have permissions by resource');
  };
}
