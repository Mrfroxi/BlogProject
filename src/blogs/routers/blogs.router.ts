import {Router} from "express";
import {getBlogsListHandler} from "./handlers/get-blogs-list.handler";
import {getBlogHandler} from "./handlers/get-blog.handler";
import {IdParamValidator} from "../../core/validators/id-param.validator";
import {inputValidationResultMiddleware} from "../../core/validators/input-validation-result";
import {createBlogHandler} from "./handlers/create-blog.handler";
import {blogCreateValidator} from "../validators/blog-create.validator";
import {SuperAdminGuard} from "../../auth/middleware/super-admin.guard-middleware";

export const blogsRouter = Router({});



blogsRouter
    .get('',getBlogsListHandler)
    .get('/:id',IdParamValidator, inputValidationResultMiddleware , getBlogHandler)
    .post('',SuperAdminGuard,blogCreateValidator,inputValidationResultMiddleware ,createBlogHandler )
