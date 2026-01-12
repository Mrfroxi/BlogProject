import {Request,Response} from 'express'
import {HttpStatuses} from "../../../../core/types/http-statuses";
import {errorHandler} from "../../../../core/errors/handler/errorHandler";
import {postService} from "../../services/post.service";


export const updatePostHandler =async (req:Request,res:Response) =>{
    try {
        const postId = req.params.id;
        const reqBody = req.body;

        await postService.updatePost(postId,reqBody)

        res.sendStatus(HttpStatuses.NoContent)

    }catch (e:unknown){
        errorHandler(e,res)
    }

}