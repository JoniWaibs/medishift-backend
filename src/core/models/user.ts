import { UserRole } from '../enums';
import { ContactInfo, EmergencyContactInfo } from './contact';

interface MedicalHistory {
  updatedAt: Date;
  diagnosis: string;
  writedBy: string;
}

interface InsusrerData {
  providerName: string;
}

export interface BaseUser {
  id?: string;
  name: string;
  role: UserRole;
  profilePictureUrl?: string;
  lastName: string;
  createdAt: Date;
  dateOfBirth?: Date;
  contactInfo: ContactInfo;
}

export interface UserBasicInfo {
  id: string;
  email: string;
  role: UserRole;
}

export interface Doctor extends BaseUser {
  password: string;
  specialization?: string[];
  licenseNumber?: string;
}

export interface Patient extends BaseUser {
  identificationNumber: number;
  medicalHistory?: MedicalHistory[];
  notes?: string;
  emergencyContact?: EmergencyContactInfo;
  currentMedications?: string[];
  isActive: boolean;
  insurerData: InsusrerData;
  createdBy: string,
}
