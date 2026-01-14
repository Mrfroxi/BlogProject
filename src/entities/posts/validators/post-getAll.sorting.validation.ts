import {param, query} from "express-validator";

import {UserSortDirection} from "../../user/types/user-sortDirection";
import {PostSortBy} from "../types/postSortBy";
import {UserSortBy} from "../../user/types/user-sortBy";


const SORT_BY_DEFAULT = PostSortBy.createdAt;
const SORT_DIRECTION_DEFAULT = UserSortDirection.desc
const PAGE_NUMBER_DEFAULT = 1
const PAGE_SIZE_DEFAULT = 10

const postIdParamValidate = param('postId')
    .exists()
    .withMessage('ID is required')
    .isString()
    .withMessage('ID must be a string')
    .isMongoId()
    .withMessage('Неверный формат ObjectId');

const sortByValidation = query('sortBy')
    .default(SORT_BY_DEFAULT)
    .isIn(Object.values(UserSortBy))
    .withMessage('Invalid sortBy value')

const sortDirection = query('sortDirection')
    .default(SORT_DIRECTION_DEFAULT)
    .isIn(Object.values(UserSortDirection))
    .withMessage('Invalid sortDirection value')

const pageNumber =   query('pageNumber')
    .default(PAGE_NUMBER_DEFAULT)
    .toInt()
    .isInt({ min: 1 })
    .withMessage('Page number must be a positive integer')

const pageSize = query('pageSize')
    .default(PAGE_SIZE_DEFAULT)
    .toInt()
    .isInt({ min: 1, max: 100 })
    .withMessage('Page size must be between 1 and 100')

export const getAllPostCommentsValidator = [
    postIdParamValidate,
    sortByValidation,
    sortDirection,
    pageNumber,
    pageSize,
]
