import { PostLikeStatus } from '../../../db/schemas/post-like.schema';
import { injectable, inject } from 'inversify';
import { PostLikeRepository } from '../repositories/post-like.repository';
import { PostsRepository } from '../../posts/repositories/posts.repository';
import { ResultType } from '../../../core/object-result/result.type';
import { ResultStatus } from '../../../core/object-result/resultCode';

@injectable()
export class PostLikeService {
  constructor(
    @inject(PostLikeRepository) private postLikeRepository: PostLikeRepository,
    @inject(PostsRepository) private postsRepository: PostsRepository
  ) {}

  async setLikeStatus(
    postId: string,
    userId: string,
    status: PostLikeStatus
  ): Promise<ResultType<boolean>> {
    const post = await this.postsRepository.findById(postId);

    if (!post) {
      return {
        status: ResultStatus.NotFound,
        data: false,
        extensions: [{ field: 'postId', message: 'Post not found' }],
      };
    }

    await this.postLikeRepository.setLikeStatus(postId, userId, status);

    await this.updateCommentCounters(postId);

    return {
      status: ResultStatus.Success,
      data: true,
      extensions: [{ field: ' ', message: ' ' }],
    };
  }

  async getExtendedLikesInfo(postId: string, userId?: string): Promise<{
    likesCount: number;
    dislikesCount: number;
    myStatus: PostLikeStatus;
    newestLikes: Array<{ addedAt: string; userId: string; login: string }>;
  }> {
    const { likesCount, dislikesCount } = await this.postLikeRepository.getLikesInfo(postId);
    const myStatus = userId ? await this.postLikeRepository.getMyStatus(postId, userId) : PostLikeStatus.None;
    const newestLikes = await this.postLikeRepository.getNewestLikes(postId);

    return {
      likesCount,
      dislikesCount,
      myStatus,
      newestLikes,
    };
  }

  private async updateCommentCounters(postId: string): Promise<void> {
    const { likesCount, dislikesCount } = await this.postLikeRepository.getLikesInfo(postId);
    await this.postLikeRepository.updateLikesCounters(postId, likesCount, dislikesCount);
  }
}
