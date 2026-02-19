import { body } from 'express-validator';

export const passwordValidator = body('newPassword')
  .trim()
  .isString()
  .withMessage('must be a string')
  .isLength({ min: 6, max: 20 })
  .withMessage('min-max login length 3-10');

export const codeValidator = body('recoveryCode').trim().isString().withMessage('must be a string');

export const newPasswordValidator = [passwordValidator, codeValidator];
