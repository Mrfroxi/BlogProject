import {Router} from "express";
import {idParamValidator} from "../../core/middlewares/validation/id-param.validator";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validation-result";
import { getPostListHandler } from "./handlers/get-posts-list.handler";
import {SuperAdminGuard} from "../../auth/middleware/super-admin.guard-middleware";
import {getPostHandler} from "./handlers/get-post.handler";
import {createPostHandler} from "./handlers/create-post.handler";
import {updatePostHandler} from "./handlers/update-post.handler";
import {deletePostHandler} from "./handlers/delete-post.handler";
import {paginationSortingValidator} from "../../core/middlewares/validation/pagination.sorting.validator";
import {PostSortField} from "../types/post-sort-fields";
import {postCreateValidator} from "../validators/post-create.validator";
import {postUpdateValidator} from "../validators/post-update.validator";


export const postsRouter = Router({});

postsRouter
    .get('',
        paginationSortingValidator(PostSortField),
        inputValidationResultMiddleware,
        getPostListHandler)
    .get('/:id', idParamValidator , inputValidationResultMiddleware ,
        getPostHandler )
    .post('',SuperAdminGuard,postCreateValidator,inputValidationResultMiddleware,
        createPostHandler)
    .put('/:id',SuperAdminGuard ,idParamValidator ,postUpdateValidator, inputValidationResultMiddleware,
        updatePostHandler)
    .delete('/:id',SuperAdminGuard ,idParamValidator,inputValidationResultMiddleware,
        deletePostHandler)

