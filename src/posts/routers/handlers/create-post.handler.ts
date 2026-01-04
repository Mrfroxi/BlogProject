import {Request,Response} from 'express'
import {postsRepository} from "../../repositories/posts.repository";
import {Post} from "../../types/post";
import {HttpStatuses} from "../../../core/types/http-statuses";
import {WithId} from "mongodb";
import {mapPostToOutput} from "../mappers/map-post-to-output";
import {Blog} from "../../../blogs/types/blog";


export const createPostHandler = async (req:Request,res:Response) =>{

    const reqBody = req.body;

    const   createPostDto : Post = {
        blogId: reqBody.blogId,
        blogName: "string",
        content: reqBody.content,
        createdAt: `${new Date().toISOString()}`,
        shortDescription: reqBody.shortDescription,
        title: reqBody.title

    }

    const newPost:WithId<Post> = await postsRepository.createPost(createPostDto)

    res.status(HttpStatuses.Created).send(mapPostToOutput(newPost));

}