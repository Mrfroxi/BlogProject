import {Request,Response} from 'express'
import {postsRepository} from "../../repositories/posts.repository";
import {HttpStatuses} from "../../../core/types/http-statuses";
import {WithId} from "mongodb";
import {Post} from "../../types/post";
import {mapPostToOutput} from "../mappers/map-post-to-output";

export const getPostHandler =   async (req:Request,res:Response) =>{

    const postId:string = req.params.id;

    const post:WithId<Post> | null = await postsRepository.findById(postId);

    if(!post){
        res.sendStatus(HttpStatuses.NotFound)
        return
    }

    res.status(HttpStatuses.Ok).send(mapPostToOutput(post));

}