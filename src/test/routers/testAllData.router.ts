import {Router,Request,Response} from "express";
import {db} from "../../db/in-memory.db";
import {HttpStatuses} from "../../core/types/http-statuses";


export const testAllDataRouter = Router({})



testAllDataRouter.delete('/all-data' , (req:Request,res:Response) => {
    db.posts = []
    db.blogs = []


    res.sendStatus(HttpStatuses.NoContent)
})