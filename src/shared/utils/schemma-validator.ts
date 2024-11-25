import { body, ValidationChain } from 'express-validator';

export class Validator {
  static get signUp(): ValidationChain[] {
    return [
      body('name').isString().toLowerCase().trim(),
      body('lastName').isString().toLowerCase().trim(),
      body('profilePictureUrl').optional().isString().trim(),
      body('contactInfo.email').isEmail().toLowerCase().withMessage('Email must be valid').trim(),
      body('contactInfo.phone.area').isString().trim(),
      body('contactInfo.phone.number').isString().trim(),
      body('contactInfo.address.street').optional().toLowerCase().isString().trim(),
      body('contactInfo.address.city').optional().toLowerCase().isString().trim(),
      body('contactInfo.address.province').optional().toLowerCase().isString().trim(),
      body('contactInfo.address.country').optional().toLowerCase().isString().trim(),
      body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
      body('licenseNumber').optional().isString().trim()
    ];
  }

  static get signIn(): ValidationChain[] {
    return [
      body('email').isEmail().toLowerCase().withMessage('Email must be valid').trim(),
      body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ];
  }

  static get patient(): ValidationChain[] {
    return [
      body('name').isString().toLowerCase().trim(),
      body('profilePictureUrl').optional().isString().trim(),
      body('lastName').isString().toLowerCase().trim(),
      body('contactInfo.email').optional().isEmail().toLowerCase().withMessage('Email must be valid').trim(),
      body('contactInfo.phone.area').isString().trim(),
      body('contactInfo.phone.number').isString().trim(),
      body('contactInfo.address.street').optional().toLowerCase().isString().trim(),
      body('contactInfo.address.city').optional().toLowerCase().isString().trim(),
      body('contactInfo.address.province').optional().toLowerCase().isString().trim(),
      body('contactInfo.address.country').optional().toLowerCase().isString().trim(),
      body('identificationNumber').trim().isNumeric(),
      body('notes').optional().isString().trim(),
      body('emergencyContact.name').optional().isString().toLowerCase().trim(),
      body('emergencyContact.relation').optional().toLowerCase().isString().trim(),
      body('emergencyContact.contactInfo.email').optional().isEmail().toLowerCase().withMessage('Email must be valid').trim(),
      body('emergencyContact.contactInfo.phone.area').optional().isString().trim(),
      body('emergencyContact.contactInfo.phone.number').optional().isString().trim(),
      body('emergencyContact.contactInfo.address.street').optional().toLowerCase().isString().trim(),
      body('emergencyContact.contactInfo.address.city').optional().toLowerCase().isString().trim(),
      body('emergencyContact.contactInfo.address.province').optional().toLowerCase().isString().trim(),
      body('emergencyContact.contactInfo.address.country').optional().toLowerCase().isString().trim()
    ];
  }

  static get forgotPassword(): ValidationChain[] {
    return [body('email').isEmail().toLowerCase().withMessage('Email must be valid').trim()];
  }

  static get resetPassword(): ValidationChain[] {
    return [body('newPassword').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')];
  }
}
