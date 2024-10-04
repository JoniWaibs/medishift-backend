import { type NextFunction, type Request, type Response } from 'express';
import { UserRepository } from '../../../../application/repository';
import { FindUser } from '../../../../application/use-cases/find-user';
import { Patient } from '../../../../core/models';
import { AppError } from '../../../../shared/errors/custom.error';
import { CreateUser } from '../../../../application/use-cases';
import { HttpCode, UserRole } from '../../../../core/enums';

export class PatientController {
  constructor(private readonly repository: UserRepository) {}

  public async create(req: Request, res: Response, next: NextFunction) {
    const { name, lastName, contactInfo, insurerData, identificationNumber } = req.body;
    const { id } = req.user!;

    const patientExists = await new FindUser(this.repository).executeByPatient<Patient>({ identificationNumber });

    if (patientExists) {
      throw AppError.conflict('Patient already exists');
    }

    try {
      const patient = await new CreateUser(this.repository).executeByPatient<Patient>({
        identificationNumber: Number(identificationNumber),
        name,
        lastName,
        role: UserRole.PATIENT,
        createdAt: new Date(),
        contactInfo,
        isActive: true,
        insurerData,
        createdBy: id
      });

      res.status(HttpCode.OK).json({
        id: patient.id,
        message: `Patient was created successfully`
      });
    } catch (error) {
      next(AppError.badRequest(`Something was wrong - ${error}`));
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) {
      throw AppError.conflict('Missing patient id');
    }

    try {
      const patientExists = await new FindUser(this.repository).executeByPatient<Patient>({ id: id as string });

      if (!patientExists) {
        throw AppError.conflict('Patient does not exists');
      }

      res.status(HttpCode.OK).json(patientExists);
    } catch (error) {
      next(AppError.badRequest(`Something was wrong - ${error}`));
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const patients = await this.repository.findAllPatients();

      res.status(HttpCode.OK).json({ patients });
    } catch (error) {
      next(AppError.badRequest(`Something was wrong - ${error}`));
    }
  }

  public async update() {}
  public async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      await this.repository.deletePatient(id);

      res.status(HttpCode.OK).json({
        message: `User ${id} was deleted successfully`
      });
    } catch (error) {
      next(AppError.badRequest(`Something was wrong - ${error}`));
    }
  }
}
