import {Router} from "express";
import {idParamValidator} from "../../core/middlewares/validation/id-param.validator";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validation-result";
import { getPostListHandler } from "./handlers/get-posts-list.handler";
import {SuperAdminGuard} from "../../auth/middleware/super-admin.guard-middleware";
import {createPostValidator} from "../validators/post-create.validator";
import {updatePostValidator} from "../validators/post-update.validator";
import {getPostHandler} from "./handlers/get-post.handler";
import {createPostHandler} from "./handlers/create-post.handler";
import {updatePostHandler} from "./handlers/update-post.handler";
import {deletePostHandler} from "./handlers/delete-post.handler";


export const postsRouter = Router({});

postsRouter
    .get('',
        getPostListHandler)
    .get('/:id', idParamValidator , inputValidationResultMiddleware ,
        getPostHandler )
    .post('',SuperAdminGuard,createPostValidator,inputValidationResultMiddleware,
        createPostHandler)
    .put('/:id',SuperAdminGuard ,idParamValidator ,updatePostValidator, inputValidationResultMiddleware,
        updatePostHandler)
    .delete('/:id',SuperAdminGuard ,idParamValidator,inputValidationResultMiddleware,
        deletePostHandler)

