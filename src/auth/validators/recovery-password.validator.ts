import { body } from 'express-validator';

const emailPattern = '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$';

export const emailValidator = body('email')
  .trim()
  .isString()
  .withMessage('must be a string')
  .matches(emailPattern)
  .withMessage('email has invalid format');
