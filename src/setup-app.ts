import express, {Express,Request,Response} from "express";
import {HttpStatuses} from "./core/types/http-statuses";
import {blogsRouter} from "./blogs/routers/blogs.router";


export  const setupApp = (app:Express) => {
    app.use(express.json());

    app.get('/' , (_req:Request, res:Response) =>{
        res.status(HttpStatuses.Ok).send('mainPath')
    })

    app.use('/blogs',blogsRouter)

    return app;
}