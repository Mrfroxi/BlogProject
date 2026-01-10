import { Request, Response } from 'express';
import {HttpStatuses} from "../../../core/types/http-statuses";
import {postService} from "../../../posts/services/post.service";
import {errorHandler} from "../../../core/errors/handler/errorHandler";
import {blogService} from "../../services/blog.service";
import {mapPostToOutput} from "../../../posts/routers/mappers/map-post-to-output";


export const  createBlogPostHandler =  async (req:Request,res:Response) =>{

    const blogId = req.params.blogId;
    const reqBody = req.body
    try {


        const createdPost =  await postService.createPost({blogId,...reqBody})

        await blogService.findById(blogId)

        res.status(HttpStatuses.Created).send(mapPostToOutput(createdPost));

    }catch (e:unknown){
        errorHandler(e,res)
    }

}