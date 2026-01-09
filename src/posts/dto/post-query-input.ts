import {PaginationDefaults} from "../../core/types/pagination-and-sorting.default";


export type PostQueryInput<T> = PaginationDefaults<T>& Partial<{
    searchNameTerm:string;
    id: string;
}>

