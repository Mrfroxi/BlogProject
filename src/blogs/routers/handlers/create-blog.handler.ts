import {Request,Response} from "express";
import {blogsRepository} from "../../repositories/blogs.repository";
import {Blog} from "../../types/blog";
import {HttpStatuses} from "../../../core/types/http-statuses";
import {mapBlogToOutput} from "../mappers/map-blog-to-output";
import {body} from "express-validator";
import {WithId} from "mongodb";


export async  function  createBlogHandler(req:Request,res:Response){

    const { body } = req;

    const newBlog : Blog = {
        name:body.name,
        createdAt: `${new Date().toISOString()}`,
        description: body.description,
        isMembership: false,
        websiteUrl: body.websiteUrl,
    }

    const blog:WithId<Blog> = await blogsRepository.createBlog(newBlog);

    res.status(HttpStatuses.Created).send(mapBlogToOutput(blog));
}