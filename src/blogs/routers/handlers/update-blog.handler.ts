import {Request,Response} from 'express'
import {HttpStatuses} from "../../../core/types/http-statuses";
import {blogsRepository} from "../../repositories/blogs.repository";

export const updateBlogHandler = (req:Request,res:Response) =>{

    const blogId = req.params.id;
    const reqBody = req.body;

    const updatedBlog = blogsRepository.updateBlog(blogId,reqBody);

    if(!updatedBlog){
        res.sendStatus(HttpStatuses.NotFound)
    }

    res.sendStatus(HttpStatuses.NoContent);


}