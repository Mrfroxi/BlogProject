import {Request,Response} from "express";
import {commentService} from "../../services/comment.service";
import {ResultStatus} from "../../../../core/object-result/resultCode";
import {resultCodeToHttpException} from "../../../../core/object-result/resultCodeToHttpException";
import {HttpStatuses} from "../../../../core/types/http-statuses";


export const getCommentHandler= async (req:Request,res:Response) => {

    const commentId = req.params.id

    const commentResult =  await commentService.findById(commentId)

    if (commentResult.status !== ResultStatus.Success) {
        return res.status(resultCodeToHttpException(commentResult.status)).send(commentResult.extensions);
    }

    res.status(HttpStatuses.Ok).send(commentResult.data)
}