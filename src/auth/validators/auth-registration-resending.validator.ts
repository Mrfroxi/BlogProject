import {body} from "express-validator";


export const emailResendingValidator = body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format')