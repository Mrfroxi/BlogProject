import {Request,Response, NextFunction} from 'express'
import {HttpStatuses} from "../../../core/types/http-statuses";
import {postsRepository} from "../../repositories/posts.repository";

export const deletePostHandler =async (req:Request,res:Response,next:NextFunction) =>{

    const id = req.params.id;

    const blog = await postsRepository.findById(id);

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

    await postsRepository.deletePost(id)

    res.sendStatus(HttpStatuses.NoContent);

}