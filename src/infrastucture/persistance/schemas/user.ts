/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import mongoose from 'mongoose';
import { Password } from '../../../shared/utils/password-hasher';
import { Doctor } from '../../../core/models';
import { UserRole } from '../../../core/enums';

const userSchema = new mongoose.Schema<Omit<Doctor, 'id'>>(
  {
    name: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: new Date()
    },
    role: [
      {
        type: String,
        enum: ['doctor', 'patient', 'nurse', 'admin', 'coordinator'],
        default: UserRole.DOCTOR
      }
    ],
    contactInfo: {
      email: {
        type: String,
        required: true
      },
      phone: {
        countryCode: {
          type: String,
          default: '549'
        },
        area: {
          type: String,
          required: true
        },
        number: {
          type: String,
          required: true
        }
      },
      address: {
        required: false,
        type: {
          street: {
            type: String
          },
          city: {
            type: String
          },
          province: {
            type: String
          },
          country: {
            type: String
          }
        }
      }
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
        (ret.id = ret._id), delete ret._id, delete ret.password, delete ret.__v;
      }
    }
  }
);

/**
 * Intercepts attempt to save the new user
 * Then it will hash the password previously added
 * and will subscribe this password
 */
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

/**
 * Expose User model
 */
export const User = mongoose.model<Omit<Doctor, 'id'>>('User', userSchema);
