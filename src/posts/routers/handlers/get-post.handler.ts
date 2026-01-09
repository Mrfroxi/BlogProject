import {Request,Response} from 'express'
import {HttpStatuses} from "../../../core/types/http-statuses";
import {mapPostToOutput} from "../mappers/map-post-to-output";
import {postService} from "../../services/post.service";
import {WithId} from "mongodb";
import {Post} from "../../types/post";
import {errorHandler} from "../../../core/errors/handler/errorHandler";

export const getPostHandler =   async (req:Request,res:Response) =>{

    const postId:string = req.params.id;

    try{
        const post:WithId<Post> = await postService.findPostById(postId);

        res.status(HttpStatuses.Ok).send(mapPostToOutput(post));

    }catch (e){
        errorHandler(e,res)
    }

}