import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { LikeService } from '../services/like.service';
import { ResultStatus } from '../../../core/object-result/resultCode';
import { resultCodeToHttpException } from '../../../core/object-result/resultCodeToHttpException';
import { HttpStatuses } from '../../../core/types/http-statuses';

@injectable()
export class LikeController {
  constructor(@inject(LikeService) private likeService: LikeService) {}

  async setLikeStatus(req: Request, res: Response) {
    const commentId = req.params.commentId;
    const userId = req.userId!;
    const { likeStatus } = req.body;

    const result = await this.likeService.setLikeStatus(commentId, userId, likeStatus);

    if (result.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(result.status)).send(result.extensions);
    }

    res.sendStatus(HttpStatuses.NoContent);
  }
}
