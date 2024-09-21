import { type NextFunction, type Request, type Response } from 'express';
import { UserRepository } from '../../../../application/repository';
import { CreateUser } from '../../../../application/use-cases/create-user';
import { Doctor } from '../../../../core/models';
import { HttpCode, UserRole } from '../../../../core/enums';
import { AppError } from '../../../../shared/errors/custom.error';

export class UserController {
  constructor(private readonly repository: UserRepository) {}

  public async signUp(req: Request, res: Response, next: NextFunction) {
    const { name, lastName, id, password, licenseNumber, contactInfo } = req.body;

    try {
      const userCreated = await new CreateUser<Doctor>(this.repository).execute({
        id,
        name,
        lastName,
        createdAt: new Date(),
        role: UserRole.DOCTOR,
        contactInfo,
        licenseNumber,
        password
      });

      if(!userCreated) {
        throw AppError.badRequest(`Something was wrong`);
      }

      res.status(HttpCode.OK).json({
        message: `User with id: ${userCreated} was created successfully`
      });
    } catch (error) {
      next(AppError.badRequest(`Something was wrong - ${error}`));
    }
  }
}
