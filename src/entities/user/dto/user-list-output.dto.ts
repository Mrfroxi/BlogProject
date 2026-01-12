import {UserOutputDto} from "./user-output.dto";


export interface UserListOutputDto {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: UserOutputDto[],
}