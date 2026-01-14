interface userInfo {
    userId:string
    userLogin:string
}

export type Comment = {
    postId:string,
    commentatorInfo :userInfo,
    content:string,
    createdAt:string
}