import { CurrencyType, PaymentMethod, PaymentStatus, ShiftStatus } from '../enums';
import { Clinic } from './clinic';

export interface Payment {
  requiresInvoice?: boolean;
  amount: number;
  method?: PaymentMethod;
  status?: PaymentStatus;
  currency?: {
    symbol?: string;
    type?: CurrencyType;
  };
}

export interface Shift {
  id?: string; // Unique identifier for the shift
  doctorId: string; // Reference to the doctor's ID
  patientId: string;
  date: string; // The date of the shift
  startTime: string; // Start time of the shift (e.g., '09:00 AM')
  endTime: string; // End time of the shift (e.g., '10:00 AM')
  status: ShiftStatus; // Enum for shift status
  appointmentType: 'in-person' | 'virtual'; // Enum for type of appointment (in-person or virtual)
  location?: Clinic; // Optional: Location for in-person appointment
  notes?: string; // Optional: Any additional notes for the shift
  createdAt: string; // Timestamp for when the shift was created
  updatedAt?: string; // Timestamp for the last update to the shift
  payment: Payment;
}

export interface ShitfBasicInfo {
  id: string; // Unique identifier for the shift
  doctorId: string; // Reference to the doctor's ID
  patientId: string; // Reference to the patient's ID
}
