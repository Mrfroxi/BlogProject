import {Request,Response} from 'express'
import {Post} from "../../types/post";
import {HttpStatuses} from "../../../../core/types/http-statuses";
import {WithId} from "mongodb";
import {mapPostToOutput} from "../mappers/map-post-to-output";
import {errorHandler} from "../../../../core/errors/handler/errorHandler";
import {postService} from "../../services/post.service";


export const createPostHandler = async (req:Request,res:Response) =>{

    const reqBody = req.body;

    try {
        const newPost:WithId<Post> = await postService.createPost(reqBody);

        res.status(HttpStatuses.Created).send(mapPostToOutput(newPost));
    }catch (e){
        errorHandler(e,res)
    }


}