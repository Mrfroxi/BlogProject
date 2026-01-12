import {SortDirection} from "mongodb";


export type DefaultValuesSortingDto = {
    sortBy: string;
    sortDirection: SortDirection;
    pageNumber: number;
    pageSize: number;
} & Partial<{
    searchEmailTerm: string | null;
    searchLoginTerm: string | null;
}>