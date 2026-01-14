import {body, param} from "express-validator";


const postIdValidator = param('postId')
    .exists()
    .withMessage('ID is required')
    .isString()
    .withMessage('ID must be a string')
    .isMongoId()
    .withMessage('Неверный формат ObjectId');

const commentValidator = body('content')
    .trim()
    .isString().withMessage('must be a string')
    .isLength({min:20,max:300}).withMessage('min-max password length 20-300')


export const createCommentValidator = [
    postIdValidator,
    commentValidator
]