import {UserSortBy} from "../types/user-sortBy";
import {UserSortDirection} from "../types/user-sortDirection";
import {DefaultValuesSortingDto} from "../dto/default-values-sorting.dto";
import {query} from "express-validator";

const SORT_BY_DEFAULT = UserSortBy.createdAt;
const SORT_DIRECTION_DEFAULT = UserSortDirection.desc
const PAGE_NUMBER_DEFAULT = 1
const PAGE_SIZE_DEFAULT = 10
const SEARCH_LOGIN_TERM = null
const SEARCH_EMAIL_TERM = null

export const defaultValuesUserSorting:DefaultValuesSortingDto = {
    sortBy:SORT_BY_DEFAULT,
    sortDirection:SORT_DIRECTION_DEFAULT,
    pageNumber:PAGE_NUMBER_DEFAULT,
    pageSize:PAGE_SIZE_DEFAULT,
    searchEmailTerm:SEARCH_EMAIL_TERM,
    searchLoginTerm:SEARCH_LOGIN_TERM
}


    const sortByValidation = query('sortBy')
        .default(UserSortBy.createdAt)
        .isIn(Object.values(UserSortBy))
        .withMessage('Invalid sortBy value')

    const sortDirection = query('sortDirection')
        .default(UserSortDirection.desc)
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

    const  searchLoginTerm = query('searchLoginTerm')
            .optional({ nullable: true })
            .isString()
            .withMessage('searchNameTerm must be a string')

    const  searchEmailTerm = query('searchEmailTerm')
        .optional({ nullable: true })
        .isString()
        .withMessage('searchNameTerm must be a string')



    export const paginationSortingUserList = [
        sortByValidation,
        sortDirection,
        pageNumber,
        pageSize,
        searchLoginTerm,
        searchEmailTerm
    ]

