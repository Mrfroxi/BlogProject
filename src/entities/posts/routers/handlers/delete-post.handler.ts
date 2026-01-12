import {Request,Response} from 'express'
import {HttpStatuses} from "../../../../core/types/http-statuses";
import {postService} from "../../services/post.service";
import {errorHandler} from "../../../../core/errors/handler/errorHandler";

export const deletePostHandler =async (req:Request,res:Response) =>{

    const id = req.params.id;

   try {
       await postService.deletePost(id)

       res.sendStatus(HttpStatuses.NoContent);
   }catch (e){
       errorHandler(e,res)
   }

}