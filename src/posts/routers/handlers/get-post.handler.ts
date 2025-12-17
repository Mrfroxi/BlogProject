import {Request,Response} from 'express'
import {postsRepository} from "../../repositories/posts.repository";
import {HttpStatuses} from "../../../core/types/http-statuses";

export const getPostHandler = (req:Request,res:Response) =>{

    const postId = req.params.id;

    const post = postsRepository.getPostById(+postId);

    if(!post){
        res.sendStatus(HttpStatuses.NotFound)
        return
    }

    res.status(HttpStatuses.Ok).send(post);

}