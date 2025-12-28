import {SortDirection} from "mongodb";

export interface PaginationDefaults<T>{
    pageNumber: number;
    pageSize: number;
    sortBy: T;
    sortDirection: SortDirection;
}