import { Router } from 'express';
import { container } from '../../../composition-root';
import { UserController } from './user.controller';
import { SuperAdminGuard } from '../../../auth/routers/middleware/super-admin.guard-middleware';
import { userCreateValidator } from '../validators/user-create.validator';
import { inputValidationResultMiddleware } from '../../../core/middlewares/validation/input-validation-result';
import { idParamValidator } from '../../../core/middlewares/validation/id-param.validator';
import { paginationSortingUserList } from '../validators/user-get-list.pagination-sorting';

export const userRouter = Router({});

const userController = container.get<UserController>(UserController);

userRouter.use(SuperAdminGuard);

userRouter
  .get('', paginationSortingUserList, inputValidationResultMiddleware, userController.getUserList.bind(userController))
  .post('', userCreateValidator, inputValidationResultMiddleware, userController.createUser.bind(userController))
  .delete('/:id', idParamValidator, userController.deleteUser.bind(userController));
