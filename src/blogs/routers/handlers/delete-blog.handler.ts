import {Request,Response, NextFunction} from 'express'
import {blogsRepository} from "../../repositories/blogs.repository";
import {HttpStatuses} from "../../../core/types/http-statuses";

export const deleteBlogHandler = (req:Request,res:Response,next:NextFunction) =>{

    const id = req.params.id;

    const deletedBlog:number | null = blogsRepository.deleteBlog(id)

    if(!deletedBlog && deletedBlog !== 0){
        res.sendStatus(HttpStatuses.NotFound);
        return
    }

    res.sendStatus(HttpStatuses.NoContent);

}