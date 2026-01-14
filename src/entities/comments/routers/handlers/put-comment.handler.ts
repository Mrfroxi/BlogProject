import {Request,Response} from "express";
import {ResultStatus} from "../../../../core/result/resultCode";
import {resultCodeToHttpException} from "../../../../core/result/resultCodeToHttpException";
import {HttpStatuses} from "../../../../core/types/http-statuses";
import {commentService} from "../../services/comment.service";

export const updateCommentHandler = async (req:Request,res:Response) => {


    const commentId = req.params.commentId;
    const {content} = req.body;
    const userId = req.userId!

    const updatedComment = await commentService.updateComment({commentId,content,userId})

    if (updatedComment.status !== ResultStatus.Success) {
        return res.status(resultCodeToHttpException(updatedComment.status)).send(updatedComment.extensions);
    }

    res.sendStatus(HttpStatuses.NoContent)

}