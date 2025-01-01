import { query } from 'express-validator';

//the elements in the array must be of type string
export function paginationSortingValidator<T extends string>(
    sortFieldsEnum:  Record<string,T>, //for enum
) {

    const allowedSortFields = Object.values(sortFieldsEnum);

    return [
        query('pageNumber')
            .default(1)
            .isInt({ min: 1 })
            .withMessage('Page number must be a positive integer')
            .toInt(),

        query('pageSize')
            .default(10)
            .isInt({ min: 1, max: 100 })
            .withMessage('Page size must be between 1 and 100')
            .toInt(),

        query('sortDirection')
            .default('desc')
            .isIn(['asc', 'desc'])
            .withMessage('Sort direction must be either asc or desc'),

        query('searchNameTerm')
            .optional({ nullable: true })
            .isString()
            .withMessage('searchNameTerm must be a string'),

        query('sortBy')
            .default(allowedSortFields[0])
            .isIn(allowedSortFields)
            .withMessage(`Sort field must be one of: ${allowedSortFields}`),
    ];
}
