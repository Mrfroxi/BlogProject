import {Router} from "express";
import {getBlogsListHandler} from "./handlers/get-blogs-list.handler";
import {getBlogHandler} from "./handlers/get-blog.handler";

export const blogsRouter = Router({});


blogsRouter
    .get('', getBlogsListHandler)
    .get('/:id',getBlogHandler)
    .post('', )
