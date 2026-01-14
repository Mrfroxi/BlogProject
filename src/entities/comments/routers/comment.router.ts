import {Router} from "express";
import {idParamValidator} from "../validators/comment-id.validator";
import {getCommentHandler} from "./handlers/get-comment.handler";
import {inputValidationResultMiddleware} from "../../../core/middlewares/validation/input-validation-result";
import {JwtAuthorizations} from "../../../auth/routers/middleware/jwt-authorizations.guard-middleware";
import {deleteCommentHandler} from "./handlers/delete-comment.handler";
import {dataValidator} from "../validators/dataValidator";
import {updateCommentHandler} from "./handlers/put-comment.handler";


export const commentRouter = Router({})
    .get(':id',idParamValidator('id'),inputValidationResultMiddleware,getCommentHandler)
    .delete('commentId',
        JwtAuthorizations,
        idParamValidator('commentId'),
        inputValidationResultMiddleware,
        deleteCommentHandler
        )

    .put('commentId',
        JwtAuthorizations,
        idParamValidator('commentId'),
        dataValidator,
        inputValidationResultMiddleware,
        updateCommentHandler
    )