import mongoose from 'mongoose';
import { AppError } from '../../../shared/errors/custom.error';

interface MongoDDBBOptions {
  url: string;
  dbName: string;
}

export class MongoDDBB {
  static async connect(options: MongoDDBBOptions) {
    const { url, dbName } = options;

    try {
      await mongoose.connect(url, { dbName });
      console.log('mongoDDBB connected');
    } catch (error: unknown) {
      throw AppError.internalServer(`Can't conncet with mongoDDBB - ${error}`);
    }
  }
}
