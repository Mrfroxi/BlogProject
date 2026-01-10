import {paginationAndSortingDefault} from "../middlewares/validation/pagination.sorting.validator";
import {PaginationDefaults} from "../types/pagination-and-sorting.default";



export function setDefaultSortAndPaginationIfNotExist<P = string>(
    query: Partial<PaginationDefaults<P>>,
): PaginationDefaults<P> {
    return {
        ...paginationAndSortingDefault,
        ...query,
        sortBy: (query.sortBy ?? paginationAndSortingDefault.sortBy) as P,
    };
}
