import { query } from 'express-validator';
import { SortDirection } from "../../types/sort-direction";
import { PaginationDefaults } from "../../types/pagination-and-sorting.default";

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = SortDirection.Desc;
const DEFAULT_SORT_BY = 'createdAt';

export const paginationAndSortingDefault: PaginationDefaults<string> = {
    pageNumber: DEFAULT_PAGE_NUMBER,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: DEFAULT_SORT_BY,
    sortDirection: DEFAULT_SORT_DIRECTION,
};

export function paginationSortingValidator<T extends string>(
    sortFieldsEnum: Record<string, T>, // enum полей для сортировки
) {
    const allowedSortFields = Object.values(sortFieldsEnum);
    const allowedSortDirections = Object.values(SortDirection);

    return [
        query('pageNumber')
            .default(DEFAULT_PAGE_NUMBER)
            .toInt()
            .isInt({ min: 1 })
            .withMessage('Page number must be a positive integer'),

        query('pageSize')
            .default(DEFAULT_PAGE_SIZE)
            .toInt()
            .isInt({ min: 1, max: 10000 })
            .withMessage('Page size must be between 1 and 100'),

        query('sortDirection')
            .default(DEFAULT_SORT_DIRECTION)
            .isIn(allowedSortDirections)
            .withMessage(`Sort direction must be one of: ${allowedSortDirections.join(', ')}`),

        query('sortBy')
            .default(allowedSortFields[0])
            .isIn(allowedSortFields)
            .withMessage(`Sort field must be one of: ${allowedSortFields.join(', ')}`),

        query('searchNameTerm')
            .optional({ nullable: true })
            .isString()
            .withMessage('searchNameTerm must be a string'),
    ];
}
