import {Router,Request,Response} from "express";
import {HttpStatuses} from "../../types/http-statuses";
import {blogCollection, postCollection, userCollection} from "../../../db/mongo.db";


export const testAllDataRouter = Router({})



testAllDataRouter.delete('/all-data' ,async (_req:Request,res:Response) => {

    await Promise.all([
        blogCollection.deleteMany(),
        postCollection.deleteMany(),
        userCollection.deleteMany(),
    ]);

    res.sendStatus(HttpStatuses.NoContent);
})