import {param} from "express-validator";

export const idParamValidator = param('id')
    .exists()
    .withMessage('ID is required')
    .isString()
    .withMessage('ID must be a string')
    .isMongoId()
    .withMessage('Неверный формат ObjectId');
