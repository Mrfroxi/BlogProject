import {Response,Request} from "express";
import {blogService} from "../../services/blog.service";
import {errorHandler} from "../../../core/errors/handler/errorHandler";
import {WithId} from "mongodb";
import {Blog} from "../../types/blog";
import {HttpStatuses} from "../../../core/types/http-statuses";
import {mapBlogToOutput} from "../mappers/map-blog-to-output";


export async function getBlogHandler(req:Request, res:Response){

    const blogId:string = req.params.id;

    try {
      const blog:WithId<Blog> = await  blogService.findById(blogId);

      res.status(HttpStatuses.Ok).send(mapBlogToOutput(blog))
    }catch (e){
        errorHandler(e, res);
    }

}