import { type Response, type NextFunction, type Request } from 'express';
import { AuthService } from '../../services/AuthService';
import { AppError } from '../../../shared/errors/custom.error';

interface UserBasicInfo {
    id: string;
    email: string;
  }
  
  declare module 'express-serve-static-core' {
    interface Request {
      user?: UserBasicInfo | null;
    }
  }

export const currentUserMiddleware = (req: Request, _res: Response, next: NextFunction) => {     
  if (!req.cookies.session) {
     throw AppError.unauthorized("Can not verify token in session");
  }
  
  try {
    const payload = AuthService.verifyToken(req.cookies.session) as UserBasicInfo;
    
    req.user = payload;

    console.log(`Current userId is: ${payload.id}`);
    next();

  } catch (error) {
    next(AppError.unauthorized(`Something was wrong - ${error}`))
  }
}