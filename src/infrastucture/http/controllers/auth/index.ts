import { type NextFunction, type Request, type Response } from 'express';
import { UserRepository } from '../../../../application/repository';
import { CreateUser, FindUser } from '../../../../application/use-cases';
import { Doctor } from '../../../../core/models';
import { HttpCode, UserRole } from '../../../../core/enums';
import { AppError } from '../../../../shared/errors/custom.error';
import { User } from '../../../persistance/schemas/user';
import { AuthService } from '../../../services/AuthService';
import { cookieOptions } from '../../../../config/cookie';
import { Password } from '../../../../shared/utils/password-hasher';

export class AuthController {
  constructor(private readonly repository: UserRepository) {}

  public async signUp(req: Request, res: Response, next: NextFunction) {
    const { name, lastName, id, password, licenseNumber, contactInfo } = req.body;

    const userExists = await User.findOne({ 'contactInfo.email': contactInfo.email });

    if (userExists) {
      throw AppError.conflict('User already exists, you must login with your credentials');
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

      const token = AuthService.generateToken({ id: userId, email: contactInfo.email });

      res.cookie('session', token, cookieOptions).status(HttpCode.OK).json({
        id: userId,
        message: `User was created successfully`
      });
    } catch (error) {
      next(AppError.badRequest(`Something was wrong - ${error}`));
    }
  }

  async signIn(req: Request, res: Response) {
    const { password, email } = req.body;

    const user = await new FindUser<Doctor>(this.repository).execute({ email });

    if (!user) {
      throw AppError.unauthorized('User not found, you can create a free account');
    }

    const isMatch = await Password.compare(user.password, password);

    if (!isMatch) {
      throw AppError.unauthorized('Password does not match');
    }

    const token = AuthService.generateToken({ id: user.id!, email: user.contactInfo.email });

    res.cookie('session', token, cookieOptions).status(HttpCode.OK).json(user);
  }

  currentUser(req: Request, res: Response) {
    res.status(200).json({ user: req.user });
  }

  signOut(_req: Request, res: Response) {
    res.clearCookie('session').json({});
  }
}
