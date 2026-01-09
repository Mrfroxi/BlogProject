import {Router} from "express";
import {getBlogsListHandler} from "./handlers/get-blogs-list.handler";
import {getBlogHandler} from "./handlers/get-blog.handler";
import {idParamValidator} from "../../core/middlewares/validation/id-param.validator";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validation-result";
import {createBlogHandler} from "./handlers/create-blog.handler";
import {blogCreateValidator} from "../validators/blog-create.validator";
import {SuperAdminGuard} from "../../auth/middleware/super-admin.guard-middleware";
import {updateBlogHandler} from "./handlers/update-blog.handler";
import {blogUpdateValidator} from "../validators/blog-update.validator";
import {deleteBlogHandler} from "./handlers/delete-blog.handler";
import {paginationSortingValidator} from "../../core/middlewares/validation/pagination.sorting.validator";
import {BlogSortField} from "../types/blog-sortField";
import {createBlogPostHandler} from "./handlers/create-blog-post";
import {getBlogPostListHandler} from "./handlers/get-blog-post-list";
import {PostSortField} from "../../posts/types/post-sort-fields";

export const blogsRouter = Router({});


blogsRouter
    .get('',
        paginationSortingValidator(BlogSortField),
        inputValidationResultMiddleware,
        getBlogsListHandler)
    .get('/:id',idParamValidator, inputValidationResultMiddleware,
         getBlogHandler)
    .post('',SuperAdminGuard,blogCreateValidator,inputValidationResultMiddleware ,
        createBlogHandler)
    .put('/:id',SuperAdminGuard,idParamValidator,blogUpdateValidator,inputValidationResultMiddleware,
        updateBlogHandler)
    .delete(('/:id'),SuperAdminGuard,idParamValidator,inputValidationResultMiddleware,
        deleteBlogHandler)
    .post('/:id/posts',idParamValidator,inputValidationResultMiddleware,createBlogPostHandler)
    .get('/:id/posts',
        paginationSortingValidator(PostSortField),
        idParamValidator,
        inputValidationResultMiddleware,
        getBlogPostListHandler)