import { type NextFunction, type Request, type Response } from 'express';
import { UserRepository } from '../../../../application/repository';
import { Patient } from '../../../../core/models';
import { AppError } from '../../../../shared/errors/custom.error';
import { CreateUser } from '../../../../application/use-cases';
import { HttpCode, UserRole } from '../../../../core/enums';
import mongoose from 'mongoose';

export class PatientController {
  constructor(private readonly repository: UserRepository) {}

  async create(req: Request, res: Response, next: NextFunction) {
    const { name, lastName, contactInfo, insurerData, identificationNumber } = req.body;
    const { id } = req.user!;

    const patients = await this.repository.search({
      ...(identificationNumber && { search: String(identificationNumber) })
    });

    if (patients.length > 0) {
      throw AppError.conflict('Patient already exists');
    }

    try {
      const patientCreated = await new CreateUser(this.repository).executeByPatient<Patient>({
        identificationNumber,
        name,
        lastName,
        role: UserRole.PATIENT,
        contactInfo,
        isActive: true,
        insurerData,
        createdBy: id
      });

      res.status(HttpCode.OK).json({
        id: patientCreated.id,
        message: `Patient was created successfully`
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    const { search, id } = req.query;

    try {
      const patient = await this.repository.search({
        ...(search && { search: String(search) }),
        ...(id && { id: new mongoose.Types.ObjectId(String(id)).toString() })
      });

      if (!patient) {
        throw AppError.notFound('Patient does not exists');
      }

      res.status(HttpCode.OK).json(patient);
    } catch (error: unknown) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    if (!id) {
      throw AppError.notFound('Missing patient id');
    }

    const patientId = new mongoose.Types.ObjectId(id).toString();
    const patient = await this.repository.search({ id: patientId });

    if (!patient) {
      throw AppError.notFound('Patient does not exists');
    }

    const userData = req.body;

    try {
      const patientUpdated = await this.repository.update({ id: patientId, userData, type: 'patient' });

      if (!patientUpdated) {
        throw AppError.conflict('Patient cant be update');
      }

      res.status(HttpCode.OK).json({
        id: patientUpdated.id,
        message: `Patient was updated successfully`
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      await this.repository.deletePatient(id);

      res.status(HttpCode.OK).json({
        message: `User ${id} was deleted successfully`
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}
