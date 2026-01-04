import {Request,Response} from 'express'
import {postsRepository} from "../../repositories/posts.repository";
import {Post} from "../../types/post";
import {HttpStatuses} from "../../../core/types/http-statuses";
import {WithId} from "mongodb";
import {mapPostToOutput} from "../mappers/map-post-to-output";


export const createPostHandler = async (req:Request,res:Response) =>{

    const reqBody = req.body;

    const newPost:WithId<Post> = await postsRepository.createPost(reqBody)

    res.status(HttpStatuses.Created).send(mapPostToOutput(newPost));

}