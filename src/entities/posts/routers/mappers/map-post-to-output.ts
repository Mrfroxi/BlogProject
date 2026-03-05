import { PostOutput } from '../../dto/post.output';
import { IPost } from '../../../../db/schemas/post.schema';
import { PostLikeStatus } from '../../../../db/schemas/post-like.schema';

export function mapPostToOutput(post: IPost): PostOutput {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
    extendedLikesInfo: {
      likesCount: post.likesCount || 0,
      dislikesCount: post.dislikesCount || 0,
      myStatus: PostLikeStatus.None,
      newestLikes: [],
    },
  };
}
