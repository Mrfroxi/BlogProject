import {body} from "express-validator";

const loginPattern = '^[a-zA-Z0-9_-]*$'
const emailPattern = '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'

const userLoginValidator = body('login')
    .trim()
    .isString().withMessage('must be a string')
    .isLength({min:3,max:10}).withMessage('min-max login length 3-10')
    .matches(loginPattern).withMessage('login contains invalid characters')


const userEmailValidator = body('email')
    .trim()
    .isString().withMessage('must be a string')
    .matches(emailPattern).withMessage('email has invalid format')


const userPasswordValidation = body('password')
    .trim()
    .isString().withMessage('must be a string')
    .isLength({min:6,max:20}).withMessage('min-max password length 6-20')


export const userCreateValidator = [
    userPasswordValidation,
    userLoginValidator,
    userEmailValidator
]