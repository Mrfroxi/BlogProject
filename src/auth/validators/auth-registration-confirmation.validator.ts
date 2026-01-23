import {body} from "express-validator";


export const codeValidator = body('code')
    .trim()
    .isString().withMessage('code must be a string')