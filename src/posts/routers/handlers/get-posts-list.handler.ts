import {Response,Request} from "express";
import {postsRepository} from "../../repositories/posts.repository";
import {HttpStatuses} from "../../../core/types/http-statuses";
import {Post} from "../../types/post";

export const getPostListHandler = async (_req:Request,res:Response) =>{


    const posts:Post[] = await  postsRepository.findAll();

    res.status(HttpStatuses.Ok).send(posts);

}