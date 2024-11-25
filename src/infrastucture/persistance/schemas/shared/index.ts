/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { Clinic, ContactInfo } from '../../../../core/models';

export const ContactInfoSchema = new mongoose.Schema<ContactInfo>(
  {
    email: {
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
  },
  {
    toJSON: {
      /**
       * Mongoose will transform the returned object
       * @param _doc
       * @param ret
       */
      transform(_doc: any, ret: Record<string, any>) {
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

export const ClinicSchema = new mongoose.Schema<Clinic>(
  {
    name: { type: String, required: true },
    contactInfo: ContactInfoSchema
  },
  {
    toJSON: {
      /**
       * Mongoose will transform the returned object
       * @param _doc
       * @param ret
       */
      transform(_doc: any, ret: Record<string, any>) {
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);
