import {Router} from "express";
import {getUserListHandler} from "./handlers/get-user-list.handler";
import {SuperAdminGuard} from "../../../auth/routers/middleware/super-admin.guard-middleware";
import {createUserHandler} from "./handlers/create-user.handler";
import {userCreateValidator} from "../validators/user-create.validator";
import {inputValidationResultMiddleware} from "../../../core/middlewares/validation/input-validation-result";
import {idParamValidator} from "../../../core/middlewares/validation/id-param.validator";
import {deleteUserHandler} from "./handlers/delete-user.handler";
import {paginationSortingUserList} from "../validators/user-get-list.pagination-sorting";


export const userRouter = Router({})

userRouter.use(SuperAdminGuard)


userRouter
    .get('',paginationSortingUserList,inputValidationResultMiddleware,getUserListHandler)
    .post('',userCreateValidator,inputValidationResultMiddleware,createUserHandler)
    .delete('/:id',idParamValidator,deleteUserHandler)

