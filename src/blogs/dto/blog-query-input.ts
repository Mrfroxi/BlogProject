import {PaginationDefaults} from "../../core/types/pagination-and-sorting.default";
import {BlogSortField} from "../../core/types/blog-sortField";


export type BlogQueryInput = PaginationDefaults<BlogSortField> &
    Partial<{
        searchBlogNameTerm: string;
    }>;
