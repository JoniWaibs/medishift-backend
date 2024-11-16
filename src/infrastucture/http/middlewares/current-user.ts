import { type Response, type NextFunction, type Request } from 'express';
import { AuthService } from '../../services/auth-service';
import { AppError } from '../../../shared/errors/custom.error';
import { UserBasicInfo } from '../../../core/models';

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserBasicInfo | null;
  }
}

export class CurrentUserMiddleware {
  static handleUser = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.cookies.session) {
      throw AppError.unauthorized('Access denied, session expired');
    }

    try {
      const payload = AuthService.verifyToken(req.cookies.session) as UserBasicInfo;

      req.user = payload;

      console.log(`currentUserMiddleware - current user is: ${payload.id}`);
      next();
    } catch (error: unknown) {
      next(AppError.unauthorized(`Invalid token - ${error}`));
    }
  };
}
