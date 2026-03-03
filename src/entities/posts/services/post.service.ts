import { postCreateDto } from '../dto/post-create.input';
import { Post } from '../types/post';
import { postUpdateDto } from '../dto/post-update.input';
import { PostOutput } from '../dto/post.output';
import { ResultStatus } from '../../../core/object-result/resultCode';
import { ResultType } from '../../../core/object-result/result.type';
import { CommentModel } from '../../../db/schemas/comment.schema';
import { PostsRepository } from '../repositories/posts.repository';
import { BlogService } from '../../blogs/services/blog.service';
import { LikeService } from '../../likes/services/like.service';
import { LikeStatus } from '../../../db/schemas/likes.shema';
import { injectable, inject } from 'inversify';

@injectable()
export class PostService {
  constructor(
    @inject(PostsRepository) private postsRepository: PostsRepository,
    @inject(BlogService) private blogService: BlogService,
    @inject(LikeService) private likeService: LikeService
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
    const blog = await this.blogService.findById(dto.blogId);

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

  async findAllComments(query: any, userId?: string) {
    const { pageNumber, pageSize, sortBy, sortDirection, postId } = query;

    const skip = (pageNumber - 1) * pageSize;

    const filter = { postId };

    const comments = await CommentModel.find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(pageSize);

    const totalCount = await CommentModel.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    const mappedItems = await Promise.all(
      comments.map(async (c) => {
        const { likesCount, dislikesCount } = await this.likeService.getLikesInfo(c._id.toString());
        const myStatus = userId ? await this.likeService.getMyStatus(c._id.toString(), userId) : LikeStatus.None;

        return {
          id: c._id.toString(),
          content: c.content,
          commentatorInfo: c.commentatorInfo,
          createdAt: c.createdAt,
          likesInfo: {
            likesCount,
            dislikesCount,
            myStatus,
          },
        };
      })
    );

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: mappedItems,
    };
  }
}
