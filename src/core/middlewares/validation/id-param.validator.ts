import {param} from "express-validator";

export const IdParamValidator = param('id')
    .isInt({min:0}).withMessage('ID must be')
