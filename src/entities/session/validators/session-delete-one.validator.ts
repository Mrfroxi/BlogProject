import { param } from 'express-validator';

export const deviceIdValidator = param('deviceId')
  .trim()
  .isString()
  .withMessage('must be a string');
