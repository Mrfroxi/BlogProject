import { postCreateDto } from '../dto/post-create.input';
import { Post } from '../types/post';
import { postUpdateDto } from '../dto/post-update.input';
import { WithId } from 'mongodb';
import { Blog } from '../../blogs/types/blog';
import { PostOutput } from '../dto/post.output';
import { ResultStatus } from '../../../core/object-result/resultCode';
import { ResultType } from '../../../core/object-result/result.type';
import { commentCollection } from '../../../db/mongo.db';
import { PostsRepository } from '../repositories/posts.repository';
import { injectable, inject } from 'inversify';

@injectable()
export class PostService {
  constructor(
    @inject(PostsRepository) private postsRepository: PostsRepository
  ) {}

  async findAll(querySetup: any) {
    return this.postsRepository.findAll(querySetup);
  }

  async findPostById(postId: string): Promise<ResultType<PostOutput | null>> {
    const postResult: PostOutput | null = await this.postsRepository.findById(postId);

    if (!postResult) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        extensions: [{ field: 'postId', message: 'Post Not Found' }],
        errorMessage: 'Post Not Found',
      };
    }

    return {
      status: ResultStatus.Success,
      data: postResult,
      extensions: [{ field: ' ', message: ' ' }],
    };
  }

  async createPost(dto: postCreateDto) {
    // Здесь нужно будет получить BlogService через dependency injection
    // когда будем рефакторить BlogService
    const blogService = require('../../blogs/services/blog.service').blogService;
    const blog: WithId<Blog> = await blogService.findById(dto.blogId);

    const createPostDto: Post = {
      blogId: dto.blogId,
      blogName: blog.name,
      content: dto.content ?? 'Default content',
      createdAt: `${new Date().toISOString()}`,
      shortDescription: dto.shortDescription ?? 'Default shortDescription',
      title: dto.title ?? 'Default Title',
    };

    return this.postsRepository.createPost(createPostDto);
  }

  async updatePost(postId: string, reqBody: postUpdateDto) {
    return this.postsRepository.updatePost(postId, reqBody);
  }

  async deletePost(postId: string) {
    return this.postsRepository.deletePost(postId);
  }

  async findAllComments(query: any) {
    const { pageNumber, pageSize, sortBy, sortDirection, postId } = query;

    const skip = (pageNumber - 1) * pageSize;

    const filter = { postId };

    const comments = await commentCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await commentCollection.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    const mappedItems = comments.map((c) => ({
      id: c._id.toString(),
      content: c.content,
      commentatorInfo: c.commentatorInfo,
      createdAt: c.createdAt,
    }));

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: mappedItems,
    };
  }
}
