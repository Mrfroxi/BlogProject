import express, {Express,Request,Response} from "express";
import {HttpStatuses} from "./core/types/http-statuses";
import {blogsRouter} from "./entities/blogs/routers/blogs.router";
import {AUTH_PATH, BLOGS_PATH, POSTS_PATH, TEST_ALLDATA_PATH, USER_PATH} from "./core/paths/paths";
import {testAllDataRouter} from "./core/reset/routers/testAllData.router";
import {postsRouter} from "./entities/posts/routers/posts.router";
import {userRouter} from "./entities/user/routers/user.router";
import {authRoute} from "./auth/routers/auth.router";


export  const setupApp = (app:Express) => {
    app.use(express.json());

    app.get('/' , (_req:Request, res:Response) =>{
        res.status(HttpStatuses.Ok).send('testEndPoint')
    })

    app.use(BLOGS_PATH,blogsRouter)
    app.use(POSTS_PATH,postsRouter)
    app.use(USER_PATH,userRouter)
    app.use(AUTH_PATH,authRoute)
    app.use(TEST_ALLDATA_PATH,testAllDataRouter)

    return app;
}