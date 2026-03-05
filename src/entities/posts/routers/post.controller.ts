import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { PostService } from '../services/post.service';
import { CommentService } from '../../comments/services/comment.service';
import { matchedData } from 'express-validator';
import { PostQueryInput } from '../dto/post-query-input';
import { PostSortField } from '../types/post-sort-fields';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helper/set-default-sort-and-pagination';
import { mapPostListToOutput } from './mappers/map-posts-list-to-output';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { errorHandler } from '../../../core/errors/handler/errorHandler';
import { ResultType } from '../../../core/object-result/result.type';
import { PostOutput } from '../dto/post.output';
import { ResultStatus } from '../../../core/object-result/resultCode';
import { resultCodeToHttpException } from '../../../core/object-result/resultCodeToHttpException';
import { mapPostToOutput } from './mappers/map-post-to-output';
import { DefaultValuesSortingDto } from '../../user/dto/default-values-sorting.dto';
import { IPost } from '../../../db/schemas/post.schema';

@injectable()
export class PostController {
  constructor(
    @inject(PostService) private postService: PostService,
    @inject(CommentService) private commentService: CommentService
  ) {}

  async getPostList(req: Request, res: Response) {
    try {
      const sanitizedQuery = matchedData<PostQueryInput<PostSortField>>(req, {
        locations: ['query'],
        includeOptionals: false,
      });

      const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);
      const userId = req.userId ?? undefined;

      const { items, totalCount } = await this.postService.findAll(queryInput, userId);

      const blogListOutput = mapPostListToOutput(items, {
        totalCount,
        pageNumber: queryInput.pageNumber,
        pageSize: queryInput.pageSize,
      }, userId);

      res.status(HttpStatuses.Ok).send(blogListOutput);
    } catch (e: unknown) {
      errorHandler(e, res);
    }
  }

  async getPost(req: Request, res: Response) {
    const postId: string = req.params.id;
    const userId = req.userId ?? undefined;

    const postResult: ResultType<PostOutput | null> = await this.postService.findPostById(
      postId,
      userId
    );

    if (postResult.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(postResult.status)).send(postResult.extensions);
    }

    res.status(HttpStatuses.Ok).send(postResult.data);
  }

  async createPost(req: Request, res: Response) {
    const reqBody = req.body;

    try {
      const newPost: IPost = await this.postService.createPost(reqBody);

      res.status(HttpStatuses.Created).send(mapPostToOutput(newPost));
    } catch (e) {
      errorHandler(e, res);
    }
  }

  async updatePost(req: Request, res: Response) {
    try {
      const postId = req.params.id;
      const reqBody = req.body;

      await this.postService.updatePost(postId, reqBody);

      res.sendStatus(HttpStatuses.NoContent);
    } catch (e: unknown) {
      errorHandler(e, res);
    }
  }

  async deletePost(req: Request, res: Response) {
    const id = req.params.id;

    try {
      await this.postService.deletePost(id);

      res.sendStatus(HttpStatuses.NoContent);
    } catch (e) {
      errorHandler(e, res);
    }
  }

  async createPostComment(req: Request, res: Response) {
    const userId = req.userId!;
    const postId = req.params.postId;
    const content = req.body.content;

    const createdComment = await this.commentService.createComment({ userId, postId, content });

    if (createdComment.status !== ResultStatus.Success) {
      return res
        .status(resultCodeToHttpException(createdComment.status))
        .send(createdComment.extensions);
    }

    res.status(HttpStatuses.Created).send(createdComment.data);
  }

  async getAllPostComments(req: Request, res: Response) {
    const matchSortingData: DefaultValuesSortingDto = matchedData(req, {
      locations: ['query', 'params'],
      includeOptionals: true,
    });

    const isVerifyPostId = await this.postService.findPostById(req.params.postId);

    if (isVerifyPostId.status !== ResultStatus.Success) {
      return res.sendStatus(resultCodeToHttpException(isVerifyPostId.status));
    }

    const userId = req.userId ?? null;
    const validatedParams = await this.postService.findAllComments(matchSortingData, userId);

    res.status(HttpStatuses.Ok).send(validatedParams);
  }
}
