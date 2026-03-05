import { Request, Response } from 'express';
import { matchedData } from 'express-validator';

import { injectable, inject } from 'inversify';
import { BlogService } from '../services/blog.service';
import { PostService } from '../../posts/services/post.service';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helper/set-default-sort-and-pagination';
import { mapBlogsListToOutput } from './mappers/map-blogs-list-to-output';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { errorHandler } from '../../../core/errors/handler/errorHandler';
import { WithId } from 'mongodb';
import { Blog } from '../types/blog';
import { mapBlogToOutput } from './mappers/map-blog-to-output';
import { mapPostToOutput } from '../../posts/routers/mappers/map-post-to-output';
import { PostQueryInput } from '../../posts/dto/post-query-input';
import { PostSortField } from '../../posts/types/post-sort-fields';
import { mapPostListToOutput } from '../../posts/routers/mappers/map-posts-list-to-output';

@injectable()
export class BlogController {
  constructor(
    @inject(BlogService) private blogService: BlogService,
    @inject(PostService) private postService: PostService
  ) {}

  async getBlogsList(req: Request, res: Response) {
    try {
      const sanitizedQuery = matchedData(req, {
        locations: ['query'],
        includeOptionals: true,
      });

      const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

      const { items, totalCount } = await this.blogService.findAll(queryInput);

      const blogListOutput = mapBlogsListToOutput(items, {
        totalCount,
        pageNumber: queryInput.pageNumber,
        pageSize: queryInput.pageSize,
      });

      res.status(HttpStatuses.Ok).send(blogListOutput);
    } catch (e) {
      errorHandler(e, res);
    }
  }

  async getBlog(req: Request, res: Response) {
    const blogId: string = req.params.id;

    try {
      const blog: WithId<Blog> = await this.blogService.findById(blogId);

      res.status(HttpStatuses.Ok).send(mapBlogToOutput(blog));
    } catch (e) {
      errorHandler(e, res);
    }
  }

  async createBlog(req: Request, res: Response) {
    const { body } = req;
    try {
      const createdBlog: WithId<Blog> = await this.blogService.createBlog(body);

      res.status(HttpStatuses.Created).send(mapBlogToOutput(createdBlog));
    } catch (e: unknown) {
      errorHandler(e, res);
    }
  }

  async updateBlog(req: Request, res: Response) {
    try {
      const blogId = req.params.id;
      const reqBody = req.body;

      await this.blogService.updateBlog(blogId, reqBody);

      res.sendStatus(HttpStatuses.NoContent);
    } catch (e: unknown) {
      errorHandler(e, res);
    }
  }

  async deleteBlog(req: Request, res: Response) {
    const id = req.params.id;

    try {
      await this.blogService.deleteBlog(id);

      res.sendStatus(HttpStatuses.NoContent);
    } catch (e: unknown) {
      errorHandler(e, res);
    }
  }

  async createBlogPost(req: Request, res: Response) {
    const blogId = req.params.blogId;
    const reqBody = req.body;

    try {
      const createdPost = await this.postService.createPost({ blogId, ...reqBody });

      res.status(HttpStatuses.Created).send(mapPostToOutput(createdPost));
    } catch (e: unknown) {
      errorHandler(e, res);
    }
  }

  async getBlogPostList(req: Request, res: Response) {
    try {
      const blogId = req.params.blogId;
      const userId = req.userId ?? undefined;

      const sanitizedQuery = matchedData<PostQueryInput<PostSortField>>(req, {
        locations: ['query', 'params'],
        includeOptionals: true,
      });

      await this.blogService.findById(blogId);

      const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

      const { items, totalCount } = await this.postService.findAll(queryInput, userId);

      res.status(HttpStatuses.Ok).send(
        mapPostListToOutput(items, {
          pageNumber: queryInput.pageNumber,
          pageSize: queryInput.pageSize,
          totalCount,
        }, userId)
      );
    } catch (e: unknown) {
      errorHandler(e, res);
    }
  }
}
