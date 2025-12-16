import {Request, Response} from "express";
import {blogsRepository} from "../../repositories/blogs.repository";
import {Blog} from "../../types/blog";
import {HttpStatuses} from "../../../core/types/http-statuses";
import {mapBlogsListToOutput} from "../mappers/map-blogs-list-to-output";

export function getBlogsListHandler(_req:Request, res:Response){

    const blogs:Blog[] = blogsRepository.findAll()

    res.status(HttpStatuses.Ok).send(mapBlogsListToOutput(blogs));

}