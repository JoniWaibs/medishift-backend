import { type NextFunction, type Request, type Response } from 'express';
import { UserRepository } from '../../../../application/repository';
import { Patient } from '../../../../core/models';
import { AppError } from '../../../../shared/errors/custom.error';
import { CreateUser, FindUser } from '../../../../application/use-cases';
import { HttpCode, UserRole } from '../../../../core/enums';
import { UpdateUser } from '../../../../application/use-cases/user/update-user';
import mongoose from 'mongoose';

export class PatientController {
  constructor(private readonly repository: UserRepository) {}

  public async create(req: Request, res: Response, next: NextFunction) {
    const { name, lastName, contactInfo, insurerData, identificationNumber } = req.body;
    const { id } = req.user!;

    const patient = await new FindUser(this.repository).executeByPatient<Patient>({ identificationNumber });

    if (patient) {
      throw AppError.conflict('Patient already exists');
    }

    try {
      const patientCreated = await new CreateUser(this.repository).executeByPatient<Patient>({
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
        id: patientCreated.id,
        message: `Patient was created successfully`
      });
    } catch (error) {
      next(AppError.badRequest(`Something was wrong - ${error}`));
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) {
      throw AppError.notFound('Missing patient id');
    }

    try {
      const patientId = new mongoose.Types.ObjectId(id).toString()
      const patient = await new FindUser(this.repository).executeByPatient<Patient>({ id: patientId });

      if (!patient) {
        throw AppError.notFound('Patient does not exists');
      }

      res.status(HttpCode.OK).json(patient);
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

  public async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) {
      throw AppError.notFound('Missing patient id');
    }
    const patientId = new mongoose.Types.ObjectId(id).toString()
    const patient = await new FindUser(this.repository).executeByPatient<Patient>({ id: patientId });

    if (!patient) {
      throw AppError.notFound('Patient does not exists');
    }

    const userData = req.body;

    try {
      const patientUpdated = await new UpdateUser(this.repository).executeByPatient({id: patientId, userData })

      if(!patientUpdated) {
        throw AppError.conflict('Patient cant be update');
      }
      
      res.status(HttpCode.OK).json({
        id: patientUpdated.id,
        message: `Patient was updated successfully`
      });
    } catch (error) {
      next(AppError.badRequest(`Something was wrong - ${error}`));
    }
  }
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
