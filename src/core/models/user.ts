import { UserRole } from '../enums';
import { Clinic } from './clinic';
import { ShiftHistory } from './shift';

interface MedicalHistory {
  updatedAt: Date;
  description: string;
  writedBy: string;
}

export interface User {
  id?: string;
  name: string;
  lastName: string;
  createdAt: Date;
  dateOfBirth?: Date;
  role: UserRole;
  contactInfo: {
    email: string;
    phone: {
      countryCod?: string;
      area: string;
      number: string;
    };
    address?: {
      street?: string;
      city?: string;
      province?: string;
      country?: string;
    };
  };
}

export interface Patient extends User {
  role: UserRole.PATIENT;
  medicalHistory: MedicalHistory[];
  shiftHistory: ShiftHistory[];
  paymentSelectedMethod: string;
}

export interface Doctor extends User {
  role: UserRole.DOCTOR;
  password: string;
  specialization?: string[];
  licenseNumber?: string;
  shifts?: ShiftHistory[];
  clinics?: Clinic[];
}
