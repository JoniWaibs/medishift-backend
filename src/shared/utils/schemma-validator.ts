import { body, ValidationChain } from 'express-validator';

export class Validator {
  static get signUp(): ValidationChain[] {
    return [
      body('name').trim(),
      body('lastName').trim(),
      body('contactInfo.email').isEmail().withMessage('Email must be valid').trim(),
      body('contactInfo.phone.area').trim(),
      body('contactInfo.phone.number').trim(),
      body('contactInfo.address.street').trim(),
      body('contactInfo.address.city').trim(),
      body('contactInfo.address.province').trim(),
      body('contactInfo.address.country').trim(),
      body('licenseNumber').trim(),
      body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ];
  }

  static get signIn(): ValidationChain[] {
    return [
      body('email').isEmail().withMessage('Email must be valid').trim(),
      body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ];
  }
}
