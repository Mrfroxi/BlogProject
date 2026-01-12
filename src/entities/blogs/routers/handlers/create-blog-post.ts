import { Request, Response } from 'express';
import {postService} from "../../../posts/services/post.service";
import {errorHandler} from "../../../../core/errors/handler/errorHandler";
import {mapPostToOutput} from "../../../posts/routers/mappers/map-post-to-output";
import {HttpStatuses} from "../../../../core/types/http-statuses";


export const  createBlogPostHandler =  async (req:Request,res:Response) =>{

    const blogId = req.params.blogId;
    const reqBody = req.body

    try {


        const createdPost =  await postService.createPost({blogId,...reqBody})

        res.status(HttpStatuses.Created).send(mapPostToOutput(createdPost));

    }catch (e:unknown){
        errorHandler(e,res)
    }

}