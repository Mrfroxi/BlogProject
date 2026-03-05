import { WithId } from 'mongodb';
import { Post } from '../../types/post';
import { PaginationOutput } from '../../../blogs/routers/mappers/dto/blog-pagination-output';

export function mapPostListToOutput(
  posts: Array<WithId<Post> & { extendedLikesInfo?: any }>,
  setup: PaginationOutput,
  userId?: string
) {
  const { totalCount, pageNumber, pageSize } = setup;

  const pagesCount = Math.ceil(totalCount / pageSize);

  return {
    page: pageNumber,
    totalCount,
    pagesCount,
    pageSize,
    items: posts.map((post) => ({
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: post.extendedLikesInfo || {
        likesCount: post.likesCount || 0,
        dislikesCount: post.dislikesCount || 0,
        myStatus: 'None',
        newestLikes: [],
      },
    })),
  };
}
