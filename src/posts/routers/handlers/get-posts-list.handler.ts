import {Response,Request} from "express";
import {postsRepository} from "../../repositories/posts.repository";
import {HttpStatuses} from "../../../core/types/http-statuses";
import {Post} from "../../types/post";

export const getPostListHandler = (_req:Request,res:Response) =>{


    const posts:Post[] = postsRepository.getPostsList();

    res.status(HttpStatuses.Ok).send(posts);

}