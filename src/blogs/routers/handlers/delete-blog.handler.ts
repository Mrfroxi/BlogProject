import {Request,Response, NextFunction} from 'express'
import {blogsRepository} from "../../repositories/blogs.repository";
import {HttpStatuses} from "../../../core/types/http-statuses";

export const deleteBlogHandler = async (req:Request,res:Response,next:NextFunction) =>{

    const id = req.params.id;

    const blog = await blogsRepository.findById(id);

    if (!blog) {
        res
            .status(HttpStatuses.NotFound)
            .send(
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

    await blogsRepository.deleteBlog(id)

    res.sendStatus(HttpStatuses.NoContent);

}