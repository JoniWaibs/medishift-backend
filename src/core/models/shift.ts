import { paymentStatus, ShiftStatus } from '../enums';
import { Clinic } from './clinic';

export interface ShiftHistory {
  shiftId: string;
  date: Date;
  doctorId: string;
  status: ShiftStatus;
  paymentStatus: paymentStatus;
  clinicData?: Clinic;
}
