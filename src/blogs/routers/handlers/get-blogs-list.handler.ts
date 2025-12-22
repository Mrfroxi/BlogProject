import {Request, Response} from "express";
import {blogsRepository} from "../../repositories/blogs.repository";
import {Blog} from "../../types/blog";
import {HttpStatuses} from "../../../core/types/http-statuses";
import {mapBlogsListToOutput} from "../mappers/map-blogs-list-to-output";
import {WithId} from "mongodb";

export async function getBlogsListHandler(_req:Request, res:Response){

    try{
        const blogs: WithId<Blog>[] =  await blogsRepository.findAll()

        res.status(HttpStatuses.Ok).send(mapBlogsListToOutput(blogs));

    }catch (e:unknown){

        res.sendStatus(HttpStatuses.InternalServerError)

    }


}