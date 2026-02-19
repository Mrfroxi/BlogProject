import { Router } from 'express';
import { container } from '../../../composition-root';
import { CommentController } from './comment.controller';
import { idParamValidator } from '../validators/comment-id.validator';
import { inputValidationResultMiddleware } from '../../../core/middlewares/validation/input-validation-result';
import { JwtAuthorizations } from '../../../auth/routers/middleware/jwt-authorizations.guard-middleware';
import { dataValidator } from '../validators/dataValidator';

export const commentRouter = Router({});

const commentController = container.get<CommentController>(CommentController);

commentRouter
  .get('/:id', idParamValidator('id'), inputValidationResultMiddleware, commentController.getComment.bind(commentController))
  .delete(
    '/:commentId',
    JwtAuthorizations,
    idParamValidator('commentId'),
    inputValidationResultMiddleware,
    commentController.deleteComment.bind(commentController)
  )
  .put(
    '/:commentId',
    JwtAuthorizations,
    idParamValidator('commentId'),
    dataValidator,
    inputValidationResultMiddleware,
    commentController.updateComment.bind(commentController)
  );
