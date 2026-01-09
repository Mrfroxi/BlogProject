import {paginationAndSortingDefault} from "../middlewares/validation/pagination.sorting.validator";
import {PostQueryInput} from "../../posts/dto/post-query-input";



export function setDefaultSortAndPaginationIfNotExist<
    T extends string
>(
    query: Partial<PostQueryInput<T>>,
): PostQueryInput<T> {
    return {
        ...paginationAndSortingDefault,
        ...query,
        sortBy: query.sortBy ?? paginationAndSortingDefault.sortBy as T,
    };
}

