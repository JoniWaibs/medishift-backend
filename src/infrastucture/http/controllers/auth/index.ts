import { type NextFunction, type Request, type Response } from 'express';
import { UserRepository } from '../../../../application/repository';
import { CreateUser, FindUser } from '../../../../application/use-cases';
import { Doctor } from '../../../../core/models';
import { HttpCode, UserRole } from '../../../../core/enums';
import { AppError } from '../../../../shared/errors/custom.error';
import { AuthService } from '../../../services/AuthService';
import { cookieOptions } from '../../../../config/cookie';
import { Password } from '../../../../shared/utils/password-hasher';

export class AuthController {
  constructor(private readonly repository: UserRepository) {}

  public async signUp(req: Request, res: Response, next: NextFunction) {
    const { name, lastName, password, licenseNumber, contactInfo } = req.body;

    const userExists = await new FindUser(this.repository).executeByDoctor<Doctor>({ email: contactInfo.email });

    if (userExists) {
      throw AppError.conflict('User already exists, you must login with your credentials');
    }

    try {
      const user = await new CreateUser(this.repository).executeByDoctor<Doctor>({
        name,
        lastName,
        role: UserRole.DOCTOR,
        createdAt: new Date(),
        contactInfo,
        licenseNumber,
        password
      });

      const token = AuthService.generateToken({ id: user.id, email: user.email, role: user.role });

      res.cookie('session', token, cookieOptions).status(HttpCode.OK).json({
        id: user.id,
        message: `User was created successfully`
      });
    } catch (error) {
      next(AppError.badRequest(`Something was wrong - ${error}`));
    }
  }

  async signIn(req: Request, res: Response) {
    const { password, email } = req.body;

    const user = await new FindUser(this.repository).executeByDoctor<Doctor>({ email });

    if (!user) {
      throw AppError.unauthorized('User not found, you can create a free account');
    }

    const isMatch = await Password.compare(user.password, password);

    if (!isMatch) {
      throw AppError.unauthorized('Password does not match');
    }

    const token = AuthService.generateToken({ id: user.id!, email: user.contactInfo.email, role: user.role });

    res.cookie('session', token, cookieOptions).status(HttpCode.OK).json(user);
  }

  currentUser(req: Request, res: Response) {
    res.status(200).json({ user: req.user });
  }

  signOut(_req: Request, res: Response) {
    res.clearCookie('session').json({});
  }
}
