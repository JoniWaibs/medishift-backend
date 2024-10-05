/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import mongoose from 'mongoose';
import { Password } from '../../../../shared/utils/password-hasher';
import { BaseUser, Patient, Doctor } from '../../../../core/models';

export const BaseUserSchemma = new mongoose.Schema<Omit<BaseUser, 'id'>>(
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
      type: Date,
      default: new Date()
    },
    dateOfBirth: {
      type: Date
    },
    contactInfo: {
      email: {
        type: String,
        required: true,
        trim: true
      },
      phone: {
        countryCode: {
          type: String,
          default: '549',
          trim: true
        },
        area: {
          type: String,
          required: true,
          trim: true
        },
        number: {
          type: String,
          required: true,
          trim: true
        }
      },
      address: {
        type: {
          street: {
            type: String,
            trim: true
          },
          city: {
            type: String,
            trim: true
          },
          province: {
            type: String,
            trim: true
          },
          country: {
            type: String,
            trim: true
          }
        }
      }
    }
  },
  {
    timestamps: true,
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

export const PatientSchemma = new mongoose.Schema<Omit<Patient, 'id'>>({
  identificationNumber: {
    type: Number,
    trim: true,
    unique: true,
    required: true
  },
  medicalHistory: {
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
  },
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
    phone: {
      countryCode: {
        type: String,
        default: '549',
        trim: true
      },
      area: {
        type: String,
        trim: true
      },
      number: {
        type: String,
        trim: true
      }
    }
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

const DoctorSchemma = new mongoose.Schema<Omit<Doctor, 'id'>>({
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
DoctorSchemma.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

PatientSchemma.add(BaseUserSchemma);
export const PatientModel = mongoose.model<Omit<Patient, 'id'>>('Patient', PatientSchemma);

DoctorSchemma.add(BaseUserSchemma);
export const DoctorModel = mongoose.model<Omit<Doctor, 'id'>>('Doctor', DoctorSchemma);
