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

  async getLikesInfo(commentId: string, userId?: string): Promise<{
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus | null;
  }> {
    const { likesCount, dislikesCount } = await this.likeRepository.getLikesInfo(commentId);

    let myStatus: LikeStatus | null = null;
    if (userId) {
      myStatus = await this.likeRepository.getUserLikeStatus(commentId, userId);
    }

    return {
      likesCount,
      dislikesCount,
      myStatus: myStatus || LikeStatus.None,
    };
  }

  private async updateCommentCounters(commentId: string): Promise<void> {
    const { likesCount, dislikesCount } = await this.likeRepository.getLikesInfo(commentId);

    await this.commentRepository.updateLikesCounters(commentId, likesCount, dislikesCount);
  }
}
