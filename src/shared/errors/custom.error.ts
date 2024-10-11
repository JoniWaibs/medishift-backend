import { HttpCode } from '../../core/enums';

export interface ValidationType {
  fields: string[];
  constraint: string;
}

interface AppErrorArgs {
  name?: string;
  status: HttpCode;
  message: string;
  isOperational?: boolean;
  validationErrors?: ValidationType[];
}

export class AppError extends Error {
  readonly name: string;
  readonly status: HttpCode;
  readonly isOperational: boolean = true;
  readonly validationErrors?: ValidationType[];

  constructor(args: AppErrorArgs) {
    const { message, name, status, isOperational, validationErrors } = args;

    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name ?? 'Aplication Error';
    this.status = status;
    if (isOperational !== undefined) this.isOperational = isOperational;
    this.validationErrors = validationErrors;
    Error.captureStackTrace(this);
  }

  static conflict(message: string, validationErrors?: ValidationType[]): AppError {
    return new AppError({ name: 'ConflictError', message, status: HttpCode.CONFLICT, validationErrors });
  }

  static badRequest(message: string, validationErrors?: ValidationType[]): AppError {
    return new AppError({ name: 'BadRequestError', message, status: HttpCode.BAD_REQUEST, validationErrors });
  }

  static unauthorized(message: string): AppError {
    return new AppError({ name: 'UnauthorizedError', message, status: HttpCode.UNAUTHORIZED });
  }

  static forbidden(message: string): AppError {
    return new AppError({ name: 'ForbiddenError', message, status: HttpCode.FORBIDDEN });
  }

  static notFound(message: string): AppError {
    return new AppError({ name: 'NotFoundError', message, status: HttpCode.NOT_FOUND });
  }

  static internalServer(message: string): AppError {
    return new AppError({ name: 'InternalServerError', message, status: HttpCode.INTERNAL_SERVER_ERROR });
  }
}
