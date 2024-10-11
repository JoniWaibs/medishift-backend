import { body, ValidationChain } from 'express-validator';

export class Validator {
  static get signUp(): ValidationChain[] {
    return [
      body('name').isString().trim(),
      body('lastName').isString().trim(),
      body('profilePictureUrl').optional().isString().trim(),
      body('contactInfo.email').isEmail().withMessage('Email must be valid').trim(),
      body('contactInfo.phone.area').isString().trim(),
      body('contactInfo.phone.number').isString().trim(),
      body('contactInfo.address.street').optional().isString().trim(),
      body('contactInfo.address.city').optional().isString().trim(),
      body('contactInfo.address.province').optional().isString().trim(),
      body('contactInfo.address.country').optional().isString().trim(),
      body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
      body('licenseNumber').optional().isString().trim()
    ];
  }

  static get signIn(): ValidationChain[] {
    return [
      body('email').isEmail().withMessage('Email must be valid').trim(),
      body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ];
  }

  static get patient(): ValidationChain[] {
    return [
      body('name').isString().trim(),
      body('profilePictureUrl').optional().isString().trim(),
      body('lastName').isString().trim(),
      body('contactInfo.email').optional().isEmail().withMessage('Email must be valid').trim(),
      body('contactInfo.phone.area').isString().trim(),
      body('contactInfo.phone.number').isString().trim(),
      body('contactInfo.address.street').optional().isString().trim(),
      body('contactInfo.address.city').optional().isString().trim(),
      body('contactInfo.address.province').optional().isString().trim(),
      body('contactInfo.address.country').optional().isString().trim(),
      body('identificationNumber').trim().isNumeric(),
      body('notes').optional().isString().trim(),
      body('emergencyContact.name').optional().isString().trim(),
      body('emergencyContact.relation').optional().isString().trim(),
      body('emergencyContact.contactInfo.email').optional().isEmail().withMessage('Email must be valid').trim(),
      body('emergencyContact.contactInfo.phone.area').optional().isString().trim(),
      body('emergencyContact.contactInfo.phone.number').optional().isString().trim(),
      body('emergencyContact.contactInfo.address.street').optional().isString().trim(),
      body('emergencyContact.contactInfo.address.city').optional().isString().trim(),
      body('emergencyContact.contactInfo.address.province').optional().isString().trim(),
      body('emergencyContact.contactInfo.address.country').optional().isString().trim()
    ];
  }
}
