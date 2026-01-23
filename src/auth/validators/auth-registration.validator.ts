import {body} from "express-validator";


const loginRegex = '^[a-zA-Z0-9_-]*$';

const emailRegex = '/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$/'

const loginValidator = body('login')
    .trim()
    .isString().withMessage('must be a string')
    .isLength({min:3,max:10}).withMessage('min login length 3 and max login length is 10')
    .matches(loginRegex)


const passwordValidator = body('password')
    .trim()
    .isString().withMessage('must be a string')
    .isLength({min:6,max:20}).withMessage('min login length 6 and max login length is 20')

const EmailValidator = body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format')


export const registerValidators = [
    loginValidator,
    passwordValidator,
    EmailValidator
]