/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { Payment, Shift } from '../../../../core/models';
import { CurrencyType, PaymentStatus, ShiftStatus } from '../../../../core/enums';
import { ClinicSchema } from '../shared';
import { HandleDates } from '../../../../shared/utils/handle-dates';

const PaymentSchema = new mongoose.Schema<Payment>(
  {
    requiresInvoice: {
      type: Boolean
    },
    amount: {
      type: Number,
      required: true,
      trim: true
    },
    method: {
      type: String,
      enum: ['cash', 'transfer', 'credit_card', 'debit_card']
    },
    status: {
      type: String,
      enum: ['paid', 'unpaid', 'pending'],
      default: PaymentStatus.PENDING
    },
    currency: {
      symbol: {
        type: String,
        default: '$'
      },
      type: {
        type: String,
        enum: ['ARS', 'USD'],
        default: CurrencyType.ARS
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

const ShiftSchema = new mongoose.Schema<Shift>(
  {
    doctorId: { type: String, required: true }, // Reference to doctor's ID
    patientId: { type: String, required: true }, // Nested patient schema
    date: { type: String, required: true }, // Date of the shift
    startTime: { type: String, required: true }, // Start time of the shift
    endTime: { type: String, required: true }, // End time of the shift
    status: {
      type: String,
      enum: ['pending', 'completed', 'canceled', 'suspended'],
      default: ShiftStatus.PENDING
    },
    appointmentType: {
      type: String,
      enum: ['in-person', 'virtual']
    }, // Enum for appointment type
    location: ClinicSchema, // Optional: Clinic location for in-person appointments
    notes: { type: String }, // Optional notes
    createdAt: { type: String, default: HandleDates.newDate(), required: true }, // Timestamp for when the shift was created
    updatedAt: { type: String }, // Timestamp for last update
    payment: PaymentSchema
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
        delete ret.__v;
      }
    }
  }
);

ShiftSchema.pre('save', function (next) {
  this.updatedAt = HandleDates.dateNow();
  next();
});

export const ShiftModel = mongoose.model<Shift>('Shift', ShiftSchema);
