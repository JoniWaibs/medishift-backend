/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import mongoose from 'mongoose';
import { Password } from '../../../../shared/utils/password-hasher';
import { BaseUser, Patient, Doctor } from '../../../../core/models';
import { ContactInfoSchema } from '../shared';
import { HandleDates } from '../../../../shared/utils/handle-dates';

export const BaseUserSchema = new mongoose.Schema<Omit<BaseUser, 'id'>>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    role: [
      {
        type: String,
        required: true,
        enum: ['doctor', 'patient', 'admin']
      }
    ],
    profilePictureUrl: {
      type: String
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: String,
      default: HandleDates.newDate()
    },
    updatedAt: { type: String },
    dateOfBirth: {
      type: String
    }
  },
  {
    toJSON: {
      /**
       * Mongoose will transform the returned object
       * @param _doc
       * @param ret
       */
      transform(_doc: any, ret: Record<string, any>) {
        ret.id = ret._id;
        delete ret._id;
        if (ret.password) {
          delete ret.password;
        }
        delete ret.__v;
      }
    }
  }
);

export const PatientSchema = new mongoose.Schema<Omit<Patient, 'id'>>({
  contactInfo: ContactInfoSchema,
  identificationNumber: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },
  medicalHistory: [
    {
      updatedAt: {
        type: Date
      },
      diagnosis: {
        type: String,
        trim: true
      },
      writedBy: {
        type: String
      }
    }
  ],
  notes: {
    type: String
  },
  emergencyContact: {
    name: {
      type: String,
      trim: true
    },
    relation: {
      type: String,
      trim: true
    },
    contactInfo: ContactInfoSchema
  },
  currentMedications: {
    type: [String]
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  },
  insurerData: {
    providerName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    }
  },
  createdBy: {
    type: String,
    required: true
  }
});

const DoctorSchema = new mongoose.Schema<Omit<Doctor, 'id'>>({
  contactInfo: {
    type: ContactInfoSchema,
    required: true
  },
  password: {
    required: true,
    type: String,
    trim: true
  },
  specialization: {
    type: String,
    trim: true
  },
  licenseNumber: {
    type: String,
    trim: true
  }
});

/**
 * Intercepts attempt to save the new user
 * Then it will hash the password previously added
 * and will subscribe this password
 */
DoctorSchema.pre('save', async function (done) {
  this.updatedAt = HandleDates.dateNow();

  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }

  done();
});

PatientSchema.add(BaseUserSchema);
export const PatientModel = mongoose.model<Omit<Patient, 'id'>>('Patient', PatientSchema);

DoctorSchema.add(BaseUserSchema);
export const DoctorModel = mongoose.model<Omit<Doctor, 'id'>>('Doctor', DoctorSchema);
