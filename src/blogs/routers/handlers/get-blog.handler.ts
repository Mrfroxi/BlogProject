import {Response,Request} from "express";
import {blogsRepository} from "../../repositories/blogs.repository";
import {Blog} from "../../types/blog";
import {HttpStatuses} from "../../../core/types/http-statuses";
import {mapBlogToOutput} from "../mappers/map-blog-to-output";


export function getBlogHandler(req:Request, res:Response){

    const blogId:number = +req.params.id;

    const blog:Blog | null= blogsRepository.findById(blogId);

    if(blog){
        res.status(HttpStatuses.Ok).send(mapBlogToOutput(blog));
    }else{
        res.sendStatus(HttpStatuses.NotFound);
    }

}