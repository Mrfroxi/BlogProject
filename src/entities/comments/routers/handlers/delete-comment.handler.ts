import {Request,Response} from "express";
import {ResultStatus} from "../../../../core/result/resultCode";
import {resultCodeToHttpException} from "../../../../core/result/resultCodeToHttpException";
import {commentService} from "../../services/comment.service";
import {HttpStatuses} from "../../../../core/types/http-statuses";


export const deleteCommentHandler = async (req:Request,res:Response)=>{

    const userId = req.userId!
    const commentId = req.params.commentId

    const isDelete = await commentService.deleteComment({userId,commentId})

    if (isDelete.status !== ResultStatus.Success) {
         return res.status(resultCodeToHttpException(isDelete.status)).send(isDelete.extensions);
    }

    res.sendStatus(HttpStatuses.NoContent)

}