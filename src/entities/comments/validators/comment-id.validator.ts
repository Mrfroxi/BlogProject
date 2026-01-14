import { param } from 'express-validator';

export const idParamValidator = (paramName: string = 'id') =>
    param(paramName)
        .exists()
        .withMessage('ID is required')
        .isString()
        .withMessage('ID must be a string')
        .isMongoId()
        .withMessage('Неверный формат ObjectId');
