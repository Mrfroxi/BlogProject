import {PaginationDefaults} from "../types/pagination-and-sorting.default";
import {paginationAndSortingDefault} from "../middlewares/validation/pagination.sorting.validator";



export function setDefaultSortAndPaginationIfNotExist<T = string>(
    query: Partial<PaginationDefaults<T>>,
): PaginationDefaults<T> {
    return {
        ...paginationAndSortingDefault,
        ...query,
        sortBy: query.sortBy ?? paginationAndSortingDefault.sortBy as T,
    };
}
