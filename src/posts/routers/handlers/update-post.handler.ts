import {Request,Response} from 'express'
import {postsRepository} from "../../repositories/posts.repository";
import {Post} from "../../types/post";
import {HttpStatuses} from "../../../core/types/http-statuses";
import {postUpdateDto} from "../../dto/post-update.input";
import {WithId} from "mongodb";


export const updatePostHandler =async (req:Request,res:Response) =>{

    const id = req.params.id;
    const reqBody:postUpdateDto = req.body;

    const updatedPost: Promise<void> =  postsRepository.updatePost(id,reqBody)

    if(!updatedPost){
        res.sendStatus(HttpStatuses.NotFound)
    }

    res.sendStatus(HttpStatuses.NoContent);

}