import {Request,Response, NextFunction} from 'express'
import {HttpStatuses} from "../../../core/types/http-statuses";
import {blogService} from "../../services/blog.service";
import {errorHandler} from "../../../core/errors/handler/errorHandler";

export const deleteBlogHandler = async (req:Request,res:Response,next:NextFunction) =>{

    const id = req.params.id;

   try{
       await blogService.deleteBlog(id);

       res.sendStatus(HttpStatuses.NoContent);
   }catch (e:unknown){
       errorHandler(e,res)
   }


}