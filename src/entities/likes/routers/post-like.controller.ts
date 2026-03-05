import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { PostLikeService } from '../services/post-like.service';
import { ResultStatus } from '../../../core/object-result/resultCode';
import { resultCodeToHttpException } from '../../../core/object-result/resultCodeToHttpException';
import { HttpStatuses } from '../../../core/types/http-statuses';

@injectable()
export class PostLikeController {
  constructor(@inject(PostLikeService) private postLikeService: PostLikeService) {}

  async setLikeStatus(req: Request, res: Response) {
    const postId = req.params.postId;
    const userId = req.userId!;
    const { likeStatus } = req.body;

    const result = await this.postLikeService.setLikeStatus(postId, userId, likeStatus);

    if (result.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(result.status)).send(result.extensions);
    }

    res.sendStatus(HttpStatuses.NoContent);
  }
}
