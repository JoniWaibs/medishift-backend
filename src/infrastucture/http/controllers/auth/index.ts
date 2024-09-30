import { type NextFunction, type Request, type Response } from 'express';
import { UserRepository } from '../../../../application/repository';
import { CreateUser } from '../../../../application/use-cases/create-user';
import { Doctor } from '../../../../core/models';
import { HttpCode, UserRole } from '../../../../core/enums';
import { AppError } from '../../../../shared/errors/custom.error';
import { User } from '../../../persistance/schemas/user';
import { AuthService } from '../../../services/AuthService';
import { cookieOptions } from '../../../../config/cookie';

export class AuthController {
  constructor(private readonly repository: UserRepository) {}

  public async signUp(req: Request, res: Response, next: NextFunction) {
    const { name, lastName, id, password, licenseNumber, contactInfo } = req.body;
    
    const userExists = await User.findOne({'contactInfo.email': contactInfo.email});
    
    if (userExists) {
      throw AppError.conflict('User already exists');
    }

    try {
      const userId = await new CreateUser<Doctor>(this.repository).execute({
        id,
        name,
        lastName,
        createdAt: new Date(),
        role: UserRole.DOCTOR,
        contactInfo,
        licenseNumber,
        password
      });

      const token = AuthService.generateToken({ id: userId, email: contactInfo.email })

      res.cookie('session', token, cookieOptions).status(HttpCode.OK).json({
        id: userId,
        message: `User was created successfully`
      });
      
    } catch (error) {      
      next(AppError.badRequest(`Something was wrong - ${error}`));
    }
  }


  signIn(){}

  currentUser(req: Request, res: Response) {
    res.status(200).json({ user: req.user});
  }

  signOut(req: Request, res: Response) {
    res.clearCookie('session').json({});
  }
}
