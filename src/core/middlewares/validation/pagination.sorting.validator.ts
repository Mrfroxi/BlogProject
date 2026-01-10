import { query } from 'express-validator';
import {SortDirection} from "../../types/sort-direction";
import {PaginationDefaults} from "../../types/pagination-and-sorting.default";


const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = SortDirection.Desc;
const DEFAULT_SORT_BY = 'createdAt';


export const paginationAndSortingDefault:PaginationDefaults<string> = {
    pageNumber: DEFAULT_PAGE_NUMBER,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: DEFAULT_SORT_BY,
    sortDirection: DEFAULT_SORT_DIRECTION,
}


//the elements in the array must be of type string
export function paginationSortingValidator<T extends string>(
    sortFieldsEnum:  Record<string,T>, //for enum
) {

    const allowedSortFields = Object.values(sortFieldsEnum);

    const allowSortDirections = Object.values(SortDirection);

    return [
        query('pageNumber')
            .default(DEFAULT_PAGE_NUMBER)
            .isInt({ min: 1 })
            .withMessage('Page number must be a positive integer')
            .toInt(),

        query('pageSize')
            .default(DEFAULT_PAGE_SIZE)
            .isInt({ min: 1, max: 100 })
            .withMessage('Page size must be between 1 and 100')
            .toInt(),

        query('sortDirection')
            .default(DEFAULT_SORT_DIRECTION)
            .isIn(allowSortDirections)
            .withMessage('Sort direction must be either asc or desc'),

        query('sortBy')
            .default(allowedSortFields[0])
            .isIn(allowedSortFields)
            .withMessage(`Sort field must be one of: ${allowedSortFields}`),

        query('searchNameTerm')
            .optional({ nullable: true })
            .isString()
            .withMessage('searchNameTerm must be a string'),
    ];
}
