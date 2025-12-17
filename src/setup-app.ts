import express, {Express,Request,Response} from "express";
import {HttpStatuses} from "./core/types/http-statuses";
import {blogsRouter} from "./blogs/routers/blogs.router";
import {BLOGS_PATH, POSTS_PATH} from "./core/paths/paths";
import {postsRouter} from "./posts/posts.router";


export  const setupApp = (app:Express) => {
    app.use(express.json());

    app.get('/' , (_req:Request, res:Response) =>{
        res.status(HttpStatuses.Ok).send('mainPath')
    })

    app.use(BLOGS_PATH,blogsRouter)
    app.use(POSTS_PATH,postsRouter)

    return app;
}