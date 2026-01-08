import {PaginationDefaults} from "../types/pagination-and-sorting.default";
import {paginationAndSortingDefault} from "../middlewares/validation/pagination.sorting.validator";
import {BlogQueryInput} from "../../blogs/dto/blog-query-input";
import {BlogSortField} from "../types/blog-sortField";


export function setDefaultSortAndPaginationIfNotExist<
    T extends BlogSortField
>(
    query: PaginationDefaults<T>,
): BlogQueryInput {
    return {
        ...paginationAndSortingDefault,
        ...query,
        sortBy: query.sortBy ?? paginationAndSortingDefault.sortBy,
    };
}
