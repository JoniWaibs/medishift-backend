import { paymentStatus, ShiftStatus } from '../enums';
import { Clinic } from './clinic';
import { ContactInfo } from './contact';

export interface Shift {
  id: string; // Unique identifier for the shift
  doctorId: string; // Reference to the doctor's ID
  patient: {
    id: string; // Reference to the patient's ID
    identificationNumber: number;
    name: string;
    lastName: string;
    contactInfo: ContactInfo;
    profilePictureUrl?: string;
  };
  date: Date; // The date of the shift
  startTime: string; // Start time of the shift (e.g., '09:00 AM')
  endTime: string; // End time of the shift (e.g., '10:00 AM')
  status: ShiftStatus; // Enum for shift status
  appointmentType: 'in-person' | 'virtual'; // Enum for type of appointment (in-person or virtual)
  location?: Clinic; // Optional: Location for in-person appointment
  notes?: string; // Optional: Any additional notes for the shift
  createdAt: Date; // Timestamp for when the shift was created
  updatedAt: Date; // Timestamp for the last update to the shift
  paymentStatus: paymentStatus;
}

export interface ShitfBasicInfo {
  id: string; // Unique identifier for the shift
  doctorId: string; // Reference to the doctor's ID
  patientId: string; // Reference to the patient's ID
}
