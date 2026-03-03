import { Router } from 'express';
import { container } from '../../../composition-root';
import { CommentController } from './comment.controller';
import { LikeController } from '../../likes/routers/like.controller';
import { idParamValidator } from '../validators/comment-id.validator';
import { inputValidationResultMiddleware } from '../../../core/middlewares/validation/input-validation-result';
import { JwtAuthorizations } from '../../../auth/routers/middleware/jwt-authorizations.guard-middleware';
import { JwtOptionalAuthorization } from '../../../auth/routers/middleware/jwt-optional-authorization.middleware';
import { dataValidator, likeStatusValidator } from '../validators/dataValidator';

export const commentRouter = Router({});

const commentController = container.get<CommentController>(CommentController);
const likeController = container.get<LikeController>(LikeController);

commentRouter
  .get('/:id', JwtOptionalAuthorization, idParamValidator('id'), inputValidationResultMiddleware, commentController.getComment.bind(commentController))
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
  )
  .put(
    '/:commentId/like-status',
    JwtAuthorizations,
    idParamValidator('commentId'),
    likeStatusValidator,
    inputValidationResultMiddleware,
    likeController.setLikeStatus.bind(likeController)
  );
