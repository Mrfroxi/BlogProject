import {Response,Request} from "express";
import {blogsRepository} from "../../repositories/blogs.repository";
import {Blog} from "../../types/blog";
import {HttpStatuses} from "../../../core/types/http-statuses";
import {mapBlogToOutput} from "../mappers/map-blog-to-output";
import {WithId} from "mongodb";


export async function getBlogHandler(req:Request, res:Response){

    const blogId:string = req.params.id;

    const blog:WithId<Blog> | null= await  blogsRepository.findById(blogId);

    if(blog){
        res.status(HttpStatuses.Ok).send(mapBlogToOutput(blog));
    }else{
        res.sendStatus(HttpStatuses.NotFound);
    }

}