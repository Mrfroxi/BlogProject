import {Request,Response} from 'express'
import {blogService} from "../../services/blog.service";
import {HttpStatuses} from "../../../../core/types/http-statuses";
import {errorHandler} from "../../../../core/errors/handler/errorHandler";

export const  updateBlogHandler = async (req:Request,res:Response) =>{
    try {
        const blogId = req.params.id;
        const reqBody = req.body;

        await blogService.updateBlog(blogId,reqBody)

        res.sendStatus(HttpStatuses.NoContent)

    }catch (e:unknown){
       errorHandler(e,res)
    }
}
