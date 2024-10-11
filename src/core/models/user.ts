import { UserRole } from '../enums';
import { ContactInfo, EmergencyContactInfo } from './contact';

interface MedicalHistory {
  updatedAt: string;
  diagnosis: string;
  writedBy: string;
}

interface InsusrerData {
  providerName: string;
}

export interface BaseUser {
  id?: string;
  name: string;
  lastName: string;
  role: UserRole;
  profilePictureUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  dateOfBirth?: string;
}

export interface UserBasicInfo {
  id: string;
  email?: string;
  role: UserRole;
}

export interface Doctor extends BaseUser {
  password: string;
  specialization?: string[];
  licenseNumber?: string;
  contactInfo: ContactInfo;
}

export interface Patient extends BaseUser {
  contactInfo?: ContactInfo;
  identificationNumber: number;
  medicalHistory?: MedicalHistory[];
  notes?: string;
  emergencyContact?: EmergencyContactInfo;
  currentMedications?: string[];
  isActive: boolean;
  insurerData: InsusrerData;
  createdBy: string;
}
