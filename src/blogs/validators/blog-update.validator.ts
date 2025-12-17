import {body} from "express-validator";

const webRegex = process.env['WEB_REGEX'] || '' ;

const blogNameValidator = body('name')
    .notEmpty().withMessage('name is empty')
    .isString().withMessage('name must be a string')
    .trim()
    .isLength({ max: 15 }).withMessage('Length of name is not correct')

const blogDescriptionValidator = body('description')
    .notEmpty().withMessage('Description is empty')
    .isString().withMessage('Description must be a string')
    .trim()
    .isLength({ max: 500 }).withMessage('Description of name is not correct')


const blogWebsiteUrlValidator = body('websiteUrl')
    .notEmpty().withMessage('websiteUrl is empty')
    .isString().withMessage('websiteUrl must be a string')
    .trim()
    .isLength({ max: 100 }).withMessage('websiteUrl of name is not correct')
    .matches(webRegex).withMessage('Regex')

export const blogUpdateValidator = [
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteUrlValidator
]