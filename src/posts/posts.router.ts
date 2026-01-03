import {Router} from "express";
import {IdParamValidator} from "../../core/validators/id-param.validator";
import {inputValidationResultMiddleware} from "../../core/validators/input-validation-result";
import {getPostHandler} from "./handlers/get-post.handler";
import {getPostListHandler} from "./handlers/get-posts-list.handler";
import {createPostValidator} from "../validators/post-create.validator";
import {createPostHandler} from "./handlers/create-post.handler";
import {SuperAdminGuard} from "../../auth/middleware/super-admin.guard-middleware";
import {updatePostValidator} from "../validators/post-update.validator";
import {updatePostHandler} from "./handlers/update-post.handler";
import {deletePostHandler} from "./handlers/delete-post.handler";


export const postsRouter = Router({});



postsRouter
    .get('',getPostListHandler)
    .get('/:id', IdParamValidator , inputValidationResultMiddleware , getPostHandler )
    .post('',SuperAdminGuard,createPostValidator,inputValidationResultMiddleware,createPostHandler)
    .put('/:id',SuperAdminGuard ,IdParamValidator ,updatePostValidator, inputValidationResultMiddleware,updatePostHandler)
    .delete('/:id',SuperAdminGuard ,IdParamValidator,inputValidationResultMiddleware,deletePostHandler)

