import {Request,Response, NextFunction} from 'express'
import {blogsRepository} from "../../../blogs/repositories/blogs.repository";
import {HttpStatuses} from "../../../core/types/http-statuses";
import {postsRepository} from "../../repositories/posts.repository";

export const deletePostHandler = (req:Request,res:Response,next:NextFunction) =>{

    const id = req.params.id;


    const deletedPost:number | null = postsRepository.deletePost(id)

    if(!deletedPost && deletedPost !== 0){
        res.sendStatus(HttpStatuses.NotFound);
        return
    }

    res.sendStatus(HttpStatuses.NoContent);

}