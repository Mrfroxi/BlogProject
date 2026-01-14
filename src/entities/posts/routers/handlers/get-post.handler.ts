import {Request,Response} from 'express'
import {HttpStatuses} from "../../../../core/types/http-statuses";
import {postService} from "../../services/post.service";
import {ResultType} from "../../../../core/result/result.type";
import {PostOutput} from "../../dto/post.output";
import {ResultStatus} from "../../../../core/result/resultCode";
import {resultCodeToHttpException} from "../../../../core/result/resultCodeToHttpException";

export const getPostHandler =   async (req:Request,res:Response) =>{

    const postId:string = req.params.id;

    const postResult:ResultType<PostOutput|null> = await postService.findPostById(postId);

    if (postResult.status !== ResultStatus.Success) {
        return res.status(resultCodeToHttpException(postResult.status)).send(postResult.extensions);
    }

    res.status(HttpStatuses.Ok).send(postResult.data);

}