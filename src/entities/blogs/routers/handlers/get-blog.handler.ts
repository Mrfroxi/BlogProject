import {Response,Request} from "express";
import {WithId} from "mongodb";
import {mapBlogToOutput} from "../mappers/map-blog-to-output";
import {Blog} from "../../types/blog";
import {blogService} from "../../services/blog.service";
import {HttpStatuses} from "../../../../core/types/http-statuses";
import {errorHandler} from "../../../../core/errors/handler/errorHandler";


export async function getBlogHandler(req:Request, res:Response){

    const blogId:string = req.params.id;

    try {
      const blog:WithId<Blog> = await  blogService.findById(blogId);

      res.status(HttpStatuses.Ok).send(mapBlogToOutput(blog))
    }catch (e){
        errorHandler(e, res);
    }

}