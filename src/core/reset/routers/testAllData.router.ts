import {Router,Request,Response} from "express";
import {HttpStatuses} from "../../types/http-statuses";
import {blogCollection, postCollection} from "../../../db/mongo.db";


export const testAllDataRouter = Router({})



testAllDataRouter.delete('/all-data' ,async (req:Request,res:Response) => {

    await Promise.all([
        blogCollection.deleteMany(),
        postCollection.deleteMany(),
    ]);

    res.sendStatus(HttpStatuses.NoContent);
})