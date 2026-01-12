import {UserOutputDto} from "./user-output.dto";


export interface UserListOutputDto {
    pageCount: number
    page: number
    pageSize: number
    totalCount: number
    items: UserOutputDto[],
}