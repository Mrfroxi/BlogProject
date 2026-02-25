import { Post } from '../types/post';
import { postUpdateDto } from '../dto/post-update.input';
import { RepositoryNotFoundError } from '../../../core/errors/repository-not-found';
import { PostQueryInput } from '../dto/post-query-input';
import { PostSortField } from '../types/post-sort-fields';
import { mapPostToOutput } from '../routers/mappers/map-post-to-output';
import { PostOutput } from '../dto/post.output';
import { PostModel, IPost } from '../../../db/schemas/post.schema';
import { injectable } from 'inversify';

@injectable()
export class PostsRepository {
  async findAll(
    querySetup: PostQueryInput<PostSortField>
  ): Promise<{ items: IPost[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm, blogId } = querySetup;

    const skip = (pageNumber - 1) * pageSize;

    const filter: any = {};

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' };
    }

    if (blogId) {
      filter.blogId = blogId;
    }

    const items = await PostModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize);

    const totalCount = await PostModel.countDocuments(filter);

    return { items, totalCount };
  }

  async findById(id: string): Promise<PostOutput | null> {
    const postResult = await PostModel.findById(id);

    if (!postResult) {
      return null;
    }

    return mapPostToOutput(postResult);
  }

  async createPost(newPost: Post): Promise<IPost> {
    return PostModel.create(newPost);
  }

  async updatePost(id: string, dto: postUpdateDto): Promise<void> {
    const updateResult = await PostModel.updateOne(
      { _id: id },
      {
        $set: {
          title: dto.title,
          shortDescription: dto.shortDescription,
          content: dto.content,
          blogId: dto.blogId,
        },
      }
    );

    if (updateResult.matchedCount < 1) {
      throw new RepositoryNotFoundError('Post not exist');
    }

    return;
  }

  async deletePost(id: string): Promise<void> {
    const deleteResult = await PostModel.deleteOne({ _id: id });

    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError('Post not exist');
    }

    return;
  }
}
