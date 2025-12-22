import {Request,Response} from 'express'
import {HttpStatuses} from "../../../core/types/http-statuses";
import {blogsRepository} from "../../repositories/blogs.repository";

export const  updateBlogHandler = async (req:Request,res:Response) =>{
    try {
        const blogId = req.params.id;
        const reqBody = req.body;

        const blog = await blogsRepository.findById(blogId);

        if(!blog){
            res.sendStatus(HttpStatuses.NotFound).send(
                {
                    "errorsMessages": [
                        {
                            "message": "id",
                            "field": "blog not found"
                        }
                    ]
                }
            );
            return;
        }

        await blogsRepository.updateBlog(blogId,reqBody)
        res.sendStatus(HttpStatuses.NoContent)

    }catch (e:unknown){
        res.sendStatus(HttpStatuses.InternalServerError)
    }
}
