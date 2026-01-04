import {Response,Request} from "express";
import {postsRepository} from "../../repositories/posts.repository";
import {HttpStatuses} from "../../../core/types/http-statuses";
import {Post} from "../../types/post";
import {mapPostsListToOutput} from "../mappers/map-posts-list-to-output";
import {WithId} from "mongodb";

export const getPostListHandler = async (_req:Request,res:Response) =>{


    const posts:WithId<Post>[] = await  postsRepository.findAll();

    res.status(HttpStatuses.Ok).send(mapPostsListToOutput(posts));

}