import { Request, Response } from 'express';

import { CommentService } from '../services/comment.service';
import { injectable, inject } from 'inversify';
import { ResultStatus } from '../../../core/object-result/resultCode';
import { resultCodeToHttpException } from '../../../core/object-result/resultCodeToHttpException';
import { HttpStatuses } from '../../../core/types/http-statuses';

@injectable()
export class CommentController {
  constructor(@inject(CommentService) private commentService: CommentService) {}

  async getComment(req: Request, res: Response) {
    const commentId = req.params.id;

    const commentResult = await this.commentService.findById(commentId);

    if (commentResult.status !== ResultStatus.Success) {
      return res
        .status(resultCodeToHttpException(commentResult.status))
        .send(commentResult.extensions);
    }

    res.status(HttpStatuses.Ok).send(commentResult.data);
  }

  async deleteComment(req: Request, res: Response) {
    const userId = req.userId!;
    const commentId = req.params.commentId;

    const isDelete = await this.commentService.deleteComment({ userId, commentId });

    if (isDelete.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(isDelete.status)).send(isDelete.extensions);
    }

    res.sendStatus(HttpStatuses.NoContent);
  }

  async updateComment(req: Request, res: Response) {
    const commentId = req.params.commentId;
    const { content } = req.body;
    const userId = req.userId!;

    const updatedComment = await this.commentService.updateComment({ commentId, content, userId });

    if (updatedComment.status !== ResultStatus.Success) {
      return res
        .status(resultCodeToHttpException(updatedComment.status))
        .send(updatedComment.extensions);
    }

    res.sendStatus(HttpStatuses.NoContent);
  }
}
