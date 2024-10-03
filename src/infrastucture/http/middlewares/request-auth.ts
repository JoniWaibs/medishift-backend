import { type Response, type NextFunction, type Request } from 'express';
import { AppError } from '../../../shared/errors/custom.error';
import { UserRole } from '../../../core/enums';

export class RequestAuthMiddleware {
  static handleByRole = (req: Request, res: Response, next: NextFunction): void => {
    const { role, id } = req.user!;    

    if (role.includes(UserRole.DOCTOR) || role.includes(UserRole.PATIENT) ) {      
      console.log(`requestAuthMiddleware is called: userId ${id} has permissions by resource`);
      return next();
    }

    throw AppError.unauthorized('Access denied, user does not permissions by resource');
  };
}
