import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../../../shared/errors/custom.error';
import { UserRepository } from '../../../../application/repository';
import { HttpCode } from '../../../../core/enums';
import mongoose from 'mongoose';

export class DoctorController {
  constructor(private readonly repository: UserRepository) {}

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    if (!id) {
      throw AppError.notFound('Missing doctor id');
    }

    const doctorId = new mongoose.Types.ObjectId(id).toString();

    const userData = req.body;

    try {
      const result = await this.repository.update({ id: doctorId, userData, type: 'doctor' });
      
      if (!result) {
        return res.status(HttpCode.NOT_FOUND).json({ message: 'Cant update user' });
      }

      res.status(HttpCode.OK).json({
        id: result.id,
        message: `Doctor was updated successfully`
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async updateMany(req: Request, res: Response, next: NextFunction) {
    const { attributes } = req.body;

    if (!attributes) {
      throw AppError.badRequest('Attributes are required');
    }

    try {
      const result = await this.repository.updateMany({ attributes, type: 'doctor' });
      
      if (!result) {
        return res.status(HttpCode.NOT_FOUND).json({ message: 'No documents were found to update' });
      }

      res.status(HttpCode.OK).json({ message: 'success' });
    } catch (error: unknown) {
      next(error);
    }
  }
}
