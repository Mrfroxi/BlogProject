import {param} from "express-validator";

export const blogIdParamValidator = param('blogId')
    .exists()
    .withMessage('ID is required')
    .isString()
    .withMessage('ID must be a string')
    .isMongoId()
    .withMessage('Неверный формат ObjectId');
