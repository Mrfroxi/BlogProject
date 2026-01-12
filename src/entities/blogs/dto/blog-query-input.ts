import {PaginationDefaults} from "../../../core/types/pagination-and-sorting.default";
import {BlogSortField} from "../types/blog-sortField";


export type BlogQueryInput = PaginationDefaults<BlogSortField> &
    Partial<{
        searchNameTerm: string;
    }>;
