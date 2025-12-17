import {Request,Response} from 'express'
import {postsRepository} from "../../repositories/posts.repository";
import {Post} from "../../types/post";
import {HttpStatuses} from "../../../core/types/http-statuses";


export const createPostHandler = (req:Request,res:Response) =>{

    const reqBody = req.body;

    const newPost:Post = postsRepository.createPost(reqBody)

    res.status(HttpStatuses.Created).send(newPost);

}