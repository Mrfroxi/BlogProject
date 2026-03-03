import { Router } from 'express';
import { container } from '../../../composition-root';
import { PostController } from './post.controller';
import { idParamValidator } from '../../../core/middlewares/validation/id-param.validator';
import { SuperAdminGuard } from '../../../auth/routers/middleware/super-admin.guard-middleware';
import { paginationSortingValidator } from '../../../core/middlewares/validation/pagination.sorting.validator';
import { PostSortField } from '../types/post-sort-fields';
import { postCreateValidator } from '../validators/post-create.validator';
import { postUpdateValidator } from '../validators/post-update.validator';
import { inputValidationResultMiddleware } from '../../../core/middlewares/validation/input-validation-result';
import { createCommentValidator } from '../validators/postId.validator';
import { JwtAuthorizations } from '../../../auth/routers/middleware/jwt-authorizations.guard-middleware';
import { JwtOptionalAuthorization } from '../../../auth/routers/middleware/jwt-optional-authorization.middleware';
import { getAllPostCommentsValidator } from '../validators/post-getAll.sorting.validation';

export const postsRouter = Router({});

const postController = container.get<PostController>(PostController);

postsRouter
  .get(
    '',
    paginationSortingValidator(PostSortField),
    inputValidationResultMiddleware,
    postController.getPostList.bind(postController)
  )

  .get('/:id', idParamValidator, inputValidationResultMiddleware, postController.getPost.bind(postController))
  .post(
    '',
    SuperAdminGuard,
    postCreateValidator,
    inputValidationResultMiddleware,
    postController.createPost.bind(postController)
  )
  .put(
    '/:id',
    SuperAdminGuard,
    idParamValidator,
    postUpdateValidator,
    inputValidationResultMiddleware,
    postController.updatePost.bind(postController)
  )
  .delete(
    '/:id',
    SuperAdminGuard,
    idParamValidator,
    inputValidationResultMiddleware,
    postController.deletePost.bind(postController)
  )

  .post(
    '/:postId/comments',
    JwtAuthorizations,
    createCommentValidator,
    inputValidationResultMiddleware,
    postController.createPostComment.bind(postController)
  )

  .get(
    '/:postId/comments',
    JwtOptionalAuthorization,
    getAllPostCommentsValidator,
    inputValidationResultMiddleware,
    postController.getAllPostComments.bind(postController)
  );
