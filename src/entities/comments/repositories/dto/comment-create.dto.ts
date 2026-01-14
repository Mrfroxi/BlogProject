
interface userInfo {
    userId:string
    userLogin:string
}

export interface CommentCreateDto{
    userId:string,
    postId:string,
    content:string,
}
