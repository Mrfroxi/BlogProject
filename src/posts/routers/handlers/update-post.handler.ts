import {Request,Response} from 'express'
import {postsRepository} from "../../repositories/posts.repository";
import {HttpStatuses} from "../../../core/types/http-statuses";




export const updatePostHandler =async (req:Request,res:Response) =>{
    try {
        const postId = req.params.id;
        const reqBody = req.body;

        const post = await postsRepository.findById(postId);

        if(!post){
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

        await postsRepository.updatePost(postId,reqBody)
        res.sendStatus(HttpStatuses.NoContent)

    }catch (e:unknown){
        res.sendStatus(HttpStatuses.InternalServerError)
    }

}