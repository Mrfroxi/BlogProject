import {Router} from "express";
import {IdParamValidator} from "../../core/middlewares/validation/id-param.validator";
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
    .get('',getPostListHandler)
    .get('/:id', IdParamValidator , inputValidationResultMiddleware , getPostHandler )
    .post('',SuperAdminGuard,createPostValidator,inputValidationResultMiddleware,createPostHandler)
    .put('/:id',SuperAdminGuard ,IdParamValidator ,updatePostValidator, inputValidationResultMiddleware,updatePostHandler)
    .delete('/:id',SuperAdminGuard ,IdParamValidator,inputValidationResultMiddleware,deletePostHandler)

