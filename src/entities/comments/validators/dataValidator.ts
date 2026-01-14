import {body} from "express-validator";


export const dataValidator = body('content')
    .trim()
    .isString().withMessage('must be a string')
    .isLength({min:20,max:300}).withMessage('min-max password length 20-300')