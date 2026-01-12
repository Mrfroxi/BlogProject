import {body} from "express-validator";

const titleValidator = body('title')
    .trim()
    .notEmpty().withMessage('title must be')
    .isString().withMessage('title must be a string')
    .isLength({max:30}).withMessage('title max length 30 symbols')

const shortDescriptionValidator = body('shortDescription')
    .trim()
    .notEmpty().withMessage('shortDescription must be')
    .isString().withMessage('shortDescription must be a string')
    .isLength({max:100}).withMessage('shortDescription max length 100 symbols')

const contentValidator = body('content')
    .trim()
    .notEmpty().withMessage('content must be')
    .isString().withMessage('content must be a string')
    .isLength({max:100}).withMessage('content max length 30 symbols')

const blogIdValidator = body('blogId')
    .notEmpty().withMessage('title must be')
    .isString().withMessage('title must be a string')


export const postCreateValidator = [
    titleValidator,
    shortDescriptionValidator,
    contentValidator,
    blogIdValidator
]