/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { Shift } from '../../../../core/models';

const ContactInfoSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true }
});

const PatientSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Reference to patient's ID
  identificationNumber: { type: Number, required: true, unique: true }, // Patient's identification number
  name: { type: String, required: true }, // Patient's name
  lastName: { type: String, required: true }, // Patient's last name
  contactInfo: ContactInfoSchema, // Nested contactInfo schema
  profilePictureUrl: { type: String } // Optional: Profile picture URL
});

const ClinicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String }
});

const ShiftSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // Unique identifier for the shift
    doctorId: { type: String, required: true }, // Reference to doctor's ID
    patient: PatientSchema, // Nested patient schema
    date: { type: Date, required: true }, // Date of the shift
    startTime: { type: String, required: true }, // Start time of the shift
    endTime: { type: String, required: true }, // End time of the shift
    status: {
      type: String,
      enum: ['pending', 'completed', 'canceled', 'suspended'],
      default: 'pending',
      required: true
    }, // Enum for shift status
    appointmentType: {
      type: String,
      enum: ['in-person', 'virtual'],
      required: true
    }, // Enum for appointment type
    location: ClinicSchema, // Optional: Clinic location for in-person appointments
    notes: { type: String }, // Optional notes
    createdAt: { type: Date, default: Date.now }, // Timestamp for when the shift was created
    updatedAt: { type: Date, default: Date.now }, // Timestamp for last update
    paymentStatus: {
      type: String,
      enum: ['paid', 'unpaid', 'pending'],
      default: 'pending',
      required: true
    } // Enum for payment status
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
        delete ret.__v;
      }
    }
  }
);

ShiftSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export const ShiftModel = mongoose.model<Shift>('Shift', ShiftSchema);
