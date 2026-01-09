import {PaginationDefaults} from "../../core/types/pagination-and-sorting.default";
import {PostSortField} from "../types/post-sort-fields";


export type PostQueryInput = PaginationDefaults<PostSortField>& Partial<{
    searchNameTerm:string;
}>