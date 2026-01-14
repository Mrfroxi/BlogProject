
interface userInfo {
    userId:string
    userLogin:string
}

export type CommentOutputDto = {
    id:string
    commentatorInfo :userInfo,
    content:string,
    createdAt:string
}