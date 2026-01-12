import {Request,Response} from "express";
import {mapBlogToOutput} from "../mappers/map-blog-to-output";
import {WithId} from "mongodb";
import {Blog} from "../../types/blog";
import {HttpStatuses} from "../../../../core/types/http-statuses";
import {blogService} from "../../services/blog.service";
import {errorHandler} from "../../../../core/errors/handler/errorHandler";


export async  function  createBlogHandler(req:Request,res:Response){

    const { body } = req;
    try{
        const createdBlog:WithId<Blog> = await blogService.createBlog(body);

        res.status(HttpStatuses.Created).send(mapBlogToOutput(createdBlog));

    }catch (e:unknown){
        errorHandler(e, res);
    }
}