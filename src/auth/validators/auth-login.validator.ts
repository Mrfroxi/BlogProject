import {body} from "express-validator";


const loginOrEmailValidator = body('loginOrEmail')
    .trim()
    .isString().withMessage('must be a string')
    .isLength({min:3}).withMessage('min login length 3')


const passwordValidator = body('password')
    .trim()
    .isString().withMessage('must be a string')
    .isLength({min:1}).withMessage('min login length 1')

export const authLoginValidator = [
    loginOrEmailValidator,
    passwordValidator
]