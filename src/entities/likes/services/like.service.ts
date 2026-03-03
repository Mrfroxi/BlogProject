import { LikeStatus } from '../../../db/schemas/likes.shema';
import { injectable, inject } from 'inversify';
import { LikeRepository } from '../repositories/like.repository';
import { CommentRepository } from '../../comments/repositories/commentRepository';
import { ResultType } from '../../../core/object-result/result.type';
import { ResultStatus } from '../../../core/object-result/resultCode';

@injectable()
export class LikeService {
  constructor(
    @inject(LikeRepository) private likeRepository: LikeRepository,
    @inject(CommentRepository) private commentRepository: CommentRepository
  ) {}

  async setLikeStatus(
    commentId: string,
    userId: string,
    status: LikeStatus
  ): Promise<ResultType<boolean>> {
    const comment = await this.commentRepository.findById(commentId);

    if (!comment) {
      return {
        status: ResultStatus.NotFound,
        data: false,
        extensions: [{ field: 'commentId', message: 'Comment not found' }],
      };
    }

    await this.likeRepository.setLikeStatus(commentId, userId, status);

    await this.updateCommentCounters(commentId);

    return {
      status: ResultStatus.Success,
      data: true,
      extensions: [{ field: ' ', message: ' ' }],
    };
  }

  async getLikesInfo(commentId: string): Promise<{ likesCount: number; dislikesCount: number }> {
    return await this.likeRepository.getLikesInfo(commentId);
  }

  async getMyStatus(commentId: string, userId: string): Promise<LikeStatus> {
    let myStatus: LikeStatus = LikeStatus.None;
    if (userId) {
      myStatus = await this.likeRepository.getUserLikeStatus(commentId, userId);
    }

    return myStatus;
  }

  private async updateCommentCounters(commentId: string): Promise<void> {
    const { likesCount, dislikesCount } = await this.likeRepository.getLikesInfo(commentId);

    await this.commentRepository.updateLikesCounters(commentId, likesCount, dislikesCount);
  }
}
