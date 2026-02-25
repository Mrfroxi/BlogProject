import { PostOutput } from '../../dto/post.output';
import { IPost } from '../../../../db/schemas/post.schema';

export function mapPostToOutput(post: IPost): PostOutput {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
  };
}
