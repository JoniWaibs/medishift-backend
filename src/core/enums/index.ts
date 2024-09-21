export enum HttpCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500
}

export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  NURSE = 'nurse',
  ADMIN = 'admin',
  COORDINATOR = 'coordinator'
}

export enum ShiftStatus {
  PENDING = 'pending',
  COMPLETE = 'complete',
  SUSPENDED = 'suspended',
  REPROGRAMMED = 'reprogrammed',
  CANCELLED = 'cancelled'
}

export enum paymentStatus {
  DONE = 'done',
  PENDING = 'pending'
}
