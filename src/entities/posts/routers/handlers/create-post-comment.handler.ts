import {Request,Response} from "express";
import {commentService} from "../../../comments/services/comment.service";
import {ResultStatus} from "../../../../core/object-result/resultCode";
import {resultCodeToHttpException} from "../../../../core/object-result/resultCodeToHttpException";
import {HttpStatuses} from "../../../../core/types/http-statuses";



export  const createPostCommentHandler = async (req:Request,res:Response) => {

    const userId = req.userId!;
    const postId = req.params.postId;
    const content = req.body.content;


    const createdComment = await commentService.createComment({userId,postId,content})


    if(createdComment.status !== ResultStatus.Success){
        return   res.status(resultCodeToHttpException(createdComment.status)).send(createdComment.extensions)
    }

    res.status(HttpStatuses.Created).send(createdComment.data)


}