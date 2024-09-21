import { paymentStatus, ShiftStatus } from '../enums';

export interface ShiftHistory {
  shiftId: string;
  date: Date;
  doctorId: string;
  status: ShiftStatus;
  paymentStatus: paymentStatus;
  clinicData: {
    clinicName: string;
    clinicAddress: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
  };
}
